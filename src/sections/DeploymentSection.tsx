import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DeploymentSectionProps {
  className?: string;
}

export default function DeploymentSection({ className = '' }: DeploymentSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const tiersRef = useRef<HTMLDivElement>(null);

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
        { x: '-60vw', opacity: 0, scale: 1.06 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        panelRef.current,
        { x: '45vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
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

      if (tiersRef.current) {
        const items = tiersRef.current.querySelectorAll('.tier-item');
        scrollTl.fromTo(
          items,
          { x: '6vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.2
        );
      }

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

      if (tiersRef.current) {
        const items = tiersRef.current.querySelectorAll('.tier-item');
        scrollTl.fromTo(
          items,
          { x: 0, opacity: 1 },
          { x: '10vw', opacity: 0, stagger: 0.01, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl.fromTo(
        imageRef.current,
        { scale: 1, x: 0, opacity: 1 },
        { scale: 1.06, x: '-8vw', opacity: 0.35, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const tiers = [
    { tier: 'Tier 1', desc: '8–12 nodes (pilot)' },
    { tier: 'Tier 2', desc: '25 nodes (regional coverage)' },
    { tier: 'Tier 3', desc: '50+ nodes (national scale)' },
  ];

  return (
    <section
      ref={sectionRef}
      id="deployment"
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      {/* Left Image */}
      <img
        ref={imageRef}
        src="/map_india_space.jpg"
        alt="India from space"
        className="absolute left-0 top-0 w-[55vw] h-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Right Panel */}
      <div
        ref={panelRef}
        className="absolute left-[55vw] top-0 w-[45vw] h-full bg-panel"
        style={{ opacity: 0 }}
      />

      {/* Content */}
      <div className="absolute left-[61vw] top-[22vh] w-[32vw]" style={{ zIndex: 4 }}>
        <h2
          ref={headlineRef}
          className="text-[clamp(32px,3.6vw,56px)] font-bold text-primary-light leading-[1]"
          style={{ opacity: 0 }}
        >
          A network where it <span className="accent-color">matters</span> most.
        </h2>
      </div>

      <div className="absolute left-[61vw] top-[42vh] w-[30vw]" style={{ zIndex: 4 }}>
        <p
          ref={bodyRef}
          className="text-base text-secondary-light leading-relaxed"
          style={{ opacity: 0 }}
        >
          Priority deployment along low-latitude corridors and high-GNSS-dependency 
          zones—airports, ports, survey belts, and telecom hubs.
        </p>
      </div>

      <div
        ref={tiersRef}
        className="absolute left-[61vw] top-[60vh] w-[30vw]"
        style={{ zIndex: 4 }}
      >
        <div className="space-y-5">
          {tiers.map((item, index) => (
            <div
              key={index}
              className="tier-item flex items-center gap-4"
              style={{ opacity: 0 }}
            >
              <MapPin size={18} className="text-[#FF6A00]" />
              <div>
                <span className="font-mono text-sm text-primary-light">{item.tier}:</span>
                <span className="text-sm text-secondary-light ml-2">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
