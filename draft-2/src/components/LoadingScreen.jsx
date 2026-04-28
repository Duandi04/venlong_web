'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const progressTextRef = useRef(null);
  const charsRef = useRef([]);
  const scanRef = useRef(null);
  const zhRef = useRef(null);
  const taglineRef = useRef(null);
  const ornamentsRef = useRef([]);
  const particlesRef = useRef([]);

  useEffect(() => {
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
    tl.set(charsRef.current, { y: 140, opacity: 0 })
      .set(zhRef.current, { opacity: 0, x: -30 })
      .set(taglineRef.current, { opacity: 0, y: 20 })
      .set(scanRef.current, { top: '-2px' })
      .set(ornamentsRef.current, { scale: 0, opacity: 0 })
      .set(particlesRef.current, { opacity: 0, y: 0 });

    // 1. Corner ornaments snap in
    tl.to(ornamentsRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(3)'
    });

    // 2. Scan line sweeps down
    tl.to(scanRef.current, {
      top: '100%',
      duration: 1.2,
      ease: 'none'
    }, '-=0.2');

    // 3. Golden particles float up
    tl.to(particlesRef.current, {
      opacity: 0.6,
      y: -20,
      duration: 2,
      stagger: 0.07,
      ease: 'power2.out'
    }, '-=1');

    // 4. Chinese subtitle slides in
    tl.to(zhRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=1.5');

    // 5. VENLONG letters fly up one by one
    tl.to(charsRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.08,
      ease: 'expo.out'
    }, '-=0.6');

    // 6. Tagline fades in
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3');

    // 7. Progress bar fills
    tl.to(progressRef.current, {
      width: '100%',
      duration: 2.2,
      ease: 'power3.inOut'
    }, '-=0.5');

    // 8. Progress counter counts up
    let prog = { val: 0 };
    tl.to(prog, {
      val: 100,
      duration: 2.2,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (progressTextRef.current)
          progressTextRef.current.textContent = `${Math.round(prog.val)}%`;
      }
    }, '<');

    // 9. Logo turns Imperial Gold
    tl.to(charsRef.current, {
      color: '#c8a44a',
      textShadow: '0 0 60px rgba(200,164,74,0.6)',
      stagger: 0.04,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=0.8');

    // 10. Hold 0.5 s then exit
    tl.to({}, { duration: 0.5 });

  }, [onComplete]);

  const chars = 'VENLONG'.split('');
  const particles = Array.from({ length: 18 });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#070002',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* ── Deep red vignette ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, #1a0005 0%, #070002 70%)',
        pointerEvents: 'none'
      }} />

      {/* ── Scan-line ── */}
      <div
        ref={scanRef}
        style={{
          position: 'absolute', left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #c8a44a 40%, #cc0018 60%, transparent)',
          boxShadow: '0 0 30px 6px rgba(200,164,74,0.3)',
          pointerEvents: 'none', zIndex: 20
        }}
      />

      {/* ── Floating gold particles ── */}
      {particles.map((_, i) => (
        <div
          key={i}
          ref={el => particlesRef.current[i] = el}
          style={{
            position: 'absolute',
            left: `${5 + i * 5.5}%`,
            bottom: `${10 + (i % 5) * 12}%`,
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#c8a44a' : '#cc0018',
            boxShadow: `0 0 8px ${i % 2 === 0 ? '#c8a44a' : '#cc0018'}`,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* ── Corner ornaments ── */}
      {[
        { top: '3rem', left: '3rem', bt: 'top', bl: 'left' },
        { top: '3rem', right: '3rem', bt: 'top', bl: 'right' },
        { bottom: '3rem', left: '3rem', bt: 'bottom', bl: 'left' },
        { bottom: '3rem', right: '3rem', bt: 'bottom', bl: 'right' },
      ].map((pos, i) => (
        <div
          key={i}
          ref={el => ornamentsRef.current[i] = el}
          style={{
            position: 'absolute', ...pos,
            width: '5rem', height: '5rem',
            borderTop: pos.bt === 'top' ? '1px solid rgba(200,164,74,0.4)' : 'none',
            borderBottom: pos.bt === 'bottom' ? '1px solid rgba(200,164,74,0.4)' : 'none',
            borderLeft: pos.bl === 'left' ? '1px solid rgba(200,164,74,0.4)' : 'none',
            borderRight: pos.bl === 'right' ? '1px solid rgba(200,164,74,0.4)' : 'none',
          }}
        >
          <div style={{
            position: 'absolute',
            top: pos.bt === 'top' ? '-3px' : undefined,
            bottom: pos.bt === 'bottom' ? '-3px' : undefined,
            left: pos.bl === 'left' ? '-3px' : undefined,
            right: pos.bl === 'right' ? '-3px' : undefined,
            width: '6px', height: '6px',
            background: '#cc0018',
            boxShadow: '0 0 12px #cc0018'
          }} />
        </div>
      ))}

      {/* ── Boot label ── */}
      <div style={{
        position: 'absolute', top: '3.5rem', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'monospace', fontSize: '0.55rem',
        letterSpacing: '0.4em', color: '#cc0018',
        textShadow: '0 0 8px #cc0018', opacity: 0.8,
        textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        IMPERIAL_BOOT_SEQUENCE :: VL-2024
      </div>

      {/* ── Chinese subtitle ── */}
      <div ref={zhRef} style={{
        fontFamily: '"Noto Serif SC", serif',
        fontSize: '1.1rem', letterSpacing: '1rem',
        color: 'rgba(200,164,74,0.6)',
        marginBottom: '2.5rem',
        textShadow: '0 0 20px rgba(200,164,74,0.3)'
      }}>
        帝国龙族数字工坊
      </div>

      {/* ── VENLONG main logo ── */}
      <div style={{ overflow: 'hidden', display: 'flex', gap: '0.1rem' }}>
        {chars.map((ch, i) => (
          <span
            key={i}
            ref={el => charsRef.current[i] = el}
            style={{
              display: 'inline-block',
              fontSize: 'clamp(5rem, 14vw, 14rem)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* ── Tagline ── */}
      <div ref={taglineRef} style={{
        marginTop: '2.5rem',
        fontFamily: 'monospace',
        fontSize: '0.65rem',
        letterSpacing: '0.5em',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase'
      }}>
        DRAGON · DYNAMICS · DIGITAL
      </div>

      {/* ── Progress bar ── */}
      <div style={{
        position: 'absolute', bottom: '5rem',
        width: 'min(40rem, 80vw)',
        display: 'flex', flexDirection: 'column', gap: '1.2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'monospace', fontSize: '0.55rem',
            letterSpacing: '0.35em', color: 'rgba(200,164,74,0.5)'
          }}>
            LOADING NEURAL GRID
          </span>
          <span
            ref={progressTextRef}
            style={{
              fontFamily: 'monospace', fontSize: '0.7rem',
              fontWeight: 900, color: '#c8a44a'
            }}
          >
            0%
          </span>
        </div>

        <div style={{
          width: '100%', height: '2px',
          background: 'rgba(255,255,255,0.05)',
          position: 'relative', overflow: 'visible'
        }}>
          <div
            ref={progressRef}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: '0%',
              background: 'linear-gradient(90deg, #cc0018, #c8a44a)',
              boxShadow: '0 0 20px rgba(200,164,74,0.6), 0 0 8px rgba(204,0,24,0.4)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['LEGACY', 'NEURAL', 'IMPERIAL'].map(t => (
            <span key={t} style={{
              fontFamily: 'monospace', fontSize: '0.5rem',
              letterSpacing: '0.3em', color: 'rgba(255,255,255,0.15)',
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
