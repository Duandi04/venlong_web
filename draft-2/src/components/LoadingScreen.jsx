'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const decorRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: onComplete
        });
      }
    });

    tl.set(decorRef.current, { scale: 0, opacity: 0 })
    .to(decorRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: 'back.out(1.7)'
    })
    .fromTo(textRef.current, 
      { opacity: 0, scale: 1.2, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out' },
      "-=0.4"
    )
    .to(progressRef.current, {
      width: '100%',
      duration: 1.8,
      ease: 'power2.inOut'
    })
    .to(textRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power4.in'
    });

  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative Corners - Technical Lattice */}
      <div ref={el => decorRef.current[0] = el} className="absolute top-12 left-12 w-24 h-24 border-t-2 border-l-2 border-gold/40">
         <div className="absolute top-0 left-0 w-2 h-2 bg-red shadow-[0_0_15px_var(--red)]" />
      </div>
      <div ref={el => decorRef.current[1] = el} className="absolute top-12 right-12 w-24 h-24 border-t-2 border-r-2 border-gold/40">
         <div className="absolute top-0 right-0 w-2 h-2 bg-red shadow-[0_0_15px_var(--red)]" />
      </div>
      <div ref={el => decorRef.current[2] = el} className="absolute bottom-12 left-12 w-24 h-24 border-b-2 border-l-2 border-gold/40">
         <div className="absolute bottom-0 left-0 w-2 h-2 bg-red shadow-[0_0_15px_var(--red)]" />
      </div>
      <div ref={el => decorRef.current[3] = el} className="absolute bottom-12 right-12 w-24 h-24 border-b-2 border-r-2 border-gold/40">
         <div className="absolute bottom-0 right-0 w-2 h-2 bg-red shadow-[0_0_15px_var(--red)]" />
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-8 overflow-hidden">
           <p className="text-[0.6rem] tracking-[1rem] text-red font-mono animate-pulse">SYSTEM_BOOT: IMPERIAL_DRAGON_PROTOCOL_INIT</p>
        </div>
        <h1 ref={textRef} className="text-7xl md:text-[9vw] font-black tracking-[-0.07em] text-white uppercase italic leading-none">
          VENLONG
          <span className="block text-[12px] tracking-[1.5em] text-gold font-normal italic mt-8 opacity-60">NEURAL_SHRINE_ARCHITECT</span>
        </h1>
      </div>
      
      <div className="absolute bottom-32 flex flex-col items-center gap-4">
        <div className="w-64 h-[2px] bg-white/5 overflow-hidden relative">
          <div ref={progressRef} className="absolute inset-0 bg-red w-0 shadow-[0_0_20px_var(--red)]" />
        </div>
        <div className="flex gap-4">
           {['SHRINE', 'DRAGON', 'NEXUS'].map(tag => (
             <span key={tag} className="text-[0.5rem] tracking-[0.3rem] text-white/20 font-black">{tag}</span>
           ))}
        </div>
      </div>

    </div>
  );
}
