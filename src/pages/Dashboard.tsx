import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, MapPin, ArrowLeft, Radio, Wifi, Settings, Signal, ShieldAlert } from 'lucide-react';

const INDIA_CITIES = [
  { name: 'Delhi', top: '25%', left: '42%', status: 'nominal', s4: 0.15 },
  { name: 'Mumbai', top: '60%', left: '28%', status: 'nominal', s4: 0.15 },
  { name: 'Bengaluru', top: '80%', left: '38%', status: 'nominal', s4: 0.15 },
  { name: 'Kolkata', top: '50%', left: '65%', status: 'nominal', s4: 0.15 },
  { name: 'Chennai', top: '75%', left: '45%', status: 'nominal', s4: 0.15 },
  { name: 'Ahmedabad', top: '48%', left: '25%', status: 'nominal', s4: 0.15 },
  { name: 'Hyderabad', top: '65%', left: '40%', status: 'nominal', s4: 0.15 },
];

export default function Dashboard() {
  const [data, setData] = useState<{time: string, kp: number, tec: number}[]>([]);
  const [solarWind, setSolarWind] = useState<{time: string, speed: number, density: number}[]>([]);
  const [alerts, setAlerts] = useState<{id: string, type: string, location: string, message: string, time: string}[]>([]);
  const [cities, setCities] = useState(INDIA_CITIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNOAAData = async () => {
      try {
        // Fetch Kp Index
        const kpResponse = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const kpJson = await kpResponse.json();
        
        // Get last 30 readings
        const recentKp = kpJson.slice(-30).map((row: any) => {
          const date = new Date(row.time_tag);
          return {
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            kp: typeof row.Kp === 'number' ? row.Kp : parseFloat(row.Kp) || 0,
            tec: 20 + (typeof row.Kp === 'number' ? row.Kp : parseFloat(row.Kp) || 0) * 5 
          };
        });
        
        setData(recentKp);

        // Fetch Space Weather Alerts
        const alertsResponse = await fetch('https://services.swpc.noaa.gov/products/alerts.json');
        const alertsJson = await alertsResponse.json();
        
        const recentAlerts = alertsJson.slice(0, 10).map((alert: any) => {
          const isWarning = alert.message.toLowerCase().includes('warning') || alert.message.toLowerCase().includes('alert');
          const date = new Date(alert.issue_datetime);
          return {
            id: alert.issue_datetime + Math.random().toString(),
            type: isWarning ? 'critical' : 'warning',
            location: 'Global / NOAA',
            message: alert.message.split('\n')[0] || 'Space Weather Alert',
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });

        setAlerts(recentAlerts.length > 0 ? recentAlerts : [
          { id: '1', type: 'info', location: 'System', message: 'No active NOAA alerts currently.', time: 'Just now' }
        ]);

        // Update cities based on latest Kp
        const currentKp = recentKp[recentKp.length - 1]?.kp || 0;
        setCities(prev => prev.map(city => {
          const baseS4 = Math.max(0.1, (currentKp / 9) + (Math.random() * 0.2));
          let status = 'nominal';
          if (baseS4 > 0.6) status = 'critical';
          else if (baseS4 > 0.3) status = 'warning';
          return { ...city, s4: baseS4, status };
        }));

        // Fetch Solar Wind Speed (1-minute data, last 60 readings)
        const swResponse = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json');
        const swJson = await swResponse.json();
        const recentSW = swJson.slice(-60).filter((row: any[]) => row[0] !== 'time_tag').map((row: any[]) => {
          const date = new Date(row[0]);
          return {
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            speed: parseFloat(row[2]) || 0,
            density: parseFloat(row[1]) || 0,
          };
        });
        setSolarWind(recentSW);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching NOAA data", error);
      }
    };

    fetchNOAAData();
    // Poll every 5 minutes (NOAA updates frequently)
    const interval = setInterval(fetchNOAAData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0E1116] text-white font-sans overflow-x-hidden selection:bg-[#FF6A00]/30 selection:text-white">
      
      {/* Top Navbar */}
      <header className="h-[64px] border-b border-white/10 flex items-center justify-between px-6 bg-[#07080A]">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-secondary-light hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="font-mono text-sm tracking-wider uppercase">Home</span>
          </Link>
          <div className="w-[1px] h-6 bg-white/10" />
          <h1 className="font-bold text-xl tracking-[0.2em] flex items-center gap-2">
            ION<span className="text-[#FF6A00]">WATCH</span>
            <span className="font-mono text-[10px] bg-[#FF6A00]/10 text-[#FF6A00] px-2 py-0.5 ml-2 border border-[#FF6A00]/20 rounded-full">LIVE</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-secondary-light">
            <Radio size={14} className="text-green-500 animate-pulse" />
            <span className="font-mono text-xs uppercase">Receiving Data</span>
          </div>
          <button className="p-2 text-secondary-light hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-[#0E1116]/80 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <Activity className="text-[#FF6A00] animate-spin" size={32} />
              <span className="font-mono text-sm tracking-widest uppercase text-secondary-light">Fetching NOAA Data...</span>
            </div>
          </div>
        )}
        
        {/* Left Column: Map & Active Nodes */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Map Container */}
          <div className="bg-[#07080A] border border-white/10 rounded p-4 h-[350px] relative flex flex-col">
            <h2 className="font-mono text-xs tracking-[0.1em] uppercase text-secondary-light mb-4 flex items-center gap-2">
              <MapPin size={14} /> Network Map
            </h2>
            <div className="flex-1 relative border border-white/5 bg-[#0a0d12] rounded overflow-hidden">
              {/* Abstract India Map Shape using SVG or simple CSS */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Simplified roughly India shape for aesthetic */}
                <path d="M40,10 L50,5 L60,15 L70,30 L65,50 L55,80 L50,90 L45,80 L35,50 L25,40 L30,20 Z" fill="#ffffff" />
              </svg>
              
              {/* City Nodes */}
              {cities.map((city, i) => (
                <div 
                  key={i} 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                  style={{ top: city.top, left: city.left }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    city.status === 'critical' ? 'bg-red-500 border-red-200 animate-pulse' :
                    city.status === 'warning' ? 'bg-yellow-500 border-yellow-200' :
                    'bg-green-500 border-green-200'
                  }`} />
                  <div className="absolute top-4 bg-[#0E1116] border border-white/10 text-[10px] font-mono px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    {city.name}: {city.s4.toFixed(2)} S4
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-between items-center mt-3 text-[10px] font-mono uppercase text-secondary-light">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Nominal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Warning</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
            </div>
          </div>

          {/* Alert Feed */}
          <div className="bg-[#07080A] border border-white/10 rounded p-4 flex-1 flex flex-col overflow-hidden">
             <h2 className="font-mono text-xs tracking-[0.1em] uppercase text-secondary-light mb-4 flex items-center gap-2">
              <ShieldAlert size={14} /> Alert Feed
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded border-l-2 ${
                  alert.type === 'critical' ? 'bg-red-500/10 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' :
                  'bg-blue-500/10 border-blue-500'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      alert.type === 'critical' ? 'text-red-400' :
                      alert.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>{alert.location}</span>
                    <span className="text-[10px] text-white/50">{alert.time}</span>
                  </div>
                  <p className="text-sm text-white/90">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right Column: Charts & Metrics */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#07080A] border border-white/10 rounded p-4">
              <span className="font-mono text-[10px] tracking-wider uppercase text-secondary-light">Global Max Kp</span>
              <div className="text-3xl font-light text-white mt-1">
                {data.length > 0 ? Math.max(...data.map(d => d.kp)).toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="bg-[#07080A] border border-white/10 rounded p-4">
              <span className="font-mono text-[10px] tracking-wider uppercase text-secondary-light">Active Nodes</span>
              <div className="text-3xl font-light text-primary-light mt-1 flex items-center gap-2">
                12 <span className="text-xs text-green-500 font-mono">+1</span>
              </div>
            </div>
            <div className="bg-[#07080A] border border-white/10 rounded p-4">
              <span className="font-mono text-[10px] tracking-wider uppercase text-secondary-light">Network Health</span>
              <div className="text-3xl font-light text-primary-light mt-1 flex items-center gap-2">
                98.2% <Signal size={20} className="text-green-500" />
              </div>
            </div>
            <div className="bg-[#07080A] border border-[#FF6A00]/30 rounded p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#FF6A00]/5" />
              <span className="relative font-mono text-[10px] tracking-wider uppercase text-[#FF6A00]">System Status</span>
              <div className="relative text-xl font-bold text-white mt-2 flex items-center gap-2">
                OPERATIONAL
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main Chart - S4 Index */}
          <div className="bg-[#07080A] border border-white/10 rounded p-5 flex flex-col" style={{height: '420px'}}>
             <div className="flex justify-between items-center mb-6">
              <h2 className="font-mono text-sm tracking-[0.1em] uppercase text-primary-light flex items-center gap-2">
                <Activity size={16} className="text-[#FF6A00]" /> 
                Planetary K-index (NOAA) - proxy for disturbance
              </h2>
              <div className="flex gap-2">
                {['1H', '6H', '24H', '7D'].map(t => (
                  <button key={t} className={`px-2 py-1 text-[10px] font-mono border ${t === '1H' ? 'border-[#FF6A00] text-[#FF6A00]' : 'border-white/10 text-secondary-light hover:border-white/30'}`}>
                    {t}
                  </button>
                ))}
              </div>
             </div>
             
             <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorS4" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF6A00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" fontSize={10} tickMargin={10} />
                    <YAxis stroke="#ffffff50" fontSize={10} domain={[0, 9]} tickCount={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0E1116', border: '1px solid #ffffff20', borderRadius: '4px' }}
                      itemStyle={{ color: '#FF6A00' }}
                      labelStyle={{ color: '#ffffff50', marginBottom: '4px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="kp" stroke="#FF6A00" strokeWidth={2} fillOpacity={1} fill="url(#colorS4)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Secondary Chart - TEC */}
          <div className="bg-[#07080A] border border-white/10 rounded p-5 h-[220px] flex flex-col">
            <h2 className="font-mono text-xs tracking-[0.1em] uppercase text-secondary-light mb-4 flex items-center gap-2">
              <Wifi size={14} /> Solar Wind Speed (km/s) — Live NOAA
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={solarWind} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff50" fontSize={10} hide />
                  <YAxis stroke="#ffffff50" fontSize={10} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0E1116', border: '1px solid #ffffff20' }}
                    itemStyle={{ color: '#00D1FF' }}
                  />
                  <Line type="monotone" dataKey="speed" stroke="#00D1FF" strokeWidth={2} dot={false} isAnimationActive={false} name="Speed (km/s)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
