import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import ThreatSection from './sections/ThreatSection';
import SensorSection from './sections/SensorSection';
import PlatformSection from './sections/PlatformSection';
import DeploymentSection from './sections/DeploymentSection';
import UseCasesSection from './sections/UseCasesSection';
import SpecsSection from './sections/SpecsSection';
import ContactSection from './sections/ContactSection';
import Dashboard from './pages/Dashboard';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for all sections to mount and create their ScrollTriggers
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.08 && value <= r.end + 0.08);
            if (!inPinned) return value;
            
            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out"
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-space grain-overlay">
      <Navigation />
      <main className="relative">
        <HeroSection className="z-10" />
        <ThreatSection className="z-20" />
        <SensorSection className="z-30" />
        <PlatformSection className="z-40" />
        <DeploymentSection className="z-50" />
        <UseCasesSection className="z-60" />
        <SpecsSection className="z-70" />
        <ContactSection className="z-80" />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
