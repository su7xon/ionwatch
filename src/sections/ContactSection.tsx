import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Download, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  className?: string;
}

export default function ContactSection({ className = '' }: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    useCase: '',
    message: '',
  });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Image parallax
      gsap.fromTo(
        imageRef.current,
        { y: 0 },
        {
          y: '-6vh',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Form animation
      gsap.fromTo(
        formRef.current,
        { y: 32, opacity: 0, scale: 0.995 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDialogMessage('Thank you for your inquiry! Our team will contact you within 24 hours.');
    setShowDialog(true);
    setFormData({ name: '', organization: '', email: '', useCase: '', message: '' });
  };

  const handlePilotRequest = () => {
    setDialogMessage('Pilot program request received! We will reach out to discuss deployment options for your region.');
    setShowDialog(true);
  };

  const handleDownload = () => {
    setDialogMessage('The overview PDF is being prepared for download.');
    setShowDialog(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative w-full bg-space ${className}`}
    >
      {/* Top Image Band */}
      <div className="relative h-[44vh] overflow-hidden">
        <img
          ref={imageRef}
          src="/closing_earth_band.jpg"
          alt="Earth horizon"
          className="absolute inset-0 w-full h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07080A]" />
      </div>

      {/* Content */}
      <div className="px-[10vw] pb-[10vh]">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left - Text + CTAs */}
          <div ref={contentRef} className="lg:w-1/2" style={{ opacity: 0 }}>
            <h2 className="text-[clamp(32px,3.6vw,56px)] font-bold text-primary-light leading-[1] mb-6">
              <span className="accent-color">Deploy</span> IonWatch in your region.
            </h2>
            <p className="text-base text-secondary-light leading-relaxed mb-10">
              Pilot partnerships open for Q2. Let's build the coverage map—one node at a time.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={handlePilotRequest}
                className="group flex items-center gap-3 px-6 py-3 border border-[#FF6A00] text-[#FF6A00] font-mono text-sm tracking-[0.1em] uppercase hover:bg-[#FF6A00] hover:text-white transition-all accent-glow"
              >
                Request a pilot
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleDownload}
                className="group flex items-center gap-3 px-6 py-3 border border-white/20 text-primary-light font-mono text-sm tracking-[0.1em] uppercase hover:border-[#FF6A00] hover:text-[#FF6A00] transition-all"
              >
                <Download size={16} />
                Download overview (PDF)
              </button>
            </div>
          </div>

          {/* Right - Form */}
          <div
            ref={formRef}
            className="lg:w-1/2 bg-panel border border-white/10 p-8"
            style={{ opacity: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] uppercase text-secondary-light mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#07080A] border border-white/10 px-4 py-3 text-sm text-primary-light focus:border-[#FF6A00] focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] uppercase text-secondary-light mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-[#07080A] border border-white/10 px-4 py-3 text-sm text-primary-light focus:border-[#FF6A00] focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] uppercase text-secondary-light mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#07080A] border border-white/10 px-4 py-3 text-sm text-primary-light focus:border-[#FF6A00] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] uppercase text-secondary-light mb-2">
                  Use Case
                </label>
                <select
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  className="w-full bg-[#07080A] border border-white/10 px-4 py-3 text-sm text-primary-light focus:border-[#FF6A00] focus:outline-none transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select use case</option>
                  <option value="aviation">Aviation & Airports</option>
                  <option value="survey">Survey & Mapping</option>
                  <option value="telecom">Telecom & Energy</option>
                  <option value="research">Research & Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] uppercase text-secondary-light mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-[#07080A] border border-white/10 px-4 py-3 text-sm text-primary-light focus:border-[#FF6A00] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#FF6A00] text-white font-mono text-sm tracking-[0.1em] uppercase hover:bg-[#FF6A00]/90 transition-colors"
              >
                <Send size={16} />
                Send inquiry
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-secondary-light">
            IONWATCH © 2025
          </p>
          <p className="text-xs text-secondary-light">
            Built for India's space weather resilience
          </p>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-panel border border-white/10 text-primary-light">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Thank You</DialogTitle>
            <DialogDescription className="text-secondary-light">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}
