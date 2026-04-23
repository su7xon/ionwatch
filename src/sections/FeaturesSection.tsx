import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RadioReceiver, Zap, Map as MapIcon, Unplug, Satellite, Microscope } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".feature-card", 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <RadioReceiver size={24} />,
      title: "Real-Time S4/σφ/TEC",
      tier: "FREE TIER",
      description: "60-second rolling computation of all three indices from GNSS raw observables. Live Grafana dashboard per node, per satellite, per region."
    },
    {
      icon: <Zap size={24} />,
      title: "Storm Alert Webhooks",
      tier: "PRO TIER",
      description: "Sub-60-second alerts via Telegram, Slack, or REST webhook when S4 > 0.6 or Kp > 5. Configurable per region and severity threshold."
    },
    {
      icon: <MapIcon size={24} />,
      title: "India TEC Maps",
      tier: "PRO TIER",
      description: "Interpolated VTEC grid maps across India updated every 2 hours from NASA IONEX. EIA crest position tracking. EPB onset probability forecasts."
    },
    {
      icon: <Unplug size={24} />,
      title: "Data as a Service API",
      tier: "ENTERPRISE",
      description: "REST + WebSocket API for real-time and historical S4, TEC, Kp, risk scores. JSON and CSV. Versioned endpoints. SLA 99.5% uptime."
    },
    {
      icon: <Satellite size={24} />,
      title: "NavIC-Specific Analysis",
      tier: "ENTERPRISE",
      description: "Separate processing chains for NavIC (L5/S1), GPS (L1/L2), and Galileo (E1/E5). IRNSS signal quality reports for ISRO-integrated deployments."
    },
    {
      icon: <Microscope size={24} />,
      title: "IIG/GIRO Validation",
      tier: "ENTERPRISE",
      description: "Automated correlation of IonWatch measurements against IIG Mumbai GIRO network data. Accuracy reports, calibration flags, research-grade data export."
    }
  ];

  return (
    <section ref={sectionRef} id="features" className={`py-32 px-6 md:px-12 bg-[#07080A] relative ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-secondary-light font-mono tracking-widest uppercase text-xs mb-4">
            // platform features
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-primary-light mb-6">
            Everything NavIC Operators Need
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="feature-card bg-[#0E1116] border border-white/5 p-8 rounded-lg hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#FF6A00] bg-[#FF6A00]/10 px-2 py-1 rounded">
                  {feat.tier}
                </span>
              </div>
              <div className="w-12 h-12 bg-[#FF6A00]/10 rounded-lg flex items-center justify-center text-[#FF6A00] mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h4 className="text-xl font-bold text-primary-light mb-4">{feat.title}</h4>
              <p className="text-secondary-light leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
