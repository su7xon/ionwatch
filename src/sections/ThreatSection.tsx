import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ThreatSectionProps {
  className?: string;
}

export default function ThreatSection({ className = '' }: ThreatSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Phase 1: ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        imageRef.current,
        { x: '-60vw', opacity: 0, scale: 1.08 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        panelRef.current,
        { x: '48vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        lineRef.current,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 0.7, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.18
      );

      scrollTl.fromTo(
        statsRef.current,
        { y: '18vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.18
      );

      // Phase 3: EXIT (70% - 100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bodyRef.current,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        statsRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        lineRef.current,
        { opacity: 0.7 },
        { opacity: 0.1, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: 'Solar cycle peak', value: '2025–2026' },
    { label: 'GNSS outages (est.)', value: '+40%' },
    { label: 'High-risk zones in India', value: 'Equatorial/low-lat' },
  ];

  return (
    <section
      ref={sectionRef}
      id="threat"
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      {/* Left Image */}
      <img
        ref={imageRef}
        src="/threat_aurora_space.jpg"
        alt="Aurora from space"
        className="absolute left-0 top-0 w-[52vw] h-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Right Panel */}
      <div
        ref={panelRef}
        className="absolute left-[52vw] top-0 w-[48vw] h-full bg-panel"
        style={{ opacity: 0 }}
      />

      {/* Accent Line */}
      <div
        ref={lineRef}
        className="absolute left-[52vw] top-[18vh] w-[2px] h-[64vh] accent-bg origin-top"
        style={{ opacity: 0, transform: 'scaleY(0)' }}
      />

      {/* Content */}
      <div className="absolute left-[58vw] top-[22vh] w-[34vw]" style={{ zIndex: 4 }}>
        <h2
          ref={headlineRef}
          className="text-[clamp(32px,3.6vw,56px)] font-bold text-primary-light leading-[1] mb-8"
          style={{ opacity: 0 }}
        >
          Solar <span className="accent-color">maximum</span> is here.
        </h2>
      </div>

      <div className="absolute left-[58vw] top-[44vh] w-[32vw]" style={{ zIndex: 4 }}>
        <p
          ref={bodyRef}
          className="text-base text-secondary-light leading-relaxed"
          style={{ opacity: 0 }}
        >
          Ionospheric scintillation degrades GNSS accuracy and can cause temporary 
          loss of signal. During solar max, disturbances rise sharply—impacting 
          aviation, surveying, telecom sync, and disaster response.
        </p>
      </div>

      {/* Stats Row */}
      <div
        ref={statsRef}
        className="absolute left-[58vw] top-[68vh] w-[32vw]"
        style={{ zIndex: 4, opacity: 0 }}
      >
        <div className="flex items-start justify-between">
          {stats.map((stat, index) => (
            <div key={index} className="flex-1 relative">
              {index > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-white/10" />
              )}
              <div className={`${index > 0 ? 'pl-6' : ''}`}>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-secondary-light mb-2">
                  {stat.label}
                </p>
                <p className="font-mono text-xl text-primary-light">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
