import { useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Map, Bell, History } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PlatformSectionProps {
  className?: string;
}

export default function PlatformSection({ className = '' }: PlatformSectionProps) {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
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
        { x: '60vw', opacity: 0, scale: 1.05 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        panelRef.current,
        { x: '-45vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.14
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.18
      );

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
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bodyRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        ctaRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        imageRef.current,
        { scale: 1, x: 0, opacity: 1 },
        { scale: 1.06, x: '8vw', opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        lineRef.current,
        { opacity: 1 },
        { opacity: 0.1, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Map, text: 'Regional S4/σφ heatmaps' },
    { icon: Bell, text: 'Threshold alerts (SMS/email/webhook)' },
    { icon: History, text: 'Historical exports & trend reports' },
  ];

  return (
    <section
      ref={sectionRef}
      id="platform"
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      {/* Right Image */}
      <img
        ref={imageRef}
        src="/platform_dashboard_laptop.jpg"
        alt="Dashboard on laptop"
        className="absolute left-[45vw] top-0 w-[55vw] h-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Left Panel */}
      <div
        ref={panelRef}
        className="absolute left-0 top-0 w-[45vw] h-full bg-panel"
        style={{ opacity: 0 }}
      />

      {/* Accent Line */}
      <div
        ref={lineRef}
        className="absolute left-[8%] top-[18vh] w-[70%] h-[2px] accent-bg origin-left"
        style={{ opacity: 0, transform: 'scaleX(0)' }}
      />

      {/* Content */}
      <div className="absolute left-[8vw] top-[24vh] w-[34vw]" style={{ zIndex: 4 }}>
        <h2
          ref={headlineRef}
          className="text-[clamp(32px,3.6vw,56px)] font-bold text-primary-light leading-[1]"
          style={{ opacity: 0 }}
        >
          See the ionosphere in <span className="accent-color">real time.</span>
        </h2>
      </div>

      <div
        ref={bodyRef}
        className="absolute left-[8vw] top-[44vh] w-[32vw]"
        style={{ zIndex: 4, opacity: 0 }}
      >
        <p className="text-base text-secondary-light leading-relaxed mb-8">
          A web-first dashboard built for operators: scintillation maps, alert feeds, 
          and APIs that integrate into your workflows.
        </p>

        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <feature.icon size={18} className="text-[#FF6A00]" />
              <span className="text-sm text-secondary-light">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute left-[8vw] top-[74vh]" style={{ zIndex: 4 }}>
        <button
          ref={ctaRef}
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-3 px-6 py-3 border border-[#FF6A00] text-[#FF6A00] font-mono text-sm tracking-[0.1em] uppercase hover:bg-[#FF6A00] hover:text-white transition-all accent-glow"
          style={{ opacity: 0 }}
        >
          Explore the dashboard
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
