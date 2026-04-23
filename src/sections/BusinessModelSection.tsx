import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BusinessModelSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".business-card", 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7, 
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const streams = [
    {
      emoji: "💾",
      title: "Data as a Service",
      price: "₹5,000/mo",
      subtitle: "per telecom cluster · tiered by node count",
      description: "Real-time S4, TEC, and risk score API access for telecom operators managing 5G base station timing synchronization. TRAI-mandated timing accuracy compliance reports included."
    },
    {
      emoji: "📊",
      title: "Pro Dashboard",
      price: "₹2,499/mo",
      subtitle: "per organization · unlimited users",
      description: "Full-access Grafana dashboard with historical data, storm replay, alert configuration, and CSV export. Targeted at precision agriculture firms, drone operators, and logistics companies."
    },
    {
      emoji: "🏗",
      title: "Hardware + Deployment",
      price: "₹12,000",
      subtitle: "per node · one-time + ₹1,500/mo maintenance",
      description: "Full IonWatch node (GNSS receiver, Pi 5, antenna, enclosure) with remote setup, cloud onboarding, and first year maintenance. Bulk pricing for 10+ node deployments."
    },
    {
      emoji: "🎓",
      title: "Citizen Science Network",
      price: "Free",
      subtitle: "open contribution · data credit system",
      description: "Universities and colleges contribute GNSS data via Android phones + free software. Contributes to national coverage density. Node operators earn data credits redeemable for Pro access. Funded via DST/ISRO grants."
    }
  ];

  return (
    <section ref={sectionRef} id="business-model" className={`py-32 px-6 md:px-12 bg-[#0E1116] border-t border-white/5 relative ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-secondary-light font-mono tracking-widest uppercase text-xs mb-4">
            // business model
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-primary-light mb-6">
            Four Revenue Streams
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {streams.map((stream, i) => (
            <div key={i} className="business-card flex flex-col md:flex-row gap-6 bg-[#07080A] border border-white/10 p-8 rounded-lg hover:border-[#FF6A00]/30 transition-colors group">
              <div className="text-5xl shrink-0 group-hover:scale-110 transition-transform origin-top-left">
                {stream.emoji}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-primary-light mb-1">{stream.title}</h4>
                <div className="flex flex-col mb-4">
                  <span className="text-xl font-mono text-[#FF6A00]">{stream.price}</span>
                  <span className="text-xs text-secondary-light font-mono">{stream.subtitle}</span>
                </div>
                <p className="text-secondary-light leading-relaxed">
                  {stream.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
