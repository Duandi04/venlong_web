'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return <div className="w-16 h-16" />;

  return (
    <button 
      onClick={toggleTheme}
      className="relative w-16 h-16 rounded-full flex items-center justify-center border border-glass-border bg-glass backdrop-blur-xl pointer-events-auto group overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.1)]"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="relative z-10"
          >
            {/* Custom Imperial Moon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 3C10.1594 3 8.35607 3.5222 6.80556 4.4988C5.25505 5.4754 4.02641 6.86435 3.27431 8.4871C2.5222 10.1099 2.27823 11.9026 2.57193 13.6339C2.86562 15.3652 3.6845 16.9617 4.92132 18.2213C6.15814 19.4809 7.76307 20.3414 9.5362 20.6865C11.3093 21.0315 13.1417 20.8384 14.8015 20.131C16.4612 19.4236 17.8816 18.2319 18.8804 16.7082C19.8793 15.1844 20.4132 13.3986 20.419 11.579C20.419 11.411 19.82 11.455 19.458 11.603C15.352 13.298 10.702 11.014 9.007 6.908C8.859 6.546 8.903 5.947 9.071 5.947C7.2514 5.9528 5.46561 6.4867 3.9418 7.4855C2.418 8.4843 1.22639 9.9047 0.518973 11.5644C-0.188439 13.2241 -0.381467 15.0566 -0.0363991 16.8297C0.308668 18.6028 1.16911 20.2077 2.4287 21.4445C3.68829 22.6814 5.28479 23.5002 7.01609 23.7939C8.74739 24.0876 10.5401 23.8436 12.1629 23.0915C13.7857 22.3394 15.1746 21.1108 16.1512 19.5603C17.1278 18.0098 17.65 16.2065 17.65 14.3659L12 3Z" 
                fill="url(#gold-gradient)" 
                className="drop-shadow-[0_0_8px_var(--gold-glow)]"
              />
              <defs>
                <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--gold-light)" />
                  <stop offset="50%" stopColor="var(--gold)" />
                  <stop offset="100%" stopColor="var(--gold-alt)" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="relative z-10"
          >
            {/* Custom Imperial Sun */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" fill="var(--red)" className="drop-shadow-[0_0_10px_var(--red-glow)]" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => (
                <rect 
                  key={degree}
                  x="11.5" 
                  y="2" 
                  width="1" 
                  height="4" 
                  rx="0.5" 
                  fill="var(--red)" 
                  transform={`rotate(${degree} 12 12)`} 
                  className="opacity-60"
                />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic Background Effects */}
      <motion.div 
        className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Circuitry Borders */}
      <div className="absolute inset-2 rounded-full border border-gold/10 pointer-events-none" />
      <div className="absolute inset-[1px] rounded-full border border-red/5 scale-110 group-hover:scale-100 transition-transform duration-700 pointer-events-none" />
      
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red/30 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
      
      {/* Holographic Pulse */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
    </button>
  );
}