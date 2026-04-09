'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Team() {
  const containerRef = useRef<HTMLDivElement>(null);

  const leadersData = [
    {
      title: 'Full Stack Developer',
      name: 'Nabin Dhami',
      desc: 'Expert in end-to-end development. Architects scalable systems from database layer to polished UI with precision.',
      img: '/team/nabin-dhami.jpg',
      imgHover: '/team/nabin-dhami.jpg',
    },
    {
      title: 'Graphics Designer',
      name: 'Bipan Pandey',
      desc: 'Creative genius in visual arts. Transforms brands into visual identities that captivate and convert.',
      img: '/team/bipan-pandey.jpg',
      imgHover: '/team/bipan-pandey.jpg',
    },
    {
      title: 'Frontend & UI/UX Designer',
      name: 'Suman Sapkota',
      desc: 'Crafts seamless, pixel-perfect user experiences. Bridges design intent with engineering reality.',
      img: '/team/suman-sapkota.jpg',
      imgHover: ' /team/suman-sapkota.jpg',
    },
  ];

  useGSAP(() => {
    gsap.to('.gsap-global-wrapper', { opacity: 1, duration: 0.6, ease: 'power2.out' });

    // Hero text reveal
    gsap.fromTo('.gsap-team-hero-el',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out', delay: 0.3 }
    );

    // Cards stagger on scroll
    gsap.fromTo('.gsap-leader-card',
      { opacity: 0, y: 70, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.gsap-leaders-grid', start: 'top 78%' }
      }
    );

    // Floating label on hero
    gsap.to('.gsap-hero-count', {
      y: -8, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }, { scope: containerRef });

  return (
    <div className="bg-background text-foreground overflow-x-clip" ref={containerRef}>
      <main className="w-full opacity-0 gsap-global-wrapper">

        {/* ── Hero ── */}
        <section className="relative h-[70vh] w-full flex items-center overflow-hidden border-b border-white/10 bg-background">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(0,85,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,85,255,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <p className="gsap-team-hero-el text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6">
              The Human Core
            </p>
            <h1 className="gsap-team-hero-el text-5xl sm:text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.9] text-white uppercase">
              Meet The<br /><span className="text-primary italic">Builders</span>
            </h1>
            <p className="gsap-team-hero-el text-lg md:text-2xl text-gray-400 font-medium max-w-2xl">
              The apex engineers and visionaries powering our digital revolution.
            </p>
          </div>

          {/* Floating count badge */}
          <div className="gsap-hero-count absolute bottom-12 right-12 hidden lg:flex flex-col items-end">
            <span className="text-[6rem] font-black text-white/5 leading-none select-none">0{leadersData.length}</span>
            <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Team Members</span>
          </div>
        </section>

        {/* ── Team Grid ── */}
        <section className="w-full bg-background py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-12 md:mb-16 border-b border-white/10 pb-8">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                Global Command
              </h2>
              <span className="text-gray-600 font-bold text-sm uppercase tracking-widest hidden md:block">
                {leadersData.length} Members
              </span>
            </div>

            {/* Same hover-card design as homepage */}
            <div className="gsap-leaders-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadersData.map((leader, i) => (
                <div
                  key={i}
                  className="gsap-leader-card group relative h-[560px] overflow-hidden bg-black border border-white/10 cursor-crosshair"
                >
                  {/* Primary image */}
                  <img
                    src={leader.img}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-90 grayscale group-hover:opacity-0 transition-all duration-700 ease-in-out"
                    alt={leader.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = leader.imgHover; }}
                  />
                  {/* Hover image */}
                  <img
                    src={leader.imgHover}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-90 transition-all duration-700 ease-in-out scale-105 group-hover:scale-100"
                    alt={leader.name}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                  {/* Index number */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="text-white/30 font-black text-sm font-mono">0{i + 1}</span>
                  </div>

                  {/* Corner arrow revealed on hover */}
                  <div className="absolute top-6 right-6 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                  </div>

                  {/* Info */}
                  <div className="relative z-10 flex flex-col justify-end h-full p-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <p className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-2">{leader.title}</p>
                    <h3 className="text-3xl font-black text-white uppercase leading-none mb-3">{leader.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                      {leader.desc}
                    </p>
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
