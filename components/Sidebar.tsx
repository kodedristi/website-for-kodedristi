'use client';

import { motion } from 'framer-motion';

const socialLinks = [
  {
    title: 'GitHub',
    href: 'https://github.com/kodedristi',
    icon: (
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    title: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    title: 'Twitter / X',
    href: 'https://twitter.com',
    icon: (
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-14 border-r border-black/10 dark:border-white/10  dark:bg-black/20 backdrop-blur-md z-40 hidden lg:flex flex-col items-center justify-between py-10">

      {/* Top accent line */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        className="w-px h-16 bg-gradient-to-b from-primary to-transparent origin-top"
      />

      {/* Social Icons */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        {socialLinks.map((link, i) => (
          <motion.a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="
              relative flex items-center justify-center w-9 h-9 rounded-none
              
              text-black/40 dark:text-white/30
              hover:text-primary dark:hover:text-primary
              transition-colors duration-200
              group
            "
          >
            {link.icon}
            {/* Tooltip */}
            <span className="
              absolute left-full ml-3 px-2 py-1 text-xs font-bold uppercase tracking-widest
              bg-primary text-white whitespace-nowrap
              opacity-0 group-hover:opacity-100
              translate-x-2 group-hover:translate-x-0
              transition-all duration-200
              pointer-events-none z-50
            ">
              {link.title}
            </span>
          </motion.a>
        ))}
      </motion.nav>

      {/* Bottom year — rotated */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-[9px] font-black text-black/25 dark:text-white/20 uppercase tracking-[0.2em] rotate-90 select-none"
      >
        2025
      </motion.div>
    </aside>
  );
}
