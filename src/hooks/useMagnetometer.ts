import { useState, useEffect, useCallback, useRef } from 'react';

export interface MagnetometerData {
  x: number;
  y: number;
  z: number;
  heading: number;
  magnitude: number;
}

// Auto-detect the server's IP — works for both laptop and phone
const SERVER_IP = window.location.hostname;
const WS_URL = `ws://${SERVER_IP}:8081`;

export const useMagnetometer = () => {
  const [data, setData] = useState<MagnetometerData | null>(null);
  const [remoteData, setRemoteData] = useState<MagnetometerData | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Store latest data ref to use inside WS callback
  const latestDataRef = useRef<MagnetometerData | null>(null);

  const handleOrientation = useCallback((event: any) => {
    // Try to get absolute heading (compass)
    let heading = 0;
    if (event.webkitCompassHeading) {
      heading = event.webkitCompassHeading; // iOS
    } else if (event.alpha !== null) {
      heading = 360 - event.alpha; // Android/Generic
    }

    const noise = () => (Math.random() - 0.5) * 0.5;

    const beta = event.beta || 0;
    const gamma = event.gamma || 0;

    const x = (Math.sin(beta * (Math.PI / 180)) * 45) + noise();
    const y = (Math.sin(gamma * (Math.PI / 180)) * 45) + noise();
    const z = (Math.cos(beta * (Math.PI / 180)) * 45) + noise() + 10;

    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const newData: MagnetometerData = { x, y, z, heading, magnitude };

    latestDataRef.current = newData;
    setData(newData);

    // Send to sync server (phone → laptop)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(newData));
    }
  }, []);

  const startSync = useCallback(() => {
    // Close any existing connection
    if (wsRef.current) wsRef.current.close();

    console.log(`[IonWatch Sync] Connecting to ${WS_URL}`);
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('[IonWatch Sync] ✅ Connected to sync server');
      setIsSyncing(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const received = JSON.parse(event.data);
        setRemoteData(received);
      } catch (e) {
        console.error('Failed to parse sync data', e);
      }
    };

    ws.onclose = () => {
      console.log('[IonWatch Sync] ❌ Disconnected');
      setIsSyncing(false);
    };

    ws.onerror = (e) => {
      console.error('[IonWatch Sync] Error:', e);
      setError(`Sync server not reachable at ${WS_URL}`);
      setIsSyncing(false);
    };

    wsRef.current = ws;
  }, []);

  const stopSync = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setRemoteData(null);
    setIsSyncing(false);
  }, []);

  const startSensor = useCallback(async () => {
    try {
      // For iOS 13+ devices
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setError('Permission denied. Please allow sensor access.');
          return;
        }
      }

      // Use absolute orientation for compass if available
      if ('ondeviceorientationabsolute' in window) {
        window.addEventListener('deviceorientationabsolute', handleOrientation);
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }

      setIsActive(true);
      setError(null);
    } catch (err) {
      setError('Sensor not supported on this browser/device.');
      console.error(err);
    }
  }, [handleOrientation]);

  const stopSensor = useCallback(() => {
    window.removeEventListener('deviceorientationabsolute', handleOrientation);
    window.removeEventListener('deviceorientation', handleOrientation);
    setIsActive(false);
    setData(null);
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      stopSensor();
      stopSync();
    };
  }, [stopSensor, stopSync]);

  return { data, remoteData, isActive, isSyncing, error, startSensor, stopSensor, startSync, stopSync };
};
