'use client';

import Link from 'next/link';





export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10">
      {/* Top CTA strip */}
      <div className="border-b border-white/10 py-12 md:py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
        <div>
          <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-2">Ready to Build?</p>
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Let's architect your<br />digital future.
          </h3>
        </div>
        <Link href="/contact" className="group inline-flex items-center gap-3 bg-primary text-white font-black uppercase tracking-widest text-sm px-10 py-5 hover:bg-white hover:text-black transition-colors duration-300 flex-shrink-0">
          Start a Project
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>

      

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-xs font-medium">© 2025 Kodedristi Software. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
            <Link key={t} href="#" className="text-gray-600 hover:text-white text-xs font-medium transition-colors duration-200">{t}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
