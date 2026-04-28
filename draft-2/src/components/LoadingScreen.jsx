'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const progressTextRef = useRef(null);
  const charsRef = useRef([]);
  const scanRef = useRef(null);
  const zhRef = useRef(null);
  const taglineRef = useRef(null);
  const ornamentsRef = useRef([]);
  const particlesRef = useRef([]);
  const [mounted, setMounted] = useState(false);

  // 1. Initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Animation logic after DOM is ready
  useLayoutEffect(() => {
    if (!mounted) return;

    // Check if refs are truly available
    if (!scanRef.current || !containerRef.current) return;

    // Main Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 1.2,
          ease: 'expo.inOut',
          onComplete: onComplete
        });
      }
    });

    // ── Initial states ──
    gsap.set(charsRef.current, { y: 140, opacity: 0 });
    gsap.set(zhRef.current, { opacity: 0, x: -30 });
    gsap.set(taglineRef.current, { opacity: 0, y: 20 });
    gsap.set(scanRef.current, { top: '-5%' });
    gsap.set(ornamentsRef.current, { scale: 0, opacity: 0 });
    gsap.set(particlesRef.current, { opacity: 0, y: 0 });

    // ── Continuous Scan Line Loop ──
    const scanAnimation = gsap.to(scanRef.current, {
      top: '105%',
      duration: 2.2,
      repeat: -1,
      ease: 'power1.inOut'
    });

    // 1. Corner ornaments snap in
    tl.to(ornamentsRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(2)'
    });

    // 2. Golden particles float up
    tl.to(particlesRef.current, {
      opacity: 0.6,
      y: -60,
      duration: 2.5,
      stagger: 0.05,
      ease: 'power2.out'
    }, '-=0.4');

    // 3. Subtitles
    tl.to(zhRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=1.5');

    // 4. Logo letters
    tl.to(charsRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.08,
      ease: 'expo.out'
    }, '-=1.2');

    // 5. Tagline
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5');

    // 6. Progress and Counter
    let prog = { val: 0 };
    tl.to(progressRef.current, {
      width: '100%',
      duration: 3,
      ease: 'power4.inOut'
    }, '-=0.8');

    tl.to(prog, {
      val: 100,
      duration: 3,
      ease: 'power4.inOut',
      onUpdate: () => {
        if (progressTextRef.current)
          progressTextRef.current.textContent = `${Math.round(prog.val)}%`;
      }
    }, '<');

    // 7. Final Polish
    tl.to(charsRef.current, {
      color: 'var(--gold)',
      textShadow: '0 0 40px var(--gold-glow)',
      stagger: 0.05,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=1.2');

    tl.to({}, { duration: 0.8 });

    return () => {
      tl.kill();
      scanAnimation.kill();
    };
  }, [mounted, onComplete]);

  if (!mounted) return null;

  const chars = 'VENLONG'.split('');
  const particles = Array.from({ length: 20 });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transition: 'background-color 0.8s ease'
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 0%, var(--bg) 100%)',
        pointerEvents: 'none', zIndex: 1
      }} />

      <div className="hud-grid" style={{ opacity: 0.05, zIndex: 1 }} />

      {/* SCANNER LINE */}
      <div
        ref={scanRef}
        style={{
          position: 'absolute', left: 0, right: 0,
          top: '-5%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, var(--gold) 50%, transparent)',
          boxShadow: '0 0 50px 15px var(--gold-glow)',
          opacity: 0.5,
          pointerEvents: 'none', zIndex: 30
        }}
      />

      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
        {particles.map((_, i) => (
          <div
            key={i}
            ref={el => particlesRef.current[i] = el}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              bottom: `-10%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: '50%',
              background: i % 2 === 0 ? 'var(--gold)' : 'var(--red)',
              boxShadow: `0 0 10px ${i % 2 === 0 ? 'var(--gold-glow)' : 'var(--red-glow)'}`,
            }}
          />
        ))}
      </div>

      {/* Corner Ornaments */}
      {[
        { t: 0, l: 0, b: 'top', s: 'left' },
        { t: 0, r: 0, b: 'top', s: 'right' },
        { b: 0, l: 0, b_pos: 'bottom', s: 'left' },
        { b: 0, r: 0, b_pos: 'bottom', s: 'right' },
      ].map((pos, i) => (
        <div
          key={i}
          ref={el => ornamentsRef.current[i] = el}
          style={{
            position: 'absolute',
            top: pos.t === 0 ? '4rem' : 'auto',
            bottom: pos.b_pos === 'bottom' ? '4rem' : 'auto',
            left: pos.l === 0 ? '4rem' : 'auto',
            right: pos.r === 0 ? '4rem' : 'auto',
            width: '6rem', height: '6rem',
            borderTop: pos.b === 'top' ? '1px solid var(--glass-border)' : 'none',
            borderBottom: pos.b_pos === 'bottom' ? '1px solid var(--glass-border)' : 'none',
            borderLeft: pos.s === 'left' ? '1px solid var(--glass-border)' : 'none',
            borderRight: pos.s === 'right' ? '1px solid var(--glass-border)' : 'none',
            zIndex: 10
          }}
        >
          <div style={{
            position: 'absolute',
            top: pos.b === 'top' ? '-4px' : 'auto',
            bottom: pos.b_pos === 'bottom' ? '-4px' : 'auto',
            left: pos.s === 'left' ? '-4px' : 'auto',
            right: pos.s === 'right' ? '-4px' : 'auto',
            width: '8px', height: '8px',
            background: 'var(--red)',
            boxShadow: '0 0 15px var(--red-glow)',
            borderRadius: '1px'
          }} />
        </div>
      ))}

      {/* Center Display */}
      <div style={{ position: 'relative', zIndex: 20, textAlign: 'center' }}>
        <div style={{
          position: 'absolute', top: '-10rem', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          letterSpacing: '0.6rem', color: 'var(--red)',
          textShadow: '0 0 10px var(--red-glow)', opacity: 0.6,
          textTransform: 'uppercase', whiteSpace: 'nowrap'
        }}>
          ESTABLISHING_IMPERIAL_SYNC_V4.0
        </div>

        <div ref={zhRef} style={{
          fontFamily: 'var(--font-zh)',
          fontSize: '1.2rem', letterSpacing: '1.2rem',
          color: 'var(--gold)',
          marginBottom: '3rem',
          opacity: 0.8,
          textShadow: '0 0 25px var(--gold-glow)'
        }}>
          赛博龙工业协议
        </div>

        <div style={{ overflow: 'hidden', display: 'flex', gap: '0.2rem', justifyContent: 'center' }}>
          {chars.map((ch, i) => (
            <span
              key={i}
              ref={el => charsRef.current[i] = el}
              style={{
                display: 'inline-block',
                fontSize: 'clamp(4rem, 15vw, 15rem)',
                fontWeight: 900,
                fontStyle: 'italic',
                color: 'var(--text)',
                lineHeight: 0.8,
                letterSpacing: '-0.04em',
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        <div ref={taglineRef} style={{
          marginTop: '3.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.7em',
          color: 'var(--muted)',
          textTransform: 'uppercase',
          opacity: 0.5
        }}>
          NEURAL · ARCHITECTURE · REFINED
        </div>
      </div>

      {/* Progress Section */}
      <div style={{
        position: 'absolute', bottom: '6rem',
        width: 'min(45rem, 85vw)',
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
              letterSpacing: '0.4em', color: 'var(--muted)', opacity: 0.6
            }}>
              INITIALIZING_NEURAL_GRID
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.45rem',
              letterSpacing: '0.2rem', color: 'var(--red)', opacity: 0.4
            }}>
              DATASET.SYNC(PROTO_DRAGON)
            </span>
          </div>
          <span
            ref={progressTextRef}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '1rem',
              fontWeight: 900, color: 'var(--gold)'
            }}
          >
            0%
          </span>
        </div>

        <div style={{
          width: '100%', height: '1px',
          background: 'var(--glass-border)',
          position: 'relative'
        }}>
          <div
            ref={progressRef}
            style={{
              position: 'absolute', left: 0, top: '-1px', bottom: '-1px',
              width: '0%',
              background: 'var(--gold)',
              boxShadow: '0 0 25px var(--gold-glow)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.3 }}>
          {['PROTOCOL', 'AUTHENTICATION', 'STABILIZATION'].map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
              letterSpacing: '0.4em', color: 'var(--text)',
              textTransform: 'uppercase'
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
