'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-full flex items-center justify-center border border-glass-border bg-glass backdrop-blur-md pointer-events-auto group overflow-hidden transition-all hover:scale-110 active:scale-95"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Moon size={20} className="text-gold" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sun size={20} className="text-red" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Imperial Decor */}
      <div className="absolute inset-0 rounded-full border border-red/0 group-hover:border-red/20 transition-all duration-700 scale-110 group-hover:scale-100" />
      <div className="absolute inset-[1px] rounded-full border border-gold/0 group-hover:border-gold/10 transition-all duration-1000 delay-100 scale-90 group-hover:scale-100" />
      
      {/* Tech Accent Corner */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-red/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
