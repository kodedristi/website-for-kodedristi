'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Careers() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const rolesData = [
    { type: 'Engineering', role: 'Principal Systems Architect', loc: 'Remote / Global' },
    { type: 'Data Science', role: 'Senior AI Researcher', loc: 'London / Hybrid' },
    { type: 'Design', role: 'Lead UX Engineer', loc: 'New York / Hybrid' },
    { type: 'Security', role: 'Zero-Touch Validator', loc: 'Remote / Global' },
  ];

  useGSAP(() => {
    gsap.to('.gsap-global-wrapper', { opacity: 1, duration: 0.5 });
    
    gsap.fromTo('.gsap-role-card',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, stagger: 0.1, scrollTrigger: { trigger: '.gsap-roles-grid', start: 'top 80%' } }
    );
  }, { scope: containerRef });

  return (
    <div className="bg-background text-foreground overflow-x-clip" ref={containerRef}>
                  
      <main className="w-full opacity-0 gsap-global-wrapper bg-white text-black min-h-screen">
        <section className="relative w-full pt-48 pb-24 border-b border-black/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8 text-center pt-16 md:pt-0">
             <p className="text-primary font-bold tracking-widest uppercase mb-4 text-sm md:text-base">Join The Vanguard</p>
             <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-[0.9] uppercase">
               Engineer <br/><span className="text-primary italic">Tomorrow</span>
             </h1>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-black text-white">
          <div className="max-w-5xl mx-auto px-6 md:px-8 gsap-roles-grid">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 md:mb-16 text-center">Open Requisitions</h2>
            
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {rolesData.map((role, i) => (
                <div key={i} className="gsap-role-card flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-12 border border-white/20 hover:border-primary hover:bg-white/5 transition-all cursor-pointer">
                  <div>
                    <p className="text-primary font-bold tracking-widest text-xs md:text-sm uppercase mb-2">{role.type}</p>
                    <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase">{role.role}</h3>
                  </div>
                  <div className="flex items-center gap-4 md:gap-8 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                    <p className="text-gray-400 font-medium text-sm md:text-lg block">{role.loc}</p>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center text-white font-bold">&rarr;</div>
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
