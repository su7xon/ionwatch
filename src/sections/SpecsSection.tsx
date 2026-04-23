import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SpecsSectionProps {
  className?: string;
}

export default function SpecsSection({ className = '' }: SpecsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Left text animation
      gsap.fromTo(
        leftRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: leftRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Divider animation
      gsap.fromTo(
        dividerRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Spec rows animation
      if (specsRef.current) {
        const rows = specsRef.current.querySelectorAll('.spec-row');
        gsap.fromTo(
          rows,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: specsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const specs = [
    { label: 'Constellations', value: 'GPS / NavIC / Galileo / GLONASS' },
    { label: 'Bands', value: 'L1 + L5' },
    { label: 'Indices', value: 'S4, σφ' },
    { label: 'Output rate', value: '1 Hz (configurable)' },
    { label: 'Latency', value: '< 5 s (typical)' },
    { label: 'Backhaul', value: '4G / Ethernet / optional satellite' },
    { label: 'Power', value: '8–15W (solar-ready)' },
    { label: 'Enclosure', value: 'IP67, -20°C to +60°C' },
  ];

  return (
    <section
      ref={sectionRef}
      id="specs"
      className={`relative w-full py-[10vh] bg-panel ${className}`}
    >
      <div className="px-[10vw] flex flex-col lg:flex-row gap-12">
        {/* Left Column */}
        <div ref={leftRef} className="lg:w-[44vw]" style={{ opacity: 0 }}>
          <h2 className="text-[clamp(32px,3.6vw,56px)] font-bold text-primary-light leading-[1] mb-6">
            Specs that fit your <span className="accent-color">stack.</span>
          </h2>
          <p className="text-base text-secondary-light leading-relaxed">
            IonWatch nodes stream standardized outputs and integrate with existing 
            GNSS infrastructure. No proprietary lock-in.
          </p>
        </div>

        {/* Divider */}
        <div
          ref={dividerRef}
          className="hidden lg:block w-[1px] bg-white/10 origin-top"
          style={{ transform: 'scaleY(0)' }}
        />

        {/* Right Column - Specs Table */}
        <div ref={specsRef} className="lg:w-[36vw] lg:ml-auto">
          <div className="space-y-0">
            {specs.map((spec, index) => (
              <div
                key={index}
                className="spec-row flex justify-between items-center py-4 border-b border-white/10"
                style={{ opacity: 0 }}
              >
                <span className="font-mono text-xs tracking-[0.1em] uppercase text-secondary-light">
                  {spec.label}
                </span>
                <span className="text-sm text-primary-light text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
