import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plane, Map as MapIcon, Radio } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface UseCasesSectionProps {
  className?: string;
}

export default function UseCasesSection({ className = '' }: UseCasesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Line animation
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0.2 },
        {
          scaleX: 1,
          opacity: 0.35,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.use-case-card');
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const useCases = [
    {
      icon: Plane,
      title: 'Aviation & Airports',
      description:
        'Detect approach-phase scintillation early. Reduce go-arounds and protect RNAV operations.',
    },
    {
      icon: MapIcon,
      title: 'Survey & Mapping',
      description:
        'Validate RTK reliability before fieldwork. Avoid rework and downtime.',
    },
    {
      icon: Radio,
      title: 'Telecom & Energy',
      description:
        'Protect timing sync across 5G and grid networks. Get alerts before drift becomes outage.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="usecases"
      className={`relative w-full py-[10vh] bg-space ${className}`}
    >
      <div className="px-[10vw]">
        {/* Title Block */}
        <div ref={titleRef} className="max-w-[52vw] mb-6" style={{ opacity: 0 }}>
          <h2 className="text-[clamp(32px,3.6vw,56px)] font-bold text-primary-light leading-[1]">
            Built for <span className="accent-color">operators.</span>
          </h2>
          <p className="text-base text-secondary-light mt-4">
            From aviation to disaster response—here's how teams use IonWatch.
          </p>
        </div>

        {/* Decorative Line */}
        <div
          ref={lineRef}
          className="w-full h-[1px] bg-white/20 mb-[6vh] origin-left"
          style={{ transform: 'scaleX(0)' }}
        />

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-[2vw]"
        >
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="use-case-card bg-panel border border-white/10 p-8 hover:border-[#FF6A00]/30 transition-colors group"
              style={{ opacity: 0 }}
            >
              <useCase.icon
                size={28}
                className="text-[#FF6A00] mb-6 group-hover:scale-110 transition-transform"
              />
              <h3 className="text-xl font-semibold text-primary-light mb-4">
                {useCase.title}
              </h3>
              <p className="text-sm text-secondary-light leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
