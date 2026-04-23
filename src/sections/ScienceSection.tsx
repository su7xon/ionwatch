import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScienceSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".science-card", 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="science" className={`py-32 px-6 md:px-12 bg-[#0E1116] border-t border-white/5 relative ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-secondary-light font-mono tracking-widest uppercase text-xs mb-4">
            // the science &middot; how it works
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-primary-light mb-6">
            From Radio Wave to Navigation Alert
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* S4 Index */}
          <div className="science-card bg-[#07080A] border border-white/10 p-8 hover:border-[#FF6A00]/50 transition-colors group">
            <div className="text-4xl text-[#FF6A00] mb-6 font-serif">◉</div>
            <h4 className="text-2xl font-bold text-primary-light mb-2">S4 Index</h4>
            <div className="font-mono text-sm text-[#FF6A00] mb-4 bg-[#FF6A00]/10 inline-block px-3 py-1 rounded">S4 = std(√I) / mean(√I)</div>
            <p className="text-secondary-light mb-6">
              Amplitude scintillation index. Computed over a 60-second rolling window of C/N₀ samples. Measures how much signal power fluctuates due to ionospheric irregularities.
            </p>
            <div className="flex gap-4 font-mono text-xs">
              <span className="text-green-500">&lt;0.3 Weak</span>
              <span className="text-yellow-500">0.3–0.6 Mod</span>
              <span className="text-red-500">&gt;0.6 Severe</span>
            </div>
          </div>

          {/* Sigma Phi */}
          <div className="science-card bg-[#07080A] border border-white/10 p-8 hover:border-[#FF6A00]/50 transition-colors group">
            <div className="text-4xl text-[#FF6A00] mb-6 font-serif">≋</div>
            <h4 className="text-2xl font-bold text-primary-light mb-2">σφ Phase Index</h4>
            <div className="font-mono text-sm text-[#FF6A00] mb-4 bg-[#FF6A00]/10 inline-block px-3 py-1 rounded">σφ = std(HPF[φ(t)])</div>
            <p className="text-secondary-light mb-6">
              Phase scintillation index. Carrier phase detrended with 6th-order Butterworth HPF (0.1 Hz cutoff). Measures cycle-slip risk in GNSS tracking loops.
            </p>
            <div className="flex gap-4 font-mono text-xs">
              <span className="text-green-500">&lt;0.1 rad Weak</span>
              <span className="text-yellow-500">0.1–0.5 Mod</span>
              <span className="text-red-500">&gt;0.5 Severe</span>
            </div>
          </div>

          {/* VTEC */}
          <div className="science-card bg-[#07080A] border border-white/10 p-8 hover:border-[#FF6A00]/50 transition-colors group">
            <div className="text-4xl text-[#FF6A00] mb-6 font-serif">◈</div>
            <h4 className="text-2xl font-bold text-primary-light mb-2">VTEC</h4>
            <div className="font-mono text-sm text-[#FF6A00] mb-4 bg-[#FF6A00]/10 inline-block px-3 py-1 rounded">TEC = (φ·f₁²) / (40.3×10¹⁶)</div>
            <p className="text-secondary-light mb-6">
              Vertical Total Electron Content in TECU. Absolute plasma density along signal path. High TEC indicates plasma-dense conditions favorable for EPB formation post-sunset.
            </p>
            <div className="flex gap-4 font-mono text-xs">
              <span className="text-green-500">10–30 Quiet</span>
              <span className="text-yellow-500">30–60 Active</span>
              <span className="text-red-500">&gt;80 Storm</span>
            </div>
          </div>

          {/* Risk Score */}
          <div className="science-card bg-[#07080A] border border-white/10 p-8 hover:border-[#FF6A00]/50 transition-colors group">
            <div className="text-4xl text-[#FF6A00] mb-6 font-serif">⬡</div>
            <h4 className="text-2xl font-bold text-primary-light mb-2">Risk Score</h4>
            <div className="font-mono text-sm text-[#FF6A00] mb-4 bg-[#FF6A00]/10 inline-block px-3 py-1 rounded">R = f(S4, Kp, Dst, TEC, Season)</div>
            <p className="text-secondary-light mb-6">
              IonWatch aggregates S4, Kp index, Dst ring current, VTEC, solar flux F10.7, and seasonal/diurnal factors into a unified 0–100 scintillation risk score per Indian region.
            </p>
            <div className="flex gap-4 font-mono text-xs">
              <span className="text-green-500">0–30 Nom</span>
              <span className="text-yellow-500">30–70 Elev</span>
              <span className="text-red-500">70–100 Crit</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
