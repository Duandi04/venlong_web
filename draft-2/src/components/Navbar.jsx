'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-[100] px-16 py-10 flex justify-between items-center pointer-events-none"
    >
      <Link href="/" className="flex items-center gap-6 pointer-events-auto group">
        <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center shadow-[0_0_20px_var(--gold-glow)] group-hover:scale-110 transition-transform">
           <Hexagon style={{ color: 'var(--bg)', fill: 'var(--bg)' }} size={20} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-text uppercase italic transition-colors">
          VENLONG
        </span>
      </Link>
      
      <div className="hidden md:flex gap-16 items-center pointer-events-auto">
        {['Services', 'Work', 'Contact'].map((item) => (
          <Link key={item} href={`/${item.toLowerCase()}`} className="text-[0.7rem] uppercase tracking-[5px] text-muted hover:text-gold transition-all font-black relative group">
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
        
        <button className="w-12 h-12 rounded-full border border-glass-border flex flex-col items-center justify-center gap-1.5 cursor-none hover:bg-gold-glow transition-all group">
          <div className="w-6 h-[1px] bg-text group-hover:bg-gold transition-colors" />
          <div className="w-4 h-[1px] bg-text group-hover:bg-gold transition-colors" />
        </button>
      </div>
    </motion.nav>
  );
}
