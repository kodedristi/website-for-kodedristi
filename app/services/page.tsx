'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const servicesData = [
    { title: 'App Dev', desc: 'Custom mobile and desktop application development solutions.', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072', stats: 'iOS & Android' },
    { title: 'Web Apps', desc: 'Scalable and responsive web applications for enterprise and startups.', img: 'https://images.unsplash.com/photo-1620712948343-008423675df4?q=80&w=1974', stats: 'High Performance' },
    { title: 'Website Design', desc: 'Beautiful, conversion-focused websites that capture your brand essence.', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070', stats: 'Modern UI/UX' },
    { title: 'SEO & AI', desc: 'Search engine optimization, intelligent chatbots and other related works.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070', stats: 'Smart Solutions' },
  ];

  useGSAP(() => {
    gsap.to('.gsap-global-wrapper', { opacity: 1, duration: 0.5 });
    gsap.fromTo('.gsap-service-card', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, scrollTrigger: { trigger: '.gsap-services-grid', start: 'top 80%' } }
    );
  }, { scope: containerRef });

  return (
    <div className="bg-background text-foreground overflow-x-clip" ref={containerRef}>
                  
      <main className="w-full opacity-0 gsap-global-wrapper min-h-screen">
        <section className="relative h-[65vh] w-full flex items-center justify-center overflow-hidden border-b border-primary bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black"></div>
          <div className="relative z-10 text-center max-w-6xl px-8 flex flex-col items-center">
             <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-[0.9] text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
               Core <span className="text-primary italic">Services</span>
             </h1>
             <p className="text-lg md:text-2xl text-gray-400 md:max-w-3xl font-medium tracking-wide">
               Uncompromising digital products engineered for absolute scale.
             </p>
          </div>
        </section>

        <section className="w-full bg-background border-t border-white/10 py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">Enterprise Deployments</h2>
            </div>
            
            <div className="gsap-services-grid flex flex-col space-y-8">
              {servicesData.map((srv, i) => (
                <div key={i} className="gsap-service-card group w-full h-[50vh] min-h-[350px] md:min-h-[400px] relative overflow-hidden bg-black border border-white/10 flex items-center p-8 md:p-12 transition-all hover:border-primary">
                  <div className="absolute inset-0 z-0">
                    <img src={srv.img} className="w-full h-full object-cover opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={srv.title} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 md:from-black via-black/80 to-transparent"></div>
                  </div>
                  <div className="relative z-10 w-full md:w-2/3 lg:w-1/2 flex flex-col h-full justify-center">
                    <p className="text-primary font-black tracking-widest text-lg md:text-2xl uppercase mb-2 md:mb-4">{srv.stats}</p>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase mb-4 md:mb-6">{srv.title}</h3>
                    <p className="text-gray-300 font-medium text-lg md:text-xl leading-relaxed">{srv.desc}</p>
                  </div>
                  <div className="absolute right-12 z-10 hidden md:block">
                     <span className="text-9xl font-black text-white/5 opacity-50 group-hover:text-primary/20 transition-colors">0{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
          </div>
  );
}
