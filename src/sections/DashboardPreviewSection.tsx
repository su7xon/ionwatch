import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Radio, ShieldCheck, Map } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardPreviewSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="dashboard-preview" className={`py-32 px-6 md:px-12 bg-[#07080A] relative ${className}`}>
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-secondary-light font-mono tracking-widest uppercase text-xs mb-4">
          // live platform &middot; free tier preview
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold text-primary-light mb-6">
          India Ionospheric Command Center
        </h3>
        <p className="text-secondary-light max-w-2xl mx-auto text-lg">
          Real-time data from NOAA SWPC, simulated S4/TEC from current geomagnetic conditions.
        </p>
      </div>

      <div ref={containerRef} className="max-w-6xl mx-auto bg-[#0E1116] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,106,0,0.05)]">
        {/* Dashboard Header */}
        <div className="border-b border-white/5 bg-[#0A0C10] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-xs text-secondary-light uppercase tracking-widest">
              IonWatch Mission Control &middot; India Region &middot; 1Hz Update
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs">
            <span className="text-primary-light">IST 15:07:32</span>
            <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded">NOMINAL</span>
          </div>
        </div>

        {/* Dashboard Nav */}
        <div className="border-b border-white/5 px-6 py-3 flex gap-6 font-mono text-xs uppercase tracking-wider overflow-x-auto">
          <button className="text-primary-light border-b-2 border-[#FF6A00] pb-1">Overview</button>
          <button className="text-secondary-light hover:text-primary-light pb-1">Signal Analysis</button>
          <button className="text-secondary-light hover:text-primary-light pb-1">TEC Map</button>
          <button className="text-secondary-light hover:text-primary-light pb-1 flex items-center gap-2">
            Alerts <span className="bg-[#FF6A00] text-white px-1.5 py-0.5 rounded-sm text-[10px]">8</span>
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h4 className="text-xl font-bold text-primary-light flex items-center gap-3">
                <ShieldCheck className="text-green-500" />
                NOMINAL &middot; Ionosphere Quiet
              </h4>
              <p className="text-secondary-light mt-2 text-sm">
                All NavIC satellites tracking normally. No scintillation detected over India.
              </p>
            </div>
            <span className="font-mono text-sm text-secondary-light">15:07 IST</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Kp Index', value: '0.0', status: 'QUIET', color: 'text-green-500' },
              { label: 'Max S4', value: '0.082', status: 'WEAK', color: 'text-green-500' },
              { label: 'Max σφ (rad)', value: '0.056', status: 'WEAK', color: 'text-green-500' },
              { label: 'VTEC (TECU)', value: '31.0', status: 'QUIET', color: 'text-green-500' },
              { label: 'Solar Wind km/s', value: '477', status: 'NOMINAL', color: 'text-green-500' },
              { label: 'Sats Tracked', value: '8/8', status: 'LOCK', color: 'text-[#FF6A00]' }
            ].map((stat, i) => (
              <div key={i} className="bg-[#0A0C10] border border-white/5 p-4 rounded-lg flex flex-col justify-between">
                <span className="text-secondary-light text-xs font-mono uppercase tracking-wider mb-4">{stat.label}</span>
                <div>
                  <div className="text-2xl font-bold text-primary-light mb-1">{stat.value}</div>
                  <div className={`text-[10px] font-mono tracking-widest uppercase ${stat.color}`}>
                    {stat.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0A0C10] border border-white/5 h-32 rounded-lg flex items-center justify-center text-secondary-light font-mono text-xs relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(242,244,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(242,244,248,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="z-10 flex flex-col items-center gap-2">
                <Activity size={20} className="text-[#FF6A00]" />
                KP INDEX — LAST 24H (NOAA SWPC LIVE)
              </div>
            </div>
            <div className="bg-[#0A0C10] border border-white/5 h-32 rounded-lg flex items-center justify-center text-secondary-light font-mono text-xs relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(242,244,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(242,244,248,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="z-10 flex flex-col items-center gap-2">
                <Radio size={20} className="text-[#FF6A00]" />
                S4 INDEX — SIMULATED (CORRELATED WITH KP)
              </div>
            </div>
            <div className="bg-[#0A0C10] border border-white/5 h-32 rounded-lg flex items-center justify-center text-secondary-light font-mono text-xs relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(242,244,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(242,244,248,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="z-10 flex flex-col items-center gap-2">
                <Map size={20} className="text-[#FF6A00]" />
                VTEC ESTIMATE — INDIA REGION (TECU)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
