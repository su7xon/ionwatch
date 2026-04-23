import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Minus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".pricing-card", 
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
    <section ref={sectionRef} id="pricing" className={`py-32 px-6 md:px-12 bg-[#07080A] border-t border-white/5 relative ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-secondary-light font-mono tracking-widest uppercase text-xs mb-4">
            // plans and pricing
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-primary-light mb-6">
            Simple, Transparent Pricing
          </h3>
          <p className="text-secondary-light text-lg">
            Start free. Scale when you need real-time national coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Citizen */}
          <div className="pricing-card bg-[#0E1116] border border-white/10 p-8 rounded-lg">
            <h4 className="text-xl font-bold text-primary-light mb-2">Citizen</h4>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">Free</span>
            </div>
            <p className="text-xs font-mono text-secondary-light mb-6 uppercase tracking-wider">forever &middot; no card required</p>
            <p className="text-secondary-light text-sm mb-8 h-16">
              For students, researchers, and citizen scientists contributing to India's ionospheric data network.
            </p>
            <ul className="space-y-4 mb-8 text-sm">
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                Delayed dashboard (15-min lag)
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                Public Kp + TEC maps
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                Android GnssLogger software
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                Community forum access
              </li>
              <li className="flex items-start gap-3 text-secondary-light/50">
                <Minus size={18} className="shrink-0 mt-0.5" />
                Real-time S4 alerts
              </li>
              <li className="flex items-start gap-3 text-secondary-light/50">
                <Minus size={18} className="shrink-0 mt-0.5" />
                API access
              </li>
            </ul>
            <button className="w-full py-3 border border-white/20 text-primary-light hover:bg-white/5 transition-colors font-mono text-sm uppercase tracking-wider">
              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div className="pricing-card bg-[#0E1116] border-2 border-[#FF6A00] p-8 rounded-lg relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(255,106,0,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF6A00] text-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest rounded-full">
              Most Popular
            </div>
            <h4 className="text-xl font-bold text-primary-light mb-2">Pro</h4>
            <div className="mb-4">
              <span className="text-4xl font-bold text-[#FF6A00]">₹2,499</span>
            </div>
            <p className="text-xs font-mono text-secondary-light mb-6 uppercase tracking-wider">per month &middot; annual discount 20%</p>
            <p className="text-secondary-light text-sm mb-8 h-16">
              For telecom engineers, agriculture firms, drone operators, and aviation safety officers.
            </p>
            <ul className="space-y-4 mb-8 text-sm">
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                Real-time dashboard (all indices)
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                S4/σφ/TEC alerts via Telegram
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                India TEC map (2h resolution)
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                90-day historical data
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                CSV export
              </li>
              <li className="flex items-start gap-3 text-secondary-light/50">
                <Minus size={18} className="shrink-0 mt-0.5" />
                Dedicated API endpoint
              </li>
            </ul>
            <button className="w-full py-3 bg-[#FF6A00] text-white hover:bg-[#FF6A00]/90 transition-colors font-mono text-sm uppercase tracking-wider accent-glow">
              Start 14-Day Trial
            </button>
          </div>

          {/* Enterprise */}
          <div className="pricing-card bg-[#0E1116] border border-white/10 p-8 rounded-lg">
            <h4 className="text-xl font-bold text-primary-light mb-2">Enterprise</h4>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <p className="text-xs font-mono text-secondary-light mb-6 uppercase tracking-wider">contact for pricing &middot; SLA guaranteed</p>
            <p className="text-secondary-light text-sm mb-8 h-16">
              For ISRO, TRAI, DGCA, defense, and large telecom operators requiring dedicated infrastructure.
            </p>
            <ul className="space-y-4 mb-8 text-sm">
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                Dedicated REST + WebSocket API
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                NavIC-specific signal chains
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                IIG/GIRO cross-validation reports
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                Custom node deployment
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                99.5% SLA + dedicated support
              </li>
              <li className="flex items-start gap-3 text-primary-light">
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                Unlimited data retention
              </li>
            </ul>
            <button className="w-full py-3 border border-white/20 text-primary-light hover:bg-white/5 transition-colors font-mono text-sm uppercase tracking-wider">
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
