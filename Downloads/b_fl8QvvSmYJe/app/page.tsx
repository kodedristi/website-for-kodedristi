"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── CEO DATA ──────────────────────────────────────────────────────────────
  const ceoData = [
    {
      title: "The Vision",
      text: '"We established Kodedristi not to participate in the software industry, but to fundamentally redefine the underlying architecture of digital enterprise."',
      author: "— Prabin Kumar Bogati, CEO",
      img: "/home/prabin-kumar-bogati.jpeg",
    },
    {
      title: "The Standard",
      text: '"Zero legacy debt. Zero compromise. We hire the top 0.1% of global engineering talent because the systems we build run the world."',
      author: "— Prabin Kumar Bogati, CEO",
      img: "/home/prabin-kumar-bogati-1.png",
    },
  ];

  // ── APPROACH DATA ──────────────────────────────────────────────────────────
  const approachData = [
    {
      phase: "01 / Discovery",
      title: "System Intelligence Audit",
      text: "We reverse-engineer your entire system — analyzing architecture, data flow, and dependencies to uncover hidden bottlenecks.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072",
    },
    {
      phase: "02 / Architecture",
      title: "Scalable System Design",
      text: "We design robust, modular architectures aligned with your business logic — ensuring high performance and long-term scalability.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    },
    {
      phase: "03 / Engineering",
      title: "Precision Development",
      text: "Our engineers build with clean, maintainable code using modern stacks — optimized for speed, security, and seamless integration.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070",
    },
    {
      phase: "04 / Deployment",
      title: "Zero-Downtime Delivery",
      text: "We implement CI/CD pipelines and deploy with precision — ensuring smooth rollouts, zero downtime, and production-grade reliability.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2074",
    },
    {
      phase: "05 / Evolution",
      title: "Continuous Optimization",
      text: "We continuously monitor, analyze, and refine your system — adapting to scale and evolving with your business needs.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070",
    },
  ];

  // ── SERVICES DATA ─────────────────────────────────────────────────────────
  const servicesData = [
    {
      title: "System Architecture",
      desc: "We design scalable, fault-tolerant architectures tailored to your product — from database design to distributed systems.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072",
    },
    {
      title: "Full-Stack Engineering",
      desc: "From intuitive frontend interfaces to robust backend systems, we build end-to-end applications using modern stacks.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    },
    {
      title: "AI & Smart Systems",
      desc: "We integrate intelligent systems — from recommendation engines to adaptive learning models — transforming raw data into insights.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070",
    },
    {
      title: "Cloud & DevOps",
      desc: "We build and deploy scalable infrastructure with CI/CD pipelines, containerization, and cloud orchestration.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2074",
    },
    {
      title: "Security Engineering",
      desc: "We implement secure-by-design systems with authentication, authorization, and data protection at every layer.",
      img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070",
    },
  ];

  // ── TEAM DATA — aligned with app/team/page.tsx ───────────────────────────
  const homeTeamData = [
    {
      name: "Nabin Dhami",
      role: "Full Stack Developer",
      img: "/team/nabin-dhami.jpg",
      imgHover:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974",
    },
    {
      name: "Bipan Pandey",
      role: "Graphics Designer",
      img: "/team/bipan-pandey.jpg",
      imgHover:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974",
    },
    {
      name: "Suman Sapkota",
      role: "Frontend & UI/UX Designer",
      img: "/team/suman-sapkota.jpg",
      imgHover:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974",
    },
  ];
  // partners data
  const partnersData = [
    { name: "Unigo", logo: "/partner/unigo.png" },
    { name: "Linking Derams", logo: "/partner/linkingderams.png" },
  ];

  // ── GSAP ──────────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      // Page reveal
      gsap.to(".gsap-global-wrapper", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });

      // Hero entrance
      gsap.fromTo(
        ".gsap-hero-element",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.18,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.4,
        },
      );

      // Hero BG slow zoom
      gsap.to(".gsap-hero-bg", {
        scale: 1.12,
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // CEO pinned fade
      const ceoSection = document.querySelector(
        ".gsap-ceo-section",
      ) as HTMLElement;
      if (ceoSection) {
        const panels = ceoSection.querySelectorAll(".gsap-ceo-panel");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ceoSection,
            pin: true,
            start: "top top",
            end: "+=200%",
            scrub: 1,
          },
        });
        panels.forEach((panel, i) => {
          if (i > 0)
            tl.fromTo(
              panel,
              { opacity: 0, x: 30 },
              { opacity: 1, x: 0, duration: 1, ease: "none" },
            );
          if (i !== panels.length - 1)
            tl.to(panel, { opacity: 0, x: -30, duration: 1, ease: "none" });
        });
      }

      // Approach horizontal scroll
      const approachSection = document.querySelector(
        ".gsap-approach-section",
      ) as HTMLElement;
      if (approachSection) {
        const wrapper = approachSection.querySelector(
          ".gsap-approach-wrapper",
        ) as HTMLElement;
        if (wrapper) {
          const tween = gsap.to(wrapper, {
            x: () => -(wrapper.scrollWidth - window.innerWidth),
            ease: "none",
          });
          ScrollTrigger.create({
            trigger: approachSection,
            pin: true,
            start: "top top",
            end: () => `+=${wrapper.scrollWidth - window.innerWidth}`,
            scrub: 1,
            animation: tween,
          });
        }
      }

      // Services pinned fade
      const serviceSection = document.querySelector(
        ".gsap-service-section",
      ) as HTMLElement;
      if (serviceSection) {
        const panels = serviceSection.querySelectorAll(".gsap-service-panel");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: serviceSection,
            pin: true,
            start: "top top",
            end: "+=250%",
            scrub: 1,
          },
        });
        panels.forEach((panel, i) => {
          if (i > 0)
            tl.fromTo(
              panel,
              { opacity: 0, scale: 0.97 },
              { opacity: 1, scale: 1, duration: 1, ease: "none" },
            );
          if (i !== panels.length - 1)
            tl.to(panel, {
              opacity: 0,
              scale: 1.03,
              duration: 1,
              ease: "none",
            });
        });
      }

      // Team cards stagger on scroll
      gsap.fromTo(
        ".gsap-home-team-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".gsap-home-team-grid", start: "top 80%" },
        },
      );

      // Partners marquee
      const partnersMarquee = document.querySelector(
        ".gsap-partners-marquee",
      ) as HTMLElement;
      if (partnersMarquee) {
        gsap.fromTo(
          partnersMarquee,
          { xPercent: -50 },
          { xPercent: 0, duration: 30, repeat: -1, ease: "none" },
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef },
  );

  return (
    <div
      className="bg-background text-foreground overflow-x-clip"
      ref={containerRef}
    >
      <main className="w-full opacity-0 gsap-global-wrapper">
        {/* ── Section 1: Hero ── */}
        <section
          id="hero"
          onClick={() =>
            window.open("https://forms.gle/k9XYt89brsv3dgLUA", "_blank")
          }
          className="group relative h-screen w-full flex items-center justify-center overflow-hidden border-b border-white/10 cursor-pointer"
        >
          <div className="absolute inset-0 bg-black">
            <img
              src="https://images.unsplash.com/photo-1737644467636-6b0053476bb2?q=80&w=2144&auto=format&fit=crop"
              className="gsap-hero-bg w-full h-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-80"
              alt="Hero background"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-background" />

          <div className="relative z-10 text-center flex flex-col items-center max-w-7xl px-8">
            <div className="gsap-hero-element mb-6 inline-flex items-center gap-3 border border-primary/30 bg-primary/10 px-6 py-2 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Registrations Open · National Hackathon 2026
            </div>
            <h1 className="gsap-hero-element text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-[0.9] text-white uppercase drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              AI | Robotics | IoT
            </h1>
            <p className="gsap-hero-element text-lg md:text-2xl text-gray-300 md:max-w-3xl mb-10 font-medium tracking-wide">
              Click anywhere to secure your spot at the most advanced
              engineering event of the decade.
            </p>
            <div className="gsap-hero-element flex items-center gap-3 text-white/40 text-sm font-bold uppercase tracking-widest">
              <span>Tap to open Google Forms</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </div>
          </div>
        </section>

        {/* ── Section 2: CEO Message ── */}
        <section className="gsap-ceo-section relative min-h-screen w-full bg-background border-b border-white/10">
          <div className="w-full h-screen flex items-center justify-center">
            {ceoData.map((data, index) => (
              <div
                key={index}
                className={`gsap-ceo-panel absolute inset-0 w-full h-full flex flex-col md:flex-row bg-background ${index === 0 ? "opacity-100 z-30" : "opacity-0 z-20"}`}
              >
                {/* Left: Full Image */}
                <div className="w-full md:w-1/2 h-[45vh] md:h-full flex-shrink-0 relative overflow-hidden">
                  <img
                    src={data.img}
                    className="w-full h-full object-cover object-center"
                    alt="CEO Prabin Kumar Bogati"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-0 bg-background">
                  <p className="text-primary font-black tracking-[0.3em] text-xs uppercase mb-6">
                    {data.title}
                  </p>
                  <p className="text-white font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed italic mb-8">
                    {data.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-primary" />
                    <p className="text-gray-400 font-mono text-sm">
                      {data.author}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Our Approach (Horizontal Scroll) ── */}
        <section className="gsap-approach-section relative h-screen w-full bg-white overflow-hidden border-b border-black/10 w-auto">
          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-24 z-20 pointer-events-none mix-blend-difference">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mix-blend-difference drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
              Our Approach
            </h2>
          </div>
          <div className="gsap-approach-wrapper flex flex-nowrap h-full items-center relative z-10 w-max">
            <div className="w-[100vw] md:w-[70vw] h-full flex flex-col justify-center px-6 lg:px-24 bg-white flex-shrink-0">
              <h3 className="text-primary text-xl md:text-3xl font-bold uppercase tracking-widest mb-4">
                → Swipe Process
              </h3>
              <p className="text-2xl sm:text-4xl md:text-5xl font-medium text-black max-w-3xl leading-tight">
                We execute rigorously. Our operational pipeline guarantees
                absolute consistency.
              </p>
            </div>
            {approachData.map((phase, i) => (
              <div
                key={i}
                className="w-[82vw] md:w-[80vw] lg:w-[78vw] h-full flex items-center justify-center p-1 md:p-2 flex-shrink-0 bg-white"
              >
                <div className="w-full max-w-6xl h-[70vh] md:h-[70vh] flex flex-col justify-end relative overflow-hidden group bg-black">
                  <div className="absolute inset-0 bg-black z-0">
                    <img
                      src={phase.img}
                      className="w-full h-full object-cover opacity-60"
                      alt={phase.title}
                    />
                  </div>
                  <div className="relative z-10 p-8 md:p-12 md:w-1/2">
                    <p className="text-primary font-bold tracking-widest uppercase mb-2 md:mb-4 text-sm md:text-base">
                      {phase.phase}
                    </p>
                    <h3 className="text-3xl sm:text-5xl font-black text-white mb-4 md:mb-6 uppercase">
                      {phase.title}
                    </h3>
                    <p className="text-gray-300 font-medium text-lg md:text-2xl">
                      {phase.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Team ── */}
        <section
          id="team"
          className="relative w-full bg-background border-b border-white/10 py-24 overflow-hidden"
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 md:mb-20">
              <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">
                Our People
              </p>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
                The Architects
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl">
                Hover over our core engineering team to reveal their secondary
                identity.
              </p>
            </div>

            <div className="gsap-home-team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeTeamData.map((member, i) => (
                <div
                  key={i}
                  className="gsap-home-team-card group relative h-[520px] overflow-hidden bg-black border border-white/10 cursor-crosshair"
                >
                  {/* Primary image */}
                  <img
                    src={member.img}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 grayscale group-hover:opacity-0 transition-all duration-700 ease-in-out"
                    alt={member.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = member.imgHover;
                    }}
                  />
                  {/* Hover image */}
                  <img
                    src={member.imgHover}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-90 transition-all duration-700 ease-in-out scale-105 group-hover:scale-100"
                    alt={member.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col justify-end h-full p-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <h4 className="text-3xl font-black text-white uppercase leading-none mb-2">
                      {member.name}
                    </h4>
                    <p className="text-primary font-bold tracking-widest text-xs uppercase">
                      {member.role}
                    </p>
                  </div>
                  {/* Hover corner arrow */}
                  <div className="absolute top-6 right-6 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-end">
              <Link
                href="/team"
                className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-white font-bold uppercase tracking-widest text-sm hover:border-primary hover:text-primary transition-colors duration-300"
              >
                Meet Full Team
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Section 5: Core Services (Fade Pinned) ── */}
        <section className="gsap-service-section relative min-h-screen w-full bg-background border-b border-white/10 py-24 md:py-0 overflow-hidden">
          <div className="w-full h-full flex flex-col md:flex-row max-w-7xl mx-auto px-6 md:px-12 lg:pl-24 items-center justify-center gap-12">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">
                What We Build
              </p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                Core
                <br />
                Services
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                Scroll through our core offerings.
              </p>
            </div>
            <div className="w-full md:w-2/3 h-[55vh] md:h-[65vh] relative">
              {servicesData.map((srv, index) => (
                <div
                  key={index}
                  className={`gsap-service-panel absolute inset-0 w-full h-full border border-white/10 flex flex-col justify-end p-8 md:p-12 bg-black ${index === 0 ? "opacity-100 z-30" : "opacity-0 z-20"}`}
                >
                  <div className="absolute inset-0 z-0 bg-black">
                    <img
                      src={srv.img}
                      className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                      alt={srv.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-primary font-bold tracking-widest uppercase text-xs mb-3">
                      0{index + 1} / Service
                    </p>
                    <h3 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 uppercase leading-none">
                      {srv.title}
                    </h3>
                    <p className="text-gray-300 font-medium text-base md:text-xl max-w-2xl leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 6: Partners Marquee ── */}
        <section className="w-full bg-white py-16 md:py-24 border-b relative flex flex-col items-center justify-center overflow-hidden">
          <p className="text-black text-center font-black tracking-[0.3em] uppercase mb-3 text-xs z-20">
            Trusted By
          </p>
          <h3 className="text-black text-center font-bold text-2xl md:text-3xl mb-10 md:mb-16 z-20">
            Our Organizations & Partners
          </h3>
          <div className="flex w-full overflow-hidden">
            <div className="gsap-partners-marquee flex whitespace-nowrap items-center w-max">
              {partnersData.map((partner, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center gap-16 md:gap-28 px-8 md:px-14"
                >
                  <img
                    src="/partner/unigo.png"
                    className="h-12 md:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    alt={partner.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
