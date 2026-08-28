'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const contactDetails = [
  {
    label: 'Enterprise Engagement',
    value: 'dristikode@gmail.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
  },
  {
    label: 'Direct Line',
    value: '+977 985-136-2001',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    ),
  },
  {
    label: 'Headquarters',
    value: 'Kathmandu, Nepal',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
  },
];

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      import('sonner').then(({ toast }) => toast.error('Please fill out all required fields.'));
      return;
    }
    import('sonner').then(({ toast }) => {
      const promise = new Promise((resolve) => setTimeout(resolve, 1500));
      toast.promise(promise, {
        loading: 'Transmitting your message...',
        success: () => {
          setFormData({ name: '', company: '', email: '', message: '' });
          return 'Message received. We will be in touch.';
        },
        error: 'Transmission failed. Please retry.',
      });
    });
  };

  useGSAP(() => {
    gsap.to('.gsap-global-wrapper', { opacity: 1, duration: 0.6, ease: 'power2.out' });

    // Left panel entrance
    gsap.fromTo('.gsap-contact-left',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
    );

    // Right form entrance
    gsap.fromTo('.gsap-contact-right',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.45 }
    );

    // Contact detail cards stagger
    gsap.fromTo('.gsap-detail-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.6 }
    );

    // Form fields stagger
    gsap.fromTo('.gsap-form-field',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.7 }
    );

    ScrollTrigger.refresh();
  }, { scope: containerRef });

  const inputClass = (field: string) =>
    `w-full bg-transparent border-b-2 py-3 text-white placeholder-transparent outline-none transition-all duration-300 text-base font-medium ${
      focused === field
        ? 'border-primary'
        : formData[field as keyof typeof formData]
        ? 'border-white/40'
        : 'border-white/15'
    }`;

  return (
    <div className="bg-background text-foreground overflow-x-clip" ref={containerRef}>
      <main className="w-full opacity-0 gsap-global-wrapper min-h-screen">

        {/* ── Full-width split layout ── */}
        <div className="flex flex-col lg:flex-row min-h-screen">

          {/* ── Left Panel ── */}
          <div className="gsap-contact-left relative w-full lg:w-[45%] flex flex-col justify-between bg-black border-r border-white/10 px-8 md:px-14 lg:px-16 pt-32 pb-16 overflow-hidden">
            {/* BG texture */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'linear-gradient(rgba(0,85,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,85,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6">Get in Touch</p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9] text-white uppercase">
                Let's Build<br />Something<br /><span className="text-primary italic">Extraordinary</span>
              </h1>
              <p className="text-gray-400 text-lg font-medium max-w-sm leading-relaxed">
                Connect with our engineering hub. We respond within 24 hours on every inquiry.
              </p>
            </div>

            {/* Contact detail cards */}
            <div className="relative z-10 space-y-4 mt-12">
              {contactDetails.map((detail, i) => (
                <div
                  key={i}
                  className="gsap-detail-card group flex items-start gap-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 p-4 cursor-default"
                >
                  <div className="flex-shrink-0 w-10 h-10 border border-white/20 group-hover:border-primary/40 flex items-center justify-center text-primary transition-colors duration-300">
                    {detail.icon}
                  </div>
                  <div>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">{detail.label}</p>
                    <p className="text-white font-mono text-sm font-medium">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel: Form ── */}
          <div className="gsap-contact-right w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-14 lg:px-16 pt-24 lg:pt-0 pb-16 bg-background">
            <div className="max-w-xl w-full mx-auto lg:mx-0">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">Start the Conversation</h2>
              <p className="text-gray-500 text-sm mb-10 font-medium">Fill in the details below and our team will craft a response.</p>

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Name + Company row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="gsap-form-field relative">
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      placeholder="Your Name"
                      className={inputClass('name')}
                    />
                    <label htmlFor="contact-name" className={`absolute left-0 transition-all duration-200 pointer-events-none font-bold text-xs uppercase tracking-widest ${focused === 'name' || formData.name ? '-top-5 text-primary text-[10px]' : 'top-3 text-white/30 text-sm'}`}>
                      Full Name *
                    </label>
                  </div>
                  <div className="gsap-form-field relative">
                    <input
                      type="text"
                      name="company"
                      id="contact-company"
                      value={formData.company}
                      onChange={handleChange}
                      onFocus={() => setFocused('company')}
                      onBlur={() => setFocused(null)}
                      placeholder="Company"
                      className={inputClass('company')}
                    />
                    <label htmlFor="contact-company" className={`absolute left-0 transition-all duration-200 pointer-events-none font-bold text-xs uppercase tracking-widest ${focused === 'company' || formData.company ? '-top-5 text-primary text-[10px]' : 'top-3 text-white/30 text-sm'}`}>
                      Company
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div className="gsap-form-field relative">
                  <input
                    type="email"
                    name="email"
                    id="contact-email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="Email"
                    className={inputClass('email')}
                  />
                  <label htmlFor="contact-email" className={`absolute left-0 transition-all duration-200 pointer-events-none font-bold text-xs uppercase tracking-widest ${focused === 'email' || formData.email ? '-top-5 text-primary text-[10px]' : 'top-3 text-white/30 text-sm'}`}>
                    Email Address *
                  </label>
                </div>

                {/* Message */}
                <div className="gsap-form-field relative">
                  <textarea
                    name="message"
                    id="contact-message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    rows={5}
                    placeholder="Message"
                    className={`${inputClass('message')} resize-none`}
                  />
                  <label htmlFor="contact-message" className={`absolute left-0 transition-all duration-200 pointer-events-none font-bold text-xs uppercase tracking-widest ${focused === 'message' || formData.message ? '-top-5 text-primary text-[10px]' : 'top-3 text-white/30 text-sm'}`}>
                    Message *
                  </label>
                </div>

                {/* Submit */}
                <div className="gsap-form-field">
                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden bg-primary text-white font-black uppercase tracking-widest text-sm py-5 px-8 transition-all duration-300 hover:bg-white hover:text-black flex items-center justify-center gap-3"
                  >
                    <span>Send Message</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                  <p className="text-white/20 text-xs text-center mt-4 font-medium">
                    We reply within 24 hours · All communications are encrypted
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
