'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      title: 'Linking Dreams',
      tag: 'Web Platform',
      year: '2024',
      desc: 'A professional networking and opportunity platform connecting talent with enterprise.',
      img: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=2070',
    },
    {
      title: 'Unigo',
      tag: 'Educational Platform',
      year: '2024',
      desc: 'Next-generation university discovery and application management system.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c50a30?q=80&w=2070',
    },
    {
      title: 'Boxmandu',
      tag: 'E-commerce',
      year: '2023',
      desc: 'Subscription box e-commerce platform with intelligent product curation engine.',
      img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080',
    },
    {
      title: 'Finnigo',
      tag: 'Fintech',
      year: '2024',
      desc: 'Smart personal finance platform with AI-driven insights and automated budgeting.',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
    },
    {
      title: 'Renescience',
      tag: 'Library Management',
      year: '2023',
      desc: 'Modern digital library and resource management system for academic institutions.',
      img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074',
    },
    {
      title: 'Other Projects',
      tag: 'Various',
      year: '2022–2024',
      desc: 'A collection of diverse engineering projects across multiple industries and scales.',
      img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070',
    },
  ];

  useGSAP(() => {
    // Page reveal
    gsap.to('.gsap-global-wrapper', { opacity: 1, duration: 0.6, ease: 'power2.out' });

    // Hero parallax
    gsap.to('.gsap-hero-bg', {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: { trigger: '#portfolio-hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Hero text stagger
    gsap.fromTo('.gsap-hero-el',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out', delay: 0.3 }
    );

    // Each card: clip-path reveal from bottom + stagger
    gsap.fromTo('.gsap-portfolio-item',
      { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        stagger: { each: 0.12, from: 'start' },
        ease: 'power4.out',
        duration: 1,
        scrollTrigger: { trigger: '.gsap-portfolio-grid', start: 'top 78%' }
      }
    );

    // Counter number scroll-up animation
    gsap.fromTo('.gsap-counter-num',
      { textContent: '0' },
      {
        textContent: projects.length,
        duration: 1.5,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: { trigger: '.gsap-portfolio-grid', start: 'top 80%' }
      }
    );

    // Image scale on hover is handled via CSS; add unique line-draw on scroll
    document.querySelectorAll('.gsap-portfolio-item').forEach((card) => {
      const line = card.querySelector('.gsap-card-line') as HTMLElement;
      if (line) {
        gsap.fromTo(line,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' }
          }
        );
      }
    });

    ScrollTrigger.refresh();
  }, { scope: containerRef });

  return (
    <div className="bg-background text-foreground overflow-x-clip min-h-screen" ref={containerRef}>
      <main className="w-full opacity-0 gsap-global-wrapper">

        {/* ── Hero ── */}
        <section id="portfolio-hero" className="relative h-[72vh] w-full flex items-end overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-black">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"
              className="gsap-hero-bg w-full h-[130%] object-cover opacity-40 block origin-top"
              alt="Portfolio hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
            <p className="gsap-hero-el text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">Our Work</p>
            <h1 className="gsap-hero-el text-5xl sm:text-7xl md:text-9xl font-black mb-4 tracking-tighter leading-[0.9] text-white uppercase">
              Digital<br /><span className="text-primary italic">Monuments</span>
            </h1>
            <p className="gsap-hero-el text-gray-400 text-lg md:text-xl font-medium max-w-xl">
              Flagship products built to operate at the frontier of technology.
            </p>
          </div>

          {/* Live counter */}
          <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:flex flex-col items-center gap-1 z-10">
            <span className="gsap-counter-num text-7xl font-black text-white/10 leading-none tabular-nums">0</span>
            <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Projects</span>
          </div>
        </section>

        {/* ── Grid ── */}
        <section className="w-full bg-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">

            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Selected Projects</h2>
              <span className="text-gray-600 text-sm font-bold uppercase tracking-widest hidden md:block">{projects.length} Case Studies</span>
            </div>

            {/* Uniform grid — all cards same design theory, varying only in span */}
            <div className="gsap-portfolio-grid grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {projects.map((project, i) => (
                <div
                  key={i}
                  className={`gsap-portfolio-item group relative overflow-hidden bg-black border border-white/10 hover:border-primary/40 transition-colors duration-500 ${
                    i === 0 || i === 3 ? 'md:col-span-2 h-[420px] md:h-[560px]' : 'h-[380px] md:h-[460px]'
                  }`}
                >
                  {/* Image */}
                  <img
                    src={project.img}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-in-out"
                    alt={project.title}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Top meta */}
                  <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 md:p-8">
                    <span className="inline-block border border-white/20 bg-black/40 backdrop-blur-sm px-4 py-1.5 text-primary font-bold tracking-widest uppercase text-xs">
                      {project.tag}
                    </span>
                    <span className="text-white/30 font-mono text-sm font-bold">{project.year}</span>
                  </div>

                  {/* Bottom content — revealed with slide-up on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    {/* Animated line indicator */}
                    <div className="gsap-card-line h-px bg-primary mb-4 origin-left" style={{ transform: 'scaleX(0)' }} />

                    <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase leading-none mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {project.title}
                    </h3>

                    {/* Description - hidden until hover */}
                    <p className="text-gray-300 text-sm md:text-base font-medium max-w-lg leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                      {project.desc}
                    </p>

                    {/* View project link */}
                    <div className="mt-4 inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      View Project
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </div>

                  {/* Index number watermark */}
                  <span className="absolute right-6 bottom-6 text-6xl md:text-8xl font-black text-white/5 select-none leading-none pointer-events-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
