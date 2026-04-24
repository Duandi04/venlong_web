'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ArrowUpRight, Globe, Cpu, Zap, Camera, Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Lenis from 'lenis';

const SERVICES = [
  { id: 'web', title: 'Web Architecture', subtitle: 'Digital Foundation', zh: '网站架构', description: 'Engineering high-performance digital foundations with pixel-perfect precision and absolute technical clarity.', icon: <Globe size={48} /> },
  { id: '3d', title: 'Spatial Reality', subtitle: '3D Environments', zh: '三维渲染', description: 'Merging the boundary between digital and physical with high-fidelity immersive storytelling.', icon: <Zap size={48} /> },
  { id: 'brand', title: 'Visual Legacy', subtitle: 'Brand Identity', zh: '品牌形象', description: 'Defining legendary visual identities that resonate across modern global cultures.', icon: <Briefcase size={48} /> },
  { id: 'motion', title: 'Dynamic Motion', subtitle: 'Cinematics', zh: '动效设计', description: 'Evoking powerful emotion through world-class motion design and cinematic editing.', icon: <Camera size={48} /> },
  { id: 'ai', title: 'Intelligent Systems', subtitle: 'AI Strategy', zh: '智能策略', description: 'Integrating next-generation artificial intelligence into modern digital ecosystems.', icon: <Cpu size={48} /> },
];

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      gsap.to(dotRef.current, { x, y, duration: 0.1, ease: 'none' });
      gsap.to(ringRef.current, { x, y, duration: 0.25, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} className="fixed w-2 h-2 bg-gold rounded-full pointer-events-none z-[10000] translate-x-[-50%] translate-y-[-50%]" />
      <div id="cursor-ring" ref={ringRef} className="fixed w-10 h-10 border border-gold/50 rounded-full pointer-events-none z-[9999] translate-x-[-50%] translate-y-[-50%]" />
    </>
  );
};

export default function ServicesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const wheelRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const rotateTo = (index) => {
    if (isRotating) return;
    setIsRotating(true);
    
    const rotation = -index * (360 / SERVICES.length);
    
    gsap.to(wheelRef.current, {
      rotation: rotation,
      duration: 1.5,
      ease: 'power3.inOut',
      onComplete: () => {
        setActiveIndex(index);
        setIsRotating(false);
      }
    });
  };

  const next = () => rotateTo((activeIndex + 1) % SERVICES.length);
  const prev = () => rotateTo((activeIndex - 1 + SERVICES.length) % SERVICES.length);

  return (
    <main className="min-h-screen bg-[#050505] text-[#f8f4f0] overflow-hidden flex flex-col relative selection:bg-gold selection:text-black">
      <CustomCursor />
      <div className="scanlines" />
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[#080808] z-0" />
      <div className="absolute inset-0 opacity-10 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(200,164,74,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <nav className="p-12 px-16 flex justify-between items-center relative z-50">
        <Link href="/" className="text-4xl font-black tracking-[-0.05em] text-white">VENLONG</Link>
        <Link href="/" className="group flex items-center gap-6 text-[10px] uppercase tracking-[6px] text-muted hover:text-gold transition-all font-black">
          <div className="w-12 h-px bg-white/10 group-hover:bg-gold group-hover:w-20 transition-all" />
          EXIT ARCHIVE
        </Link>
      </nav>

      <div className="flex-1 relative flex items-center">
        {/* Massive 3D Wheel Container */}
        <div className="absolute left-[-20vw] lg:left-[-10vw] top-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[1200px] max-h-[1200px] pointer-events-none lg:pointer-events-auto">
          {/* Decorative Technical Rings */}
          <div className="absolute inset-[-5%] border border-gold/5 rounded-full animate-spin-slow opacity-20" />
          <div className="absolute inset-[-10%] border border-white/5 rounded-full animate-spin-reverse-slow opacity-10" />
          
          <div 
            ref={wheelRef}
            className="w-full h-full border border-gold/10 rounded-full relative transition-transform duration-1000"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {SERVICES.map((service, i) => {
              const angle = (i * (360 / SERVICES.length));
              const isActive = activeIndex === i;
              return (
                <div 
                  key={service.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center cursor-pointer group"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translate(40vw) rotate(-${angle}deg)`
                  }}
                  onClick={() => rotateTo(i)}
                >
                  <div className={`transition-all duration-700 flex flex-col items-center gap-4 ${isActive ? 'text-gold scale-125 drop-shadow-[0_0_30px_rgba(200,164,74,0.5)]' : 'text-white/10 group-hover:text-white/30'}`}>
                    {service.icon}
                    <span className={`text-[10px] font-black tracking-[4px] uppercase ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`}>0{i+1}</span>
                  </div>
                  {isActive && (
                    <div className="absolute inset-[-30px] border border-gold/30 rounded-full animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Dynamic Content Section */}
        <div className="container mx-auto px-16 grid lg:grid-cols-2 pointer-events-none">
          <div className="lg:col-start-2 z-10 relative pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50, skewX: -5 }}
                animate={{ opacity: 1, x: 0, skewX: 0 }}
                exit={{ opacity: 0, x: -50, skewX: 5 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-8 mb-12">
                   <p className="text-red font-black tracking-[10px] uppercase text-[10px] flex items-center gap-4">
                      <span className="w-10 h-px bg-red" /> SERVICE — 0{activeIndex + 1}
                   </p>
                   <span className="text-gold font-serif-zh text-xl tracking-[10px] uppercase opacity-40">{SERVICES[activeIndex].zh}</span>
                </div>
                
                <h1 className="text-[clamp(4rem,10vw,8rem)] font-black mb-14 leading-[0.85] text-white uppercase tracking-tighter">
                  {SERVICES[activeIndex].title.split(' ').map((word, i) => (
                    <motion.span 
                      key={i} 
                      className="block overflow-hidden"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
                
                <p className="text-2xl text-muted mb-20 max-w-lg leading-relaxed font-light italic">
                  "{SERVICES[activeIndex].description}"
                </p>
                
                <Link 
                  href={`/contact?service=${SERVICES[activeIndex].id}`}
                  className="px-16 py-6 glass-gold text-gold font-black uppercase text-[10px] tracking-[6px] hover:bg-gold hover:text-black transition-all duration-700 inline-flex items-center gap-6 group"
                >
                  <span>INITIATE PROJECT</span>
                  <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex gap-16 mt-24">
              <button 
                onClick={prev}
                className="group flex items-center gap-6 text-[10px] uppercase tracking-[6px] text-muted font-black hover:text-gold transition-all"
              >
                <div className="w-16 h-px bg-white/5 group-hover:bg-gold group-hover:w-24 transition-all" />
                PREV
              </button>
              <button 
                onClick={next}
                className="group flex items-center gap-6 text-[10px] uppercase tracking-[6px] text-muted font-black hover:text-gold transition-all"
              >
                NEXT
                <div className="w-16 h-px bg-white/5 group-hover:bg-gold group-hover:w-24 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-16 right-16 opacity-5 pointer-events-none">
        <h2 className="text-[12vw] font-black leading-none uppercase text-white tracking-tighter">IMPERIAL</h2>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 50s linear infinite;
        }
      `}</style>
    </main>
  );
}
