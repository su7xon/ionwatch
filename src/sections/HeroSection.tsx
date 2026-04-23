import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Activity, Zap, ActivitySquare, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dataCardRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<SVGRectElement>(null);

  // Load animation (auto-play on mount)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Image fade in
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.2 }
      );

      // HUD frame draw
      if (frameRef.current) {
        const length = frameRef.current.getTotalLength();
        gsap.set(frameRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(
          frameRef.current,
          { strokeDashoffset: 0, duration: 1 },
          0.2
        );
      }

      // Headline words
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 },
          0.4
        );
      }

      // Subheadline + CTAs
      tl.fromTo(
        subheadlineRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.7
      );

      tl.fromTo(
        ctaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.8
      );

      // Data card
      tl.fromTo(
        dataCardRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.6
      );

      // Status pill
      tl.fromTo(
        statusRef.current,
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 },
        0.8
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
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
          onLeaveBack: () => {
            gsap.set([headlineRef.current, subheadlineRef.current, ctaRef.current, dataCardRef.current, statusRef.current], {
              opacity: 1, x: 0, y: 0
            });
            gsap.set(imageRef.current, { opacity: 1, scale: 1, x: 0 });
          }
        },
      });

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        subheadlineRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        dataCardRef.current,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        statusRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        imageRef.current,
        { scale: 1, x: 0 },
        { scale: 1.08, x: '-6vw', ease: 'none' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <img
        ref={imageRef}
        src="/hero_earth_spacecraft.jpg"
        alt="Earth from space"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 vignette" />

      {/* Sun Glow */}
      <div
        className="absolute right-[8vw] top-[10vh] w-[18vw] h-[18vw] rounded-full sun-glow"
        style={{
          background: 'radial-gradient(circle, rgba(255,106,0,0.22), rgba(255,106,0,0) 70%)',
        }}
      />

      {/* HUD Frame */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 4 }}
      >
        <rect
          ref={frameRef}
          x="6vw"
          y="10vh"
          width="88vw"
          height="80vh"
          fill="none"
          stroke="rgba(242,244,248,0.18)"
          strokeWidth="1"
        />
      </svg>

      {/* Status Pill */}
      <div
        ref={statusRef}
        className="absolute right-[8vw] top-[10vh] flex items-center gap-3 px-4 py-2 bg-[#0E1116]/80 border border-white/10"
        style={{ zIndex: 5, opacity: 0 }}
      >
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-secondary-light">
          Solar Cycle 25 &middot; India NavIC Intelligence &middot; Real-Time
        </span>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#FF6A00]" />
          <span className="font-mono text-xs tracking-[0.1em] uppercase text-[#FF6A00]">
            Operational
          </span>
        </div>
      </div>

      {/* Headline Block */}
      <div
        className="absolute left-[10vw] top-[28vh] w-[42vw]"
        style={{ zIndex: 5 }}
      >
        <h1
          ref={headlineRef}
          className="text-[clamp(36px,5vw,72px)] font-bold text-primary-light leading-[0.95]"
        >
          <span className="word inline-block">NavIC</span>{' '}
          <span className="word inline-block">was</span>{' '}
          <span className="word inline-block">flying</span>{' '}
          <span className="word inline-block text-secondary-light">blind.</span><br/>
          <span className="word inline-block">Not</span>{' '}
          <span className="word inline-block accent-color">anymore.</span>
        </h1>
      </div>

      {/* Subheadline + CTA */}
      <div
        className="absolute left-[10vw] top-[58vh] w-[34vw]"
        style={{ zIndex: 5 }}
      >
        <p
          ref={subheadlineRef}
          className="text-lg text-secondary-light leading-relaxed mb-8"
          style={{ opacity: 0 }}
        >
          IonWatch monitors India's ionosphere in real time — computing S4, σφ, and TEC from GNSS signals to protect navigation, telecoms, and aviation during solar storms.
        </p>

        <div ref={ctaRef} className="flex items-center gap-6" style={{ opacity: 0 }}>
          <Link to="/dashboard" className="group flex items-center gap-3 px-6 py-3 border border-[#FF6A00] text-[#FF6A00] font-mono text-sm tracking-[0.1em] uppercase hover:bg-[#FF6A00] hover:text-white transition-all accent-glow">
            View live dashboard
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 text-secondary-light hover:text-primary-light transition-colors font-mono text-sm tracking-[0.05em]">
            See Pricing
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Data Card */}
      <div
        ref={dataCardRef}
        className="absolute right-[8vw] bottom-[10vh] w-[28vw] min-h-[22vh] bg-[#0E1116]/80 border border-white/10 p-6 backdrop-blur-sm"
        style={{ zIndex: 5, opacity: 0 }}
      >
        <h3 className="font-mono text-xs tracking-[0.14em] uppercase text-secondary-light mb-6 flex items-center gap-2">
          <Globe size={14} /> Live Network Snapshot
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-sm text-secondary-light">
              <Zap size={14} className="text-[#FF6A00]"/> Kp Index
            </div>
            <span className="font-mono text-lg text-primary-light">0.0</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-sm text-secondary-light">
              <ActivitySquare size={14} className="text-primary-light"/> Max S4 India
            </div>
            <span className="font-mono text-lg text-primary-light">0.082</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-secondary-light">
              <Activity size={14} className="text-primary-light"/> VTEC (TECU)
            </div>
            <span className="font-mono text-lg text-primary-light">31</span>
          </div>
        </div>
      </div>
    </section>
  );
}
