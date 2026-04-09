'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const impactData = [
    { client: 'Vanguard Banking Group', quote: '"The speed at which Kodedristi architected our edge network was mathematically staggering. Zero downtime during the transition."', author: 'E. Collins, CTO' },
    { client: 'Aero Dynamics', quote: '"They operate like a highly specialized military unit. The code is flawless, the deployment is instantaneous."', author: 'M. Vance, VP Engineering' },
    { client: 'Globex Logistics', quote: '"Our legacy systems were fundamentally broken. They rebuilt the entire topology in 4 weeks."', author: 'S. Richards, CEO' },
    { client: 'Neon Healthcare', quote: '"Unrelenting focus on security and latency. There is no other agency operating at this altitude."', author: 'L. Chen, Director' }
  ];

  useGSAP(() => {
    gsap.to('.gsap-global-wrapper', { opacity: 1, duration: 0.5 });
    
    gsap.fromTo('.gsap-testimonial-item', 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, stagger: 0.15, duration: 0.8, scrollTrigger: { trigger: '.gsap-testimonials-grid', start: 'top 75%' } }
    );
  }, { scope: containerRef });

  return (
    <div className="bg-background text-foreground overflow-x-clip" ref={containerRef}>
                  
      <main className="w-full opacity-0 gsap-global-wrapper min-h-screen">
        <section className="relative h-[65vh] w-full flex items-center justify-center overflow-hidden border-b border-white/10 bg-white">
          <div className="absolute inset-0 z-0 bg-white">
             <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" className="w-full h-full object-cover opacity-20 grayscale" alt="Testimonials bg" />
          </div>
          <div className="relative z-10 text-center max-w-6xl px-6 md:px-8 flex flex-col items-center">
             <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-[0.9] text-black uppercase">
               System <span className="text-primary italic">Impact</span>
             </h1>
             <p className="text-lg md:text-2xl text-gray-700 md:max-w-3xl font-medium tracking-wide">
               The enterprise results of our uncompromising execution.
             </p>
          </div>
        </section>

        <section className="w-full bg-background border-t border-white/10 py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12 md:mb-16 text-center">Executive Feedback</h2>
            
            <div className="gsap-testimonials-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {impactData.map((impact, i) => (
                <div key={i} className="gsap-testimonial-item flex flex-col justify-between w-full min-h-[300px] h-auto md:h-[400px] bg-black border border-white/10 p-8 md:p-12 hover:border-primary transition-all">
                  <p className="text-primary font-bold tracking-widest text-xs uppercase mb-6 md:mb-8">{impact.client}</p>
                  <h3 className="text-2xl md:text-3xl font-serif text-white italic leading-relaxed mb-8 md:mb-12">{impact.quote}</h3>
                  <div className="border-t border-white/10 pt-6 mt-auto">
                    <p className="text-white font-black uppercase tracking-widest text-sm">{impact.author}</p>
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
