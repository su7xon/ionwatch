import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SensorSectionProps {
  className?: string;
}

export default function SensorSection({ className = '' }: SensorSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bracketRef = useRef<SVGPathElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Phase 1: ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        imageRef.current,
        { x: '-70vw', opacity: 0, scale: 1.06 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        panelRef.current,
        { x: '45vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Corner bracket SVG stroke animation
      if (bracketRef.current) {
        const length = bracketRef.current.getTotalLength();
        gsap.set(bracketRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        scrollTl.to(
          bracketRef.current,
          { strokeDashoffset: 0, ease: 'none' },
          0.1
        );
      }

      scrollTl.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.14
      );

      // Features list stagger
      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll('li');
        scrollTl.fromTo(
          items,
          { x: '6vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.18
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.24
      );

      // Phase 3: EXIT (70% - 100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll('li');
        scrollTl.fromTo(
          items,
          { x: 0, opacity: 1 },
          { x: '12vw', opacity: 0, stagger: 0.01, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        imageRef.current,
        { scale: 1, x: 0, opacity: 1 },
        { scale: 1.06, x: '-8vw', opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      if (bracketRef.current) {
        scrollTl.fromTo(
          bracketRef.current,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.7
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const features = [
    'Dual-band GNSS receiver (L1/L5)',
    'S4 + σφ computed on-device',
    '4G/satellite backhaul + local logging',
    'Rugged enclosure, 6–12 month service interval',
  ];

  return (
    <section
      ref={sectionRef}
      id="sensor"
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      {/* Left Image */}
      <img
        ref={imageRef}
        src="/sensor_rocky_terrain.jpg"
        alt="Sensor in rugged terrain"
        className="absolute left-0 top-0 w-[55vw] h-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Right Panel */}
      <div
        ref={panelRef}
        className="absolute left-[55vw] top-0 w-[45vw] h-full bg-panel"
        style={{ opacity: 0 }}
      />

      {/* Corner Bracket */}
      <svg
        className="absolute left-[55vw] top-0 w-[60px] h-[60px]"
        style={{ zIndex: 3 }}
      >
        <path
          ref={bracketRef}
          d="M 0 60 L 0 0 L 60 0"
          fill="none"
          stroke="#FF6A00"
          strokeWidth="2"
        />
      </svg>

      {/* Content */}
      <div className="absolute left-[61vw] top-[20vh] w-[32vw]" style={{ zIndex: 4 }}>
        <h2
          ref={headlineRef}
          className="text-[clamp(32px,3.6vw,56px)] font-bold text-primary-light leading-[1]"
          style={{ opacity: 0 }}
        >
          A node built for the <span className="accent-color">field.</span>
        </h2>
      </div>

      <div className="absolute left-[61vw] top-[42vh] w-[30vw]" style={{ zIndex: 4 }}>
        <ul ref={featuresRef} className="space-y-5">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-3"
              style={{ opacity: 0 }}
            >
              <Check size={18} className="text-[#FF6A00] mt-0.5 flex-shrink-0" />
              <span className="text-base text-secondary-light">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute left-[61vw] top-[74vh]" style={{ zIndex: 4 }}>
        <button
          ref={ctaRef}
          className="group flex items-center gap-3 px-6 py-3 border border-white/20 text-primary-light font-mono text-sm tracking-[0.1em] uppercase hover:border-[#FF6A00] hover:text-[#FF6A00] transition-all"
          style={{ opacity: 0 }}
        >
          <Download size={16} />
          Download datasheet
        </button>
      </div>
    </section>
  );
}
