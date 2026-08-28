'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    // { href: '/portfolio', label: 'Portfolio' },
    { href: '/team', label: 'Team' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className="fixed w-full z-[999] bg-black/90 backdrop-blur-xl flex justify-between items-center px-6 md:px-12 py-3 border-b border-white/10">
        <Link href="/" className="text-2xl font-extrabold text-primary tracking-tight">
          <img src="/white_logo.png" className="h-10 md:h-12 object-contain" alt="Logo" />
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-95 transition-transform duration-200"
        >
          <span className="text-primary text-xl">☰</span>
        </button>
      </nav>

      {/* Side Navigation Overlay */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: menuOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[450px] md:w-[500px] lg:w-[400px] z-[1001] bg-primary dark:bg-primary shadow-2xl flex flex-col p-8 md:p-12 space-y-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white font-bold text-2xl">Navigation</h2>
            <p className="text-white/60 text-sm">Kodedristi Software</p>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white/60 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col space-y-6 pt-12">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: 20, opacity: 0 }}
              animate={menuOpen ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08, ease: 'easeOut' }}
            >
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white transition-all text-3xl font-bold flex items-center space-x-4"
              >
                {item.label}
              </Link>

            </motion.div>
          ))}

        </nav>

        <div className="mt-auto pt-12">      <Link href="/contact" onClick={() => setMenuOpen(false)}>
          <button className="w-full bg-white text-primary py-4 rounded-full font-bold text-lg hover:scale-95 transition-transform duration-200">
            Get Started
          </button>
        </Link>
        </div>
      </motion.div>

      {/* Overlay Backdrop */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-[1000] bg-black/50"
        />
      )}
    </>
  );
}
