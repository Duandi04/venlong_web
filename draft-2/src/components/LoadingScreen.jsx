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
      {/* Decorative Corners */}
      <div ref={el => decorRef.current[0] = el} className="absolute top-10 left-10 w-16 h-16 border-t border-l border-gold/30" />
      <div ref={el => decorRef.current[1] = el} className="absolute top-10 right-10 w-16 h-16 border-t border-r border-gold/30" />
      <div ref={el => decorRef.current[2] = el} className="absolute bottom-10 left-10 w-16 h-16 border-b border-l border-gold/30" />
      <div ref={el => decorRef.current[3] = el} className="absolute bottom-10 right-10 w-16 h-16 border-b border-r border-gold/30" />

      <div className="relative z-10 text-center">
        <h1 ref={textRef} className="text-7xl md:text-[8vw] font-black tracking-[-0.05em] text-white uppercase italic leading-none">
          VENLONG
          <span className="block text-[10px] tracking-[1em] text-gold font-normal italic mt-4">ESTABLISHED 2024</span>
        </h1>
      </div>
      
      <div className="absolute bottom-32 w-48 h-[2px] bg-white/5 overflow-hidden">
        <div ref={progressRef} className="absolute inset-0 bg-gold w-0" />
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]" />
      </div>
    </div>
  );
}
