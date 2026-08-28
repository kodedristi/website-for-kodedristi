'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Insights() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const newsData = [
    { date: 'Nov 12, 2026', tag: 'Expansion', title: 'Kodedristi Expands to Tokyo Hub', desc: 'Deploying our localized multi-cloud relay centers to guarantee 5ms latency across Eastern Asia.', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974' },
    { date: 'Oct 04, 2026', tag: 'Finance', title: 'Series B Funding Acquired', desc: 'Injected capital entirely dedicated to quantum resistor research and cryptographic ML.', img: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1974' },
    { date: 'Sep 21, 2026', tag: 'Award', title: 'Awarded Top Cloud Agency 2026', desc: 'Honored at the global developer summit for zero-downtime architecture implementation.', img: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=2070' },
  ];

  useGSAP(() => {
    gsap.to('.gsap-global-wrapper', { opacity: 1, duration: 0.5 });
    
    gsap.fromTo('.gsap-news-item',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, stagger: 0.2, scrollTrigger: { trigger: '.gsap-news-list', start: 'top 80%' } }
    );
  }, { scope: containerRef });

  return (
    <div className="bg-background text-foreground overflow-x-clip" ref={containerRef}>
                  
      <main className="w-full opacity-0 gsap-global-wrapper">
        <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden border-b border-primary bg-primary text-black">
          <div className="relative z-10 text-center max-w-6xl px-6 md:px-8 flex flex-col items-center">
             <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-4 md:mb-6 tracking-tighter leading-[0.9] uppercase">
               The Signal
             </h1>
             <p className="text-lg md:text-2xl font-medium tracking-wide">
               Unfiltered architectural thoughts and radical company updates.
             </p>
          </div>
        </section>

        <section className="w-full bg-background py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-8 gsap-news-list">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12 md:mb-16 border-b border-white/10 pb-6 md:pb-8">Latest Transmissions</h2>
            
            <div className="flex flex-col space-y-8 md:space-y-12">
              {newsData.map((news, i) => (
                <div key={i} className="gsap-news-item group flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center border border-white/5 bg-white/5 p-6 md:p-8 hover:bg-white/10 transition-colors">
                  <div className="w-full md:w-1/3 aspect-video relative overflow-hidden flex-shrink-0">
                    <img src={news.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={news.title} />
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col">
                    <div className="flex gap-4 items-center mb-3 md:mb-4">
                      <span className="text-primary font-bold tracking-widest text-xs md:text-sm uppercase">{news.tag}</span>
                      <span className="text-white/50 text-xs md:text-sm font-medium">{news.date}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-3 md:mb-4 leading-tight">{news.title}</h3>
                    <p className="text-gray-400 font-medium text-base md:text-lg leading-relaxed">{news.desc}</p>
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
