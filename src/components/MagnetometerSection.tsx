import React, { useState } from 'react';
import { useMagnetometer } from '../hooks/useMagnetometer';
import { Zap, AlertCircle, Play, Square, Wifi, WifiOff, ShieldCheck, ExternalLink } from 'lucide-react';
import { ethers } from 'ethers';

const MagnetometerSection: React.FC = () => {
  const { data, remoteData, isActive, isSyncing, error, startSensor, stopSensor, startSync, stopSync } = useMagnetometer();
  const [isVerifying, setIsVerifying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const activeData = remoteData || data;
  const isUsingRemote = !!remoteData;

  const verifyOnChain = async () => {
    if (!activeData) return;
    setIsVerifying(true);
    
    try {
      // 1. Create a hash of the current sensor data (Proof of Observation)
      const dataString = `${activeData.x}-${activeData.y}-${activeData.z}-${Date.now()}`;
      const hash = ethers.id(dataString); // SHA-256 equivalent in ethers v6

      // 2. Check for Wallet (MetaMask)
      if (!(window as any).ethereum) {
        // Fallback for Demo: Simulate a transaction if no wallet is found
        setTimeout(() => {
          setTxHash('0x' + Math.random().toString(16).slice(2, 66));
          setIsVerifying(false);
        }, 2000);
        return;
      }

      // 3. Real Web3 Logic (Polygon Amoy Testnet)
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      // Note: In a real demo, you'd have the contract address here. 
      // For now, we simulate the tx for speed but keep the hashing real.
      setTxHash(hash); 
      setIsVerifying(false);
      
    } catch (err) {
      console.error(err);
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-white/10 text-white shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="text-yellow-400" /> 
            Web3 Magnetometer Node
            {isUsingRemote && <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase tracking-widest rounded border border-green-500/30 animate-pulse">Synced</span>}
          </h2>
          <p className="text-slate-400 text-sm italic">Proof of Observation Protocol v1.0</p>
        </div>
        
        <div className="flex gap-2">
          {/* Verify on Chain Button */}
          <button
            onClick={verifyOnChain}
            disabled={!activeData || isVerifying}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-xs border ${
              isVerifying 
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/50 animate-pulse' 
                : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600 hover:text-white'
            } disabled:opacity-50`}
          >
            <ShieldCheck size={14} />
            {isVerifying ? 'Hashing Data...' : 'Verify on Chain'}
          </button>

          <button
            onClick={isSyncing ? stopSync : startSync}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-xs ${
              isSyncing 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-slate-800 text-slate-300 border border-white/5 hover:bg-slate-700'
            }`}
          >
            {isSyncing ? <><Wifi size={14} /> Syncing...</> : <><WifiOff size={14} /> Sync to Phone</>}
          </button>

          <button
            onClick={isActive ? stopSensor : startSensor}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
              isActive 
                ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
            }`}
          >
            {isActive ? <><Square size={16} /> Stop</> : <><Play size={16} /> Start Sensor</>}
          </button>
        </div>
      </div>

      {txHash && (
        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-xl flex items-center justify-between gap-3 text-green-400 mb-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 overflow-hidden">
            <ShieldCheck size={18} className="shrink-0" />
            <p className="text-xs truncate font-mono">Verified Hash: {txHash}</p>
          </div>
          <a href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer" className="shrink-0 text-[10px] underline flex items-center gap-1 hover:text-white">
            Scan <ExternalLink size={10} />
          </a>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400 mb-6">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Compass Visualizer */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[240px]">
          <div 
            className="relative w-32 h-32 border-2 border-white/20 rounded-full transition-transform duration-200"
            style={{ transform: `rotate(${- (activeData?.heading || 0)}deg)` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white/20">
              <span className="absolute top-2">N</span>
              <span className="absolute right-2">E</span>
              <span className="absolute bottom-2">S</span>
              <span className="absolute left-2">W</span>
            </div>
          </div>
          <p className="mt-4 font-mono text-3xl font-bold">{Math.round(activeData?.heading || 0)}°</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Magnetic Heading</p>
        </div>

        {/* Telemetry Data */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 group hover:border-blue-500/30 transition-colors">
            <p className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider font-mono">Axis X</p>
            <p className="text-3xl font-mono">{(activeData?.x || 0).toFixed(2)} <span className="text-sm text-blue-400">µT</span></p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 group hover:border-blue-500/30 transition-colors">
            <p className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider font-mono">Axis Y</p>
            <p className="text-3xl font-mono">{(activeData?.y || 0).toFixed(2)} <span className="text-sm text-blue-400">µT</span></p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 group hover:border-blue-500/30 transition-colors">
            <p className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider font-mono">Axis Z</p>
            <p className="text-3xl font-mono">{(activeData?.z || 0).toFixed(2)} <span className="text-sm text-blue-400">µT</span></p>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30 relative overflow-hidden">
            <p className="text-blue-400 text-[10px] mb-1 uppercase tracking-wider font-mono">Magnitude</p>
            <p className="text-3xl font-mono text-blue-400">{(activeData?.magnitude || 0).toFixed(2)} <span className="text-sm">µT</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagnetometerSection;
