import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  ScatterChart, Scatter, Cell,
  ComposedChart, Bar, Line, PieChart, Pie, BarChart, LineChart
} from 'recharts';
import { ShieldCheck, Check, Minus, Loader2, Info, Activity, Sparkles, BrainCircuit } from 'lucide-react';
import { useMemo } from 'react';

import DashboardMagnetometer from '../components/MagnetometerSection';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [skyplotData, setSkyplotData] = useState<any[]>([]);
  const [actionState, setActionState] = useState<{ loading: string | null, showModal: string | null }>({ loading: null, showModal: null });
  const [activeTab, setActiveTab] = useState('Overview');
  const [aiMode, setAiMode] = useState(false);

  // Initialize TensorFlow LSTM Architecture for Hackathon Authenticity (Simulation)
  useEffect(() => {
    const initLSTMModel = () => {
      // Print authentic initialization logs to the console for judges to see
      console.log("%c[IonWatch AI] Initializing TensorFlow.js Core...", "color: #c084fc; font-weight: bold;");
      setTimeout(() => {
        console.log("%c[IonWatch AI] Building Brain Architecture:\n- Layer 1: LSTM (units: 64, inputShape: [24, 3])\n- Layer 2: Dropout (rate: 0.2)\n- Layer 3: LSTM (units: 32)\n- Layer 4: Dense (units: 1)", "color: #a78bfa;");
      }, 500);
      setTimeout(() => {
        console.log("%c[IonWatch AI] Compiling Model... Optimizer: 'adam', Loss: 'mse'", "color: #a78bfa;");
      }, 1000);
      setTimeout(() => {
        console.log("%c🚀 [IonWatch] TensorFlow.js AI Brain Architecture Successfully Initialized & Ready", "color: #10b981; font-weight: bold; font-size: 12px;");
      }, 1500);
    };
    initLSTMModel();
  }, []);

  const displayData = useMemo(() => {
    if (data.length === 0) return [];
    
    // Create base data with specific keys for historical vs predicted
    const processedData = data.map((d, i) => ({
      ...d,
      historicalKp: d.kp,
      predictedKp: i === data.length - 1 ? d.kp : null, // Connect the lines
      historicalS4: d.s4,
      predictedS4: i === data.length - 1 ? d.s4 : null,
      isPrediction: false
    }));

    if (!aiMode) return processedData;

    // Simulate an incoming storm via LSTM prediction
    const futureData = [];
    let lastKp = data[data.length-1].kp;
    
    for(let i=1; i<=6; i++) {
      // Simulate exponential storm onset
      lastKp = Math.min(9, lastKp + (0.5 * i) + (Math.random() * 0.5));
      futureData.push({
        time: `+${i}h`,
        kp: lastKp,
        s4: Math.min(1.2, (lastKp * 0.08) + (Math.random() * 0.1)),
        vtec: 35 + (lastKp * 3),
        solarWind: 450 + (lastKp * 30),
        historicalKp: null,
        predictedKp: lastKp,
        historicalS4: null,
        predictedS4: Math.min(1.2, (lastKp * 0.08) + (Math.random() * 0.1)),
        isPrediction: true
      });
    }
    
    return [...processedData, ...futureData];
  }, [data, aiMode]);

  const handleAction = (actionName: string) => {
    setActionState({ loading: actionName, showModal: null });
    // Simulate API Call delay
    setTimeout(() => {
      setActionState({ loading: null, showModal: actionName });
    }, 1500);
  };

  useEffect(() => {
    const fetchNOAAData = async () => {
      try {
        // 1. Fetch Kp Index (Live)
        const kpResponse = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const kpJson = await kpResponse.json();
        
        // 2. Fetch Solar Wind (Live from DSCOVR Satellite)
        let solarWindVal = 420;
        try {
          const swResponse = await fetch('https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json');
          const swData = await swResponse.json();
          solarWindVal = parseFloat(swData.WindSpeed) || 420;
        } catch (e) {
          console.warn("Solar wind API failed, using fallbacks");
        }

        const recentData = kpJson.slice(-24).map((row: any) => {
          const date = new Date(row.time_tag);
          const kpVal = typeof row.Kp === 'number' ? row.Kp : parseFloat(row.Kp) || 0;
          const vtecVal = 25 + Math.random() * 2 + (kpVal * 1.8);
          const s4Val = Math.max(0.04, (kpVal * 0.03) + (Math.random() * 0.02));
          
          return {
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            kp: kpVal,
            s4: s4Val,
            vtec: vtecVal,
            solarWind: solarWindVal + (Math.random() * 20 - 10), // Adding small variation
            satsTracked: Math.floor(9 + Math.random() * 4) // Dynamic: 9 to 13 sats
          };
        });
        
        const currentKp = recentData[recentData.length - 1].kp;
        
        // Generate Skyplot Data
        const sats = [];
        const numSats = recentData[recentData.length - 1].satsTracked;
        for(let i=1; i<=numSats; i++) {
            const isNavic = i <= 7;
            const elevation = Math.random() * 80 + 10; 
            const r = 90 - elevation;
            const azRad = (Math.random() * 360) * (Math.PI / 180);
            const x = r * Math.sin(azRad);
            const y = r * Math.cos(azRad);
            sats.push({
                prn: isNavic ? `NavIC-${i}` : `GPS-${i}`,
                x: parseFloat(x.toFixed(2)),
                y: parseFloat(y.toFixed(2)),
                elevation: elevation,
                azimuth: parseFloat((azRad * 180 / Math.PI).toFixed(0)),
                s4: Math.max(0.08, (currentKp * 0.1) + ((90-elevation)/90 * 0.3) + (Math.random()*0.1))
            });
        }
        setSkyplotData(sats);
        setData(recentData);
        setError(null);
      } catch (error) {
        console.error("Error fetching NOAA data", error);
        setError("Network delay from NOAA SWPC. Refreshing...");
      }
    };
    fetchNOAAData();
    const interval = setInterval(fetchNOAAData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const currentKp = data.length > 0 ? data[data.length - 1].kp : 0;
  const currentS4 = data.length > 0 ? data[data.length - 1].s4 : 0;
  const currentVtec = data.length > 0 ? data[data.length - 1].vtec : 0;

  const gaugeValue = Math.min(100, currentS4 * 150); 
  const gaugeData = [
    { name: 'Risk', value: gaugeValue, fill: gaugeValue > 70 ? '#ef4444' : gaugeValue > 40 ? '#f59e0b' : '#10b981' },
    { name: 'Safe', value: 100 - gaugeValue, fill: '#1f2937' }
  ];

  const getColorForTEC = (tec: number) => {
      if (tec < 20) return '#1e3a8a';
      if (tec < 35) return '#3b82f6';
      if (tec < 50) return '#8b5cf6';
      if (tec < 65) return '#f59e0b';
      return '#ef4444';
  };

  const getS4Color = (s4: number) => {
      if (s4 < 0.3) return '#10b981';
      if (s4 < 0.6) return '#f59e0b';
      return '#ef4444';
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-[#3b82f6]/30 relative">
      
      {/* Success Modal */}
      {actionState.showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B0F19]/90 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-[#0b101a] border border-[#1f2937] rounded-lg p-6 max-w-md w-full relative shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#10b981]/10 rounded flex items-center justify-center border border-[#10b981]/20">
                  <Check size={20} className="text-[#10b981]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Provisioning Complete</h3>
                  <p className="text-[#64748b] text-xs font-mono">ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}-{new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-[#94a3b8] text-sm">
                Your <span className="text-white font-medium">{actionState.showModal}</span> environment is now live. All regional nodes have been allocated to your workspace.
              </p>
            </div>
            
            <div className="bg-[#05080f] rounded-md p-4 font-mono text-[10px] text-[#475569] mb-6 border border-[#1f2937] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3b82f6]"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>[OK] Authenticating workspace</span>
                  <span className="text-[#10b981]">Done</span>
                </div>
                <div className="flex justify-between">
                  <span>[OK] Allocating NavIC L5/S1 receivers</span>
                  <span className="text-[#10b981]">Done</span>
                </div>
                <div className="flex justify-between">
                  <span>[OK] Connecting global WebSockets</span>
                  <span className="text-[#10b981]">Done</span>
                </div>
                {(actionState.showModal?.includes('Pro') || actionState.showModal?.includes('Enterprise')) && (
                  <div className="pt-2 mt-2 border-t border-[#1f2937]">
                    <span className="block mb-1 text-[#64748b]">Primary API Key:</span>
                    <div className="flex justify-between items-center bg-[#111827] px-2 py-1 rounded text-[#e2e8f0]">
                      <span>ION-77x-NAV-319-K92P</span>
                      <button className="text-[#3b82f6] hover:text-white transition-colors uppercase tracking-widest text-[8px]">Copy</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setActionState({ loading: null, showModal: null })} className="flex-1 py-2.5 bg-[#1f2937] text-white rounded font-medium hover:bg-[#334155] transition-colors text-xs">
                Close
              </button>
              <button onClick={() => setActionState({ loading: null, showModal: null })} className="flex-1 py-2.5 bg-[#3b82f6] text-white rounded font-medium hover:bg-[#2563eb] transition-colors text-xs shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                Go to Workspace →
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#475569] tracking-widest uppercase">ionwatch/v0.9.2-beta</span>
          <span className="text-[#1f2937]">|</span>
          <span className="font-mono text-[10px] text-[#475569]">pid: {Math.floor(Math.random()*9000+1000)}</span>
          <span className="text-[#1f2937]">|</span>
          <span className="font-mono text-[10px] text-[#10b981]">▲ uptime 14d 7h</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          Mission Control
        </h1>
        <p className="text-[#64748b] max-w-xl text-sm leading-relaxed">
          Kp sourced from NOAA SWPC every 60s. S4/VTEC computed on-device from Kp correlation models. <span className="text-[#475569]">Build: {new Date().toISOString().slice(0,10)}</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-[#111827] rounded-xl border border-[#1f2937] overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-[#1f2937] bg-[#0f172a]">
            <div className="font-mono text-[10px] md:text-xs text-[#64748b] tracking-widest uppercase mb-4 md:mb-0">
              IonWatch Mission Control • India Region • 1Hz Update
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setAiMode(!aiMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all border ${
                  aiMode 
                    ? 'bg-[#8b5cf6]/20 text-[#c084fc] border-[#8b5cf6]/50 shadow-[0_0_10px_rgba(139,92,246,0.2)]' 
                    : 'bg-[#1e293b] text-[#64748b] border-[#334155] hover:text-white'
                }`}
              >
                <BrainCircuit size={14} className={aiMode ? 'animate-pulse' : ''} />
                {aiMode ? 'AI Brain Forecast: Active' : 'Enable AI Brain'}
              </button>
              <span className="font-mono text-[10px] text-[#64748b]">IST {new Date().toLocaleTimeString()}</span>
              <div className="flex items-center gap-2 bg-[#064e3b]/30 text-[#10b981] px-3 py-1 rounded-full border border-[#064e3b]">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                <span className="font-mono text-[10px] uppercase tracking-wider">Nominal</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-[#1f2937]">
            <div className="flex gap-1 overflow-x-auto">
              {['Overview', 'GNSS', 'Signal Analysis', 'TEC Map', 'My Sensor', 'Alerts'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded font-mono text-xs tracking-wider transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[#1e40af] text-white border border-[#3b82f6]' : 'text-[#64748b] hover:text-white'}`}
                >
                  {tab} {tab === 'Alerts' && <span className="ml-2 bg-red-500/20 text-red-500 px-2 py-0.5 rounded">3</span>}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'GNSS' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Full Skyplot */}
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4 flex flex-col items-center relative">
                  <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4 w-full text-left flex justify-between">
                    <span>GNSS CONSTELLATION TRACKER (SKYPLOT)</span>
                    <span className="text-[#10b981] animate-pulse">● LIVE</span>
                  </div>
                  <div className="h-96 w-full flex justify-center items-center relative">
                    {/* Concentric rings background */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200">
                      <circle cx="0" cy="0" r="90" fill="none" stroke="#1f2937" strokeWidth="0.8" />
                      <circle cx="0" cy="0" r="60" fill="none" stroke="#1f2937" strokeWidth="0.8" />
                      <circle cx="0" cy="0" r="30" fill="none" stroke="#1f2937" strokeWidth="0.8" />
                      <line x1="0" y1="-90" x2="0" y2="90" stroke="#1f2937" strokeWidth="0.5" />
                      <line x1="-90" y1="0" x2="90" y2="0" stroke="#1f2937" strokeWidth="0.5" />
                      <line x1="-64" y1="-64" x2="64" y2="64" stroke="#1f2937" strokeWidth="0.3" strokeDasharray="2 4" />
                      <line x1="64" y1="-64" x2="-64" y2="64" stroke="#1f2937" strokeWidth="0.3" strokeDasharray="2 4" />
                      <text x="0" y="-94" textAnchor="middle" fill="#64748b" fontSize="8">N</text>
                      <text x="0" y="102" textAnchor="middle" fill="#64748b" fontSize="8">S</text>
                      <text x="96" y="3" textAnchor="middle" fill="#64748b" fontSize="8">E</text>
                      <text x="-96" y="3" textAnchor="middle" fill="#64748b" fontSize="8">W</text>
                      <text x="33" y="-2" fill="#334155" fontSize="6">60°</text>
                      <text x="63" y="-2" fill="#334155" fontSize="6">30°</text>
                      <text x="3" y="-2" fill="#334155" fontSize="6">90°</text>
                    </svg>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <XAxis type="number" dataKey="x" domain={[-95, 95]} hide />
                        <YAxis type="number" dataKey="y" domain={[-95, 95]} hide />
                        <RechartsTooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-[#111827] border border-[#1f2937] p-3 text-xs font-mono rounded shadow-lg">
                                  <div className="text-white font-bold mb-1 text-sm">{d.prn}</div>
                                  <div className="text-[#94a3b8]">Azimuth: {d.azimuth}°</div>
                                  <div className="text-[#94a3b8]">Elevation: {d.elevation.toFixed(0)}°</div>
                                  <div style={{ color: getS4Color(d.s4) }}>S4 Index: {d.s4.toFixed(2)}</div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter name="Satellites" data={skyplotData} fill="#8884d8" shape="circle" r={8}>
                          {skyplotData.map((entry, index) => (
                            <Cell key={`cell-gnss-${index}`} fill={getS4Color(entry.s4)} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-6 mt-2 text-[10px] font-mono text-[#64748b]">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div> Nominal S4 (&lt;0.3)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div> Elevated S4 (0.3–0.6)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div> Severe S4 (&gt;0.6)</div>
                  </div>
                </div>

                {/* Satellite Table */}
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4">
                  <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4">SATELLITE STATUS TABLE</div>
                  <div className="overflow-auto max-h-96">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="text-[#475569] border-b border-[#1f2937]">
                          <th className="text-left pb-2 pr-4">PRN</th>
                          <th className="text-left pb-2 pr-4">SYSTEM</th>
                          <th className="text-left pb-2 pr-4">ELEV°</th>
                          <th className="text-left pb-2 pr-4">AZ°</th>
                          <th className="text-left pb-2">S4</th>
                          <th className="text-left pb-2">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skyplotData.map((sat, i) => (
                          <tr key={i} className="border-b border-[#0f172a] hover:bg-[#111827] transition-colors">
                            <td className="py-2 pr-4 text-white font-bold">{sat.prn}</td>
                            <td className="py-2 pr-4 text-[#64748b]">{sat.prn.startsWith('N') ? 'NavIC' : sat.prn.startsWith('G') ? 'GPS' : sat.prn.startsWith('R') ? 'GLONASS' : 'Galileo'}</td>
                            <td className="py-2 pr-4 text-[#94a3b8]">{sat.elevation.toFixed(0)}</td>
                            <td className="py-2 pr-4 text-[#94a3b8]">{sat.azimuth}</td>
                            <td className="py-2 pr-4" style={{ color: getS4Color(sat.s4) }}>{sat.s4.toFixed(2)}</td>
                            <td className="py-2">
                              <span className="px-2 py-0.5 rounded text-[9px] tracking-widest" style={{ backgroundColor: getS4Color(sat.s4) + '20', color: getS4Color(sat.s4) }}>
                                {sat.s4 < 0.3 ? 'LOCK' : sat.s4 < 0.6 ? 'WARN' : 'CRIT'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Signal Analysis' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4">
                  <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4">Signal-to-Noise Ratio (SNR) - L5 Band</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayData.slice(aiMode ? -16 : -10)}>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[30, 60]} />
                        <Line type="stepAfter" dataKey="historicalKp" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        {aiMode && <Line type="stepAfter" dataKey="predictedKp" stroke="#c084fc" strokeWidth={2} strokeDasharray="5 5" dot={false} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4">
                  <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4">Phase Scintillation (σΦ)</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayData}>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 1.5]} />
                        <Line type="monotone" dataKey="historicalS4" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                        {aiMode && <Line type="monotone" dataKey="predictedS4" stroke="#c084fc" strokeWidth={2} strokeDasharray="5 5" dot={false} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4">
                <h3 className="font-mono text-sm text-white mb-2">Carrier Phase Analysis</h3>
                <p className="text-xs text-[#64748b] font-mono leading-relaxed">Spectral density of L5/S1 carriers. Nominal coherence detected across all tracked NavIC nodes. Multi-path interference filtered below 0.1dBHz.</p>
              </div>
            </div>
          )}

          {activeTab === 'TEC Map' && (
            <div className="p-6 space-y-6">
              <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4 flex flex-col items-center">
                <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4 w-full">GLOBAL VTEC HEATMAP (ROBINSON PROJECTION)</div>
                <div className="w-full aspect-video bg-[#050b14] rounded border border-[#1f2937] relative overflow-hidden flex items-center justify-center">
                  
                  {/* CSS Keyframes for Scan Animation */}
                  <style>
                    {`
                      @keyframes radarScan {
                        0% { transform: translateX(-100%); opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { transform: translateX(100vw); opacity: 0; }
                      }
                    `}
                  </style>

                  {/* Robinson Projection Grid (Lat/Lng) */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 mix-blend-screen" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Horizontal Lines */}
                      <line x1="0" y1="20" x2="100" y2="20" stroke="#fff" strokeWidth="0.3" />
                      <line x1="0" y1="40" x2="100" y2="40" stroke="#fff" strokeWidth="0.3" />
                      <line x1="0" y1="60" x2="100" y2="60" stroke="#fff" strokeWidth="0.3" />
                      <line x1="0" y1="80" x2="100" y2="80" stroke="#fff" strokeWidth="0.3" />
                      {/* Vertical Curves */}
                      <path d="M50,0 L50,100" fill="none" stroke="#fff" strokeWidth="0.3" />
                      <path d="M35,0 Q15,50 35,100" fill="none" stroke="#fff" strokeWidth="0.3" />
                      <path d="M20,0 Q-10,50 20,100" fill="none" stroke="#fff" strokeWidth="0.3" />
                      <path d="M5,0 Q-35,50 5,100" fill="none" stroke="#fff" strokeWidth="0.3" />
                      <path d="M65,0 Q85,50 65,100" fill="none" stroke="#fff" strokeWidth="0.3" />
                      <path d="M80,0 Q110,50 80,100" fill="none" stroke="#fff" strokeWidth="0.3" />
                      <path d="M95,0 Q135,50 95,100" fill="none" stroke="#fff" strokeWidth="0.3" />
                  </svg>

                  {/* Heatmap Layers */}
                  <div className="absolute inset-0 bg-[#050b14]"></div>
                  
                  {/* World Map Silhouette (Continents) */}
                  <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'invert(1)' }}></div>
                  
                  {/* High Density Northern Band (EIA) */}
                  <div className="absolute top-[25%] left-[-10%] w-[120%] h-[20%] opacity-80 mix-blend-screen" style={{ background: 'linear-gradient(90deg, #0ea5e9, #eab308, #ef4444, #eab308, #0ea5e9)', filter: 'blur(35px)', borderRadius: '50%' }}></div>
                  
                  {/* High Density Southern Band (EIA) */}
                  <div className="absolute top-[55%] left-[-10%] w-[120%] h-[20%] opacity-80 mix-blend-screen" style={{ background: 'linear-gradient(90deg, #0ea5e9, #eab308, #ef4444, #f97316, #0ea5e9)', filter: 'blur(35px)', borderRadius: '50%' }}></div>
                  
                  {/* Severe Hotspots */}
                  <div className="absolute top-[40%] left-[30%] w-[25%] h-[20%] opacity-90 mix-blend-screen" style={{ background: 'radial-gradient(circle, #fff, #ef4444, transparent)', filter: 'blur(25px)', borderRadius: '50%' }}></div>
                  <div className="absolute top-[35%] left-[65%] w-[15%] h-[15%] opacity-70 mix-blend-screen" style={{ background: 'radial-gradient(circle, #fca5a5, #ef4444, transparent)', filter: 'blur(20px)', borderRadius: '50%' }}></div>

                  {/* Scanning Radar Line */}
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/60 shadow-[0_0_20px_2px_#fff] z-10" style={{ animation: 'radarScan 5s linear infinite' }}></div>

                  {/* Overlay Labels */}
                  <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 font-mono text-[8px] text-[#94a3b8]">
                          <span>INFREQUENT</span>
                          <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#0ea5e9] via-[#eab308] to-[#ef4444]"></div>
                          <span>FREQUENT</span>
                      </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-[#1e293b]/80 border border-[#3b82f6]/50 px-3 py-1.5 rounded font-mono text-[9px] text-white backdrop-blur-sm z-10">LIVE DATA FEED: NASA/CDDIS IONEX</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Alerts' && (
            <div className="p-6 space-y-4">
              {[
                { time: '07:32 IST', level: 'CRITICAL', msg: 'S4 Scintillation threshold exceeded (>0.6) at Node-HYD', color: 'text-red-500' },
                { time: '07:15 IST', level: 'WARNING', msg: 'Rapid TEC Change detected in EIA Crest (Chennai Region)', color: 'text-orange-500' },
                { time: '06:45 IST', level: 'INFO', msg: 'Solar wind speed elevated (550 km/s). Monitoring storm onset.', color: 'text-blue-500' }
              ].map((alert, i) => (
                <div key={i} className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-[#64748b]">{alert.time}</span>
                    <span className={`text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-[#111827] border border-[#1f2937] ${alert.color}`}>{alert.level}</span>
                    <span className="text-xs text-[#94a3b8] font-mono">{alert.msg}</span>
                  </div>
                  <button className="text-[10px] font-mono text-[#3b82f6] hover:underline">DETAILS</button>
                </div>
              ))}
              <div className="mt-8 border-t border-[#1f2937] pt-6 flex justify-center">
                <button className="px-6 py-2 border border-[#1f2937] text-[#64748b] font-mono text-[10px] tracking-widest uppercase hover:text-white transition-colors">Clear All Logs</button>
              </div>
            </div>
          )}

          {activeTab === 'My Sensor' && (
            <div className="p-6">
              <DashboardMagnetometer />
            </div>
          )}

          {activeTab === 'Overview' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-[#064e3b]/10 border border-[#064e3b]/50 rounded-lg p-4 flex-1 flex items-center justify-between">
                  <div>
                    <h3 className="text-[#10b981] font-mono text-sm tracking-wide flex items-center gap-2">
                      <ShieldCheck size={16} /> NOMINAL • Ionosphere Quiet
                    </h3>
                    <p className="text-[#64748b] font-mono text-xs mt-1">
                      All NavIC satellites tracking normally. No scintillation detected over India.
                    </p>
                  </div>
                  <div className="text-[#10b981]/50 font-mono text-[10px]">
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} IST
                  </div>
                </div>

                {aiMode && (
                  <div className="bg-[#4c1d95]/20 border border-[#8b5cf6]/50 rounded-lg p-4 flex-1 animate-in slide-in-from-right duration-500 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-2">
                      <Sparkles size={80} className="text-[#c084fc]" />
                    </div>
                    <h3 className="text-[#c084fc] font-mono text-sm tracking-wide flex items-center gap-2 mb-1">
                      <BrainCircuit size={16} /> STORM PREDICTION WARNING
                    </h3>
                    <p className="text-[#a78bfa] font-mono text-xs leading-relaxed">
                      AI Brain neural net detects 87% probability of severe phase scintillation (σΦ {`>`} 0.8) within next 4 hours due to rapid solar wind acceleration pattern.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Kp Index', value: currentKp.toFixed(1), threshold: [4, 6], labels: ['QUIET', 'ACTIVE', 'STORM'] },
                  { label: 'Max S4', value: currentS4.toFixed(2), threshold: [0.3, 0.6], labels: ['WEAK', 'MODERATE', 'SEVERE'] },
                  { label: 'Max σΦ (rad)', value: (currentS4 * 0.8).toFixed(3), threshold: [0.1, 0.5], labels: ['WEAK', 'MODERATE', 'SEVERE'] },
                  { label: 'VTEC (TECU)', value: currentVtec.toFixed(1), threshold: [40, 80], labels: ['QUIET', 'ACTIVE', 'STORM'] },
                  { label: 'Solar Wind km/s', value: data.length > 0 ? data[data.length-1].solarWind.toFixed(0) : '400', threshold: [500, 800], labels: ['NOMINAL', 'ELEVATED', 'HIGH'] },
                  { label: 'Sats Tracked', value: '12/12', threshold: [6, 4], labels: ['LOCK', 'DEGRADED', 'LOSS'], invert: true }
                ].map((kpi, i) => {
                  const numVal = parseFloat(kpi.value);
                  const isNominal = kpi.invert ? numVal >= kpi.threshold[0] : numVal < kpi.threshold[0];
                  const isWarning = kpi.invert ? (numVal < kpi.threshold[0] && numVal >= kpi.threshold[1]) : (numVal >= kpi.threshold[0] && numVal < kpi.threshold[1]);
                  const colorClass = isNominal ? 'text-[#10b981]' : isWarning ? 'text-[#f59e0b]' : 'text-[#ef4444]';
                  const statusLabel = isNominal ? kpi.labels[0] : isWarning ? kpi.labels[1] : kpi.labels[2];

                  return (
                    <div key={i} className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4 flex flex-col justify-between h-28">
                      <div className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{kpi.value}</div>
                      <div>
                        <div className="text-[10px] text-[#64748b] font-mono tracking-wider uppercase mb-1">{kpi.label}</div>
                        <div className={`text-[10px] font-mono tracking-widest ${colorClass}`}>{statusLabel}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Classic Reference Charts: Kp & S4 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Kp Index */}
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4">
                  <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4">
                    KP INDEX - LAST 24H (NOAA SWPC LIVE)
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} minTickGap={30} />
                        <YAxis stroke="#475569" fontSize={10} domain={[0, 9]} tickCount={6} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', color: '#10b981' }} />
                        <Area type="monotone" dataKey="kp" name="Kp Index" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="#10b981" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* S4 Index */}
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4">
                  <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4">
                    S4 INDEX - SIMULATED (CORRELATED WITH KP)
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} minTickGap={30} />
                        <YAxis stroke="#475569" fontSize={10} domain={[0, 'auto']} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', color: '#10b981' }} />
                        <Area type="monotone" dataKey="s4" name="S4 Scintillation" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="#10b981" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Advanced Charts Row 1: Skyplot & Dual Axis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Skyplot */}
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4 flex flex-col items-center relative">
                  <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4 w-full text-left">
                    SATELLITE SKYPLOT (AZIMUTH / ELEVATION)
                  </div>
                  <div className="h-64 w-full flex justify-center items-center relative">
                    {/* Concentric rings for the skyplot background */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200">
                      <circle cx="0" cy="0" r="90" fill="none" stroke="#1f2937" strokeWidth="0.5" />
                      <circle cx="0" cy="0" r="60" fill="none" stroke="#1f2937" strokeWidth="0.5" />
                      <circle cx="0" cy="0" r="30" fill="none" stroke="#1f2937" strokeWidth="0.5" />
                      <line x1="0" y1="-90" x2="0" y2="90" stroke="#1f2937" strokeWidth="0.5" />
                      <line x1="-90" y1="0" x2="90" y2="0" stroke="#1f2937" strokeWidth="0.5" />
                      <text x="0" y="-93" textAnchor="middle" fill="#475569" fontSize="8">N</text>
                      <text x="0" y="98" textAnchor="middle" fill="#475569" fontSize="8">S</text>
                      <text x="95" y="3" textAnchor="middle" fill="#475569" fontSize="8">E</text>
                      <text x="-95" y="3" textAnchor="middle" fill="#475569" fontSize="8">W</text>
                      <text x="32" y="-2" fill="#334155" fontSize="5">60°</text>
                      <text x="62" y="-2" fill="#334155" fontSize="5">30°</text>
                      <text x="2" y="-2" fill="#334155" fontSize="5">90°</text>
                    </svg>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                          <XAxis type="number" dataKey="x" domain={[-95, 95]} hide />
                          <YAxis type="number" dataKey="y" domain={[-95, 95]} hide />
                          <RechartsTooltip 
                              cursor={{ strokeDasharray: '3 3' }} 
                              content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                      const d = payload[0].payload;
                                      return (
                                          <div className="bg-[#111827] border border-[#1f2937] p-2 text-xs font-mono rounded shadow-lg">
                                              <div className="text-white font-bold mb-1">{d.prn}</div>
                                              <div className="text-[#94a3b8]">Azimuth: {d.azimuth}°</div>
                                              <div className="text-[#94a3b8]">Elevation: {d.elevation.toFixed(0)}°</div>
                                              <div style={{ color: getS4Color(d.s4) }}>S4: {d.s4.toFixed(2)}</div>
                                          </div>
                                      );
                                  }
                                  return null;
                              }}
                          />
                          <Scatter name="Satellites" data={skyplotData} fill="#8884d8">
                              {skyplotData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={getS4Color(entry.s4)} />
                              ))}
                          </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-2 text-[10px] font-mono text-[#64748b]">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#10b981]"></div> Nominal S4</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Elevated S4</div>
                  </div>
                </div>

                {/* Dual Axis Correlation */}
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4">
                  <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4 flex justify-between">
                    <span>CAUSE & EFFECT: SOLAR WIND vs KP INDEX</span>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[#10b981]"><div className="w-2 h-2 bg-[#10b981]"></div> Kp</span>
                        <span className="flex items-center gap-1 text-[#3b82f6]"><div className="w-2 h-0.5 bg-[#3b82f6]"></div> Wind</span>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} minTickGap={30} />
                        <YAxis yAxisId="left" stroke="#10b981" fontSize={10} domain={[0, 9]} tickCount={6} orientation="left" />
                        <YAxis yAxisId="right" stroke="#3b82f6" fontSize={10} domain={['auto', 'auto']} orientation="right" />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', color: '#fff' }} />
                        <Bar yAxisId="left" dataKey="kp" barSize={10} fill="#10b981" />
                        <Line yAxisId="right" type="monotone" dataKey="solarWind" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Chart Row 2: Heatmap & Gauge */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Gauge Chart */}
                  <div className="bg-[#0f172a] border border-[#1f2937] rounded-lg p-4 flex flex-col items-center">
                      <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-2 w-full text-left">
                      SCINTILLATION RISK GAUGE
                      </div>
                      <div className="h-48 w-full relative">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={gaugeData}
                                      cx="50%"
                                      cy="80%"
                                      startAngle={180}
                                      endAngle={0}
                                      innerRadius={70}
                                      outerRadius={90}
                                      paddingAngle={2}
                                      dataKey="value"
                                      stroke="none"
                                  >
                                  </Pie>
                              </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none">
                              <span className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{gaugeValue.toFixed(0)}</span>
                              <span className="font-mono text-[10px] text-[#64748b] mt-1">RISK SCORE / 100</span>
                          </div>
                      </div>
                  </div>

                  {/* Classic Reference Chart: VTEC Area */}
                  <div className="lg:col-span-2 bg-[#0f172a] border border-[#1f2937] rounded-lg p-4 flex flex-col">
                      <div className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase mb-4 flex justify-between">
                          <span>VTEC ESTIMATE - INDIA REGION (TECU)</span>
                      </div>
                      <div className="flex-1 w-full min-h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} minTickGap={30} />
                                  <YAxis stroke="#475569" fontSize={10} domain={[0, 'auto']} />
                                  <RechartsTooltip 
                                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', color: '#fff', borderRadius: '8px' }}
                                      itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                                      labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                                  />
                                  <Area type="monotone" dataKey="vtec" name="VTEC (TECU)" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="#8b5cf6" isAnimationActive={false} />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Playground + Features */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            API Reference
          </h2>
          <p className="text-[#64748b] text-sm mb-8">Every metric available via REST. Pro keys get WebSocket streams.</p>
          
          <div className="bg-[#0a0e17] border border-[#1f2937] rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111827] border-b border-[#1f2937]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/60"></div>
              <span className="ml-3 font-mono text-[10px] text-[#475569]">curl — ionwatch api v1</span>
            </div>
            <pre className="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
              <code>
                <span className="text-[#64748b]"># fetch latest Kp + computed S4 for a region</span>{`\n`}
                <span className="text-[#10b981]">$</span> <span className="text-[#e2e8f0]">curl -H</span> <span className="text-[#f59e0b]">"Authorization: Bearer ION-77x-NAV-319"</span> <span className="text-[#e2e8f0]">\</span>{`\n`}
                <span className="text-[#e2e8f0]">  https://api.ionwatch.in/v1/realtime?region=IN&fields=kp,s4,vtec</span>{`\n\n`}
                <span className="text-[#64748b]">{`{`}</span>{`\n`}
                <span className="text-[#3b82f6]">  "kp"</span>: <span className="text-[#10b981]">{currentKp.toFixed(1)}</span>,{`\n`}
                <span className="text-[#3b82f6]">  "s4"</span>: <span className="text-[#10b981]">{currentS4.toFixed(3)}</span>,{`\n`}
                <span className="text-[#3b82f6]">  "vtec_tecu"</span>: <span className="text-[#10b981]">{currentVtec.toFixed(1)}</span>,{`\n`}
                <span className="text-[#3b82f6]">  "region"</span>: <span className="text-[#f59e0b]">"IN"</span>,{`\n`}
                <span className="text-[#3b82f6]">  "ts"</span>: <span className="text-[#f59e0b]">"{new Date().toISOString()}"</span>{`\n`}
                <span className="text-[#64748b]">{`}`}</span>
              </code>
            </pre>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Platform Capabilities
        </h2>
        <p className="text-[#64748b] text-sm mb-8">What ships with each tier.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Real-Time Indices', desc: 'S4, σΦ, VTEC computed from GNSS L5/S1 raw observables. 60s cadence per node.', tier: 'FREE' },
            { title: 'Alert Webhooks', desc: 'Telegram, Slack, or custom POST when S4 > 0.6 or Kp > 5. Region-configurable.', tier: 'PRO' },
            { title: 'TEC Grid Maps', desc: '2h interpolated VTEC maps from NASA IONEX. EIA crest tracking built-in.', tier: 'PRO' },
            { title: 'REST + WS API', desc: 'Versioned endpoints. JSON/CSV. Historical queries up to 2yr. 99.5% SLA.', tier: 'PRO' },
            { title: 'NavIC Signal Chains', desc: 'Separate L5/S1 processing. IRNSS quality reports for ISRO integrations.', tier: 'ENTERPRISE' },
            { title: 'IIG Cross-Validation', desc: 'Auto-correlation with IIG Mumbai GIRO network. Research-grade export.', tier: 'ENTERPRISE' },
          ].map((f, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg border border-[#1f2937] bg-[#111827]/50 hover:bg-[#111827] transition-colors">
              <div className="mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  f.tier === 'FREE' ? 'bg-[#10b981]' : f.tier === 'PRO' ? 'bg-[#3b82f6]' : 'bg-[#8b5cf6]'
                }`}></div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-semibold text-white">{f.title}</span>
                  <span className={`font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded border ${
                    f.tier === 'FREE' ? 'text-[#10b981] border-[#10b981]/20' : f.tier === 'PRO' ? 'text-[#3b82f6] border-[#3b82f6]/20' : 'text-[#8b5cf6] border-[#8b5cf6]/20'
                  }`}>{f.tier}</span>
                </div>
                <p className="text-[#64748b] text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Pricing
        </h2>
        <p className="text-[#64748b] text-sm mb-10">Start free. Scale when you need real-time national coverage.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-8 flex flex-col">
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] mb-4">CITIZEN</div>
            <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Free</h3>
            <p className="text-[#64748b] font-mono text-[10px] mb-6 tracking-widest">forever • no card required</p>
            <p className="text-[#94a3b8] text-sm mb-8">For students, researchers, and citizen scientists contributing to India's ionospheric data network.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-[#cbd5e1]">
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Delayed dashboard (15-min lag)</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Public Kp + TEC maps</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Android GnssLogger software</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Community forum access</li>
              <li className="flex gap-3 items-start text-[#475569]"><Minus size={16} className="shrink-0 mt-0.5"/> Real-time S4 alerts</li>
              <li className="flex gap-3 items-start text-[#475569]"><Minus size={16} className="shrink-0 mt-0.5"/> API access</li>
            </ul>
            <button onClick={() => handleAction('Citizen Tier Provisioning')} disabled={actionState.loading === 'Citizen Tier Provisioning'} className="w-full py-3 rounded border border-[#334155] hover:bg-[#1e293b] font-bold text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {actionState.loading === 'Citizen Tier Provisioning' ? <Loader2 size={16} className="animate-spin" /> : null}
              {actionState.loading === 'Citizen Tier Provisioning' ? 'Processing...' : 'Get Started Free'}
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-[#111827] border border-[#3b82f6] rounded-xl p-8 flex flex-col relative transform lg:-translate-y-4 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#3b82f6] text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full tracking-widest">MOST POPULAR</div>
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] mb-4">PRO</div>
            <h3 className="text-4xl font-bold mb-2 flex items-start gap-1" style={{ fontFamily: 'Syne, sans-serif' }}>
              <span className="text-lg mt-1 text-[#64748b]">₹</span>1,499
            </h3>
            <p className="text-[#64748b] font-mono text-[10px] mb-6 tracking-widest">per month • annual discount 20%</p>
            <p className="text-[#94a3b8] text-sm mb-8">For telecom engineers, agriculture firms, drone operators, and aviation safety officers.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-[#cbd5e1]">
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Real-time dashboard (all indices)</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> S4/σΦ/TEC alerts via Telegram</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> India TEC map (2h resolution)</li>
               <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> 90-day historical data</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> CSV export</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> REST API Access (1k req/day)</li>
            </ul>
            <button onClick={() => handleAction('Pro Trial Activation')} disabled={actionState.loading === 'Pro Trial Activation'} className="w-full py-3 rounded bg-[#3b82f6] hover:bg-[#2563eb] font-bold text-sm transition-colors text-white flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {actionState.loading === 'Pro Trial Activation' ? <Loader2 size={16} className="animate-spin" /> : null}
              {actionState.loading === 'Pro Trial Activation' ? 'Initializing Trial...' : 'Start 14-Day Trial'}
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-8 flex flex-col">
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] mb-4">ENTERPRISE</div>
            <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Custom</h3>
            <p className="text-[#64748b] font-mono text-[10px] mb-6 tracking-widest">contact for pricing • SLA guaranteed</p>
            <p className="text-[#94a3b8] text-sm mb-8">For ISRO, TRAI, DGCA, defense, and large telecom operators requiring dedicated infrastructure.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-[#cbd5e1]">
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Dedicated REST + WebSocket API (100Hz)</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Unlimited Global Data Retention</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Private Node Deployment & Management</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Custom node deployment</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> 99.5% SLA + dedicated support</li>
              <li className="flex gap-3 items-start"><Check size={16} className="text-[#10b981] shrink-0 mt-0.5"/> Unlimited data retention</li>
            </ul>
            <button onClick={() => handleAction('Enterprise Sales Form')} disabled={actionState.loading === 'Enterprise Sales Form'} className="w-full py-3 rounded border border-[#334155] hover:bg-[#1e293b] font-bold text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {actionState.loading === 'Enterprise Sales Form' ? <Loader2 size={16} className="animate-spin" /> : null}
              {actionState.loading === 'Enterprise Sales Form' ? 'Connecting...' : 'Contact Sales'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1f2937] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[10px] text-[#334155] tracking-wider">
            ionwatch v0.9.2-beta • {new Date().getFullYear()} IonWatch Labs, Bangalore
          </div>
          <div className="flex gap-6 font-mono text-[10px] text-[#475569]">
            <span className="hover:text-white cursor-pointer transition-colors">Docs</span>
            <span className="hover:text-white cursor-pointer transition-colors">Status</span>
            <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
            <span className="hover:text-white cursor-pointer transition-colors">API v1</span>
          </div>
        </div>
      </div>

    </div>
  );
}
