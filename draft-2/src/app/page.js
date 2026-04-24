'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { Plus, Volume2, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// --- Main Page ---

export default function Home() {
  const [phase, setPhase] = useState('loading');
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const heroPinRef = useRef(null);
  const venlongTextRef = useRef(null);
  const mainContentRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const services = [
    { id: 1, title: "CYBER ARCHITECTURE", zh: "赛博架构", color: "#cc0018" },
    { id: 2, title: "NEURAL RENDER", zh: "神经渲染", color: "#c8a44a" },
    { id: 3, title: "IMPERIAL BRANDING", zh: "帝国品牌", color: "#cc0018" },
    { id: 4, title: "DRAGON LOGIC", zh: "龙之逻辑", color: "#c8a44a" },
  ];

  useLayoutEffect(() => {
    if (!mounted || phase !== 'content') return;

    const split = new SplitType(venlongTextRef.current, { types: 'chars' });
    
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroPinRef.current,
          start: "top top",
          end: "+=550%",
          scrub: 1.2,
          pin: true,
        }
      });

      // Massive Typography Stagger
      tl.from(split.chars, { 
        opacity: 0, 
        y: 200, 
        stagger: 0.12, 
        duration: 3,
        filter: 'blur(60px)',
        scale: 5,
        ease: "power4.out"
      }, 0);

      // 'N' Highlight
      const nChar = split.chars[2];
      tl.to(nChar, {
        color: '#cc0018',
        textShadow: '0 0 60px #cc0018, 0 0 120px #cc0018',
        scale: 1.5,
        duration: 1.5
      }, 2);

      // Shrink to Header
      tl.to(venlongTextRef.current, {
        scale: 0.08,
        y: "-43.5vh",
        x: "-38.5vw",
        duration: 5,
        ease: "expo.inOut"
      }, 3);

      // Main Content Reveal
      tl.to(mainContentRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 3.5,
        ease: "power4.inOut"
      }, 3.5);

      // Header Appearance
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 2.5, ease: "back.out(2)" }, 6.5);

    }, containerRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [phase, mounted]);

  if (!mounted) return null;

  return (
    <main className={`main-container ${mounted ? 'mounted' : ''}`}>
      <div className="scanlines" />
      <div className="hud-grid" />
      
      {/* Hanzi HUD elements */}
      <div className="hanzi-hud">
         <span className="hanzi-item">赛博龙</span>
         <span className="hanzi-item">帝国</span>
         <span className="hanzi-item">核心</span>
      </div>

      <AnimatePresence>
        {phase === 'loading' && <LoadingScreen onComplete={() => setPhase('content')} />}
      </AnimatePresence>

      <div ref={containerRef} style={{ opacity: phase === 'content' ? 1 : 0, transition: 'opacity 1.5s ease' }}>
        
        {/* HEADER */}
        <header ref={headerRef} className="imperial-header">
          <div style={{ width: '220px' }} />
          
          <nav className="header-nav">
             <ul className="nav-list">
                {['Archives', 'Tech', 'Nexus', 'Sync'].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="nav-link">
                      {item}
                    </Link>
                  </li>
                ))}
             </ul>
          </nav>

          <div className="header-actions">
             <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)' }}>
                <Volume2 size={20} style={{ margin: 'auto' }} />
             </div>
             <button className="sync-btn">
               Sync Protocol
             </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section ref={heroPinRef} className="hero-section">
          
          <div className="hero-background">
             <div className="glow-circle glow-1" />
             <div className="glow-circle glow-2" />
          </div>

          {/* Dragon Watermark */}
          <div className="hero-dragon-wrap">
             <img src="/assets/dragon.png" alt="Cyber Dragon" />
          </div>

          <div className="typography-wrap">
             <h1 ref={venlongTextRef} className="massive-typography">
               VENLONG
             </h1>
          </div>

          <div ref={mainContentRef} className="main-reveal-content">
             <div className="cloud-texture" />
             <div className="reveal-image-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=2070&auto=format&fit=crop" 
                  alt="CNY Futuristic"
                />
                <div className="reveal-overlay" />
             </div>
             
             <div className="reveal-text-content">
                <div className="protocol-tag">
                   <div className="tag-line" />
                   <span className="tag-text">Imperial Protocol v4.0</span>
                </div>
                <h2 className="reveal-title">
                  DRAGON<br />DYNAMICS.
                </h2>
                <div className="reveal-actions">
                   <button className="btn-primary">
                     Enter The Grid
                   </button>
                   <button className="btn-secondary">
                     Archive Access
                   </button>
                </div>
                <p style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.6rem', textTransform: 'uppercase', maxWidth: '35rem', lineHeight: '2', fontWeight: 900 }}>
                  HARNESSING THE POWER OF THE IMPERIAL DRAGON TO ARCHITECT THE FUTURE OF NEURAL EXPERIENCES.
                </p>
             </div>
          </div>

          <div style={{ position: 'absolute', bottom: '6rem', left: '50%', transform: 'translateX(-50%)', zIndex: 40, opacity: 0.4, textAlign: 'center' }}>
             <div style={{ width: '1px', height: '12rem', background: 'linear-gradient(to bottom, #cc0018, transparent)', margin: '0 auto 2,5rem' }} />
             <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2rem', textTransform: 'uppercase' }}>INITIATE SEQUENCE</span>
          </div>
        </section>

        {/* ABOUT US */}
        <section id="about" style={{ padding: '40rem 8rem', background: '#050505', position: 'relative' }}>
           <div style={{ maxWidth: '140rem', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20rem', alignItems: 'center' }}>
              <motion.div 
                initial={{ opacity: 0, x: -150 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                 <span style={{ color: '#cc0018', fontWeight: 900, letterSpacing: '2.5rem', textTransform: 'uppercase', fontSize: '0.9rem', display: 'block', marginBottom: '4rem' }}>01 — THE DRAGON'S LEGACY</span>
                 <h2 style={{ fontSize: '12rem', fontWeight: 900, lineHeight: 0.7, marginBottom: '5rem', letterSpacing: '-0.06em', fontStyle: 'italic', textTransform: 'uppercase', color: 'white' }}>
                   BORN OF<br /><span className="text-stroke">ETERNITY.</span>
                 </h2>
                 <p style={{ fontSize: '3rem', color: '#777', fontWeight: 300, lineHeight: 1.6, marginBottom: '6rem', maxWidth: '45rem' }}>
                   Integrating millennium-old Chinese heritage with neural architecture. We build digital monoliths that breathe life into tradition.
                 </p>
                 <div style={{ marginBottom: '8rem' }}>
                    {['2024 Dragon Protocol', '150+ Neural Shrines Built', 'Imperial Grade Security'].map(stat => (
                      <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '2.5rem' }}>
                         <Plus size={20} style={{ color: '#cc0018' }} />
                         <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1rem', color: '#444' }}>{stat}</span>
                      </div>
                    ))}
                 </div>
                 <button className="btn-secondary" style={{ padding: '1.5rem 6rem', border: '1px solid #cc001866', color: '#cc0018' }}>
                    Access Codex
                 </button>
              </motion.div>
              
              <div style={{ position: 'relative' }}>
                 <div style={{ aspectRatio: '4/5', background: '#080808', borderRadius: '6rem', overflow: 'hidden', border: '1px solid rgba(204,0,24,0.1)', boxShadow: '0 0 150px rgba(204,0,24,0.15)' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1512418490979-92798ccc13b0?q=80&w=2070&auto=format&fit=crop" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'grayscale(0.5) contrast(1.2)' }}
                      alt="Dragon Aesthetic"
                    />
                    <div style={{ position: 'absolute', bottom: '5rem', left: '5rem' }}>
                       <h4 style={{ fontSize: '7rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1, color: 'white', marginBottom: '1.5rem' }}>IMPERIAL-01</h4>
                       <p style={{ color: '#cc0018', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2rem', textTransform: 'uppercase' }}>SHRINE 2024</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="services-section">
           <div className="services-title-wrap">
              <h2 style={{ fontSize: '18rem', fontWeight: 900, letterSpacing: '-0.06em', fontStyle: 'italic', textTransform: 'uppercase', color: 'white' }} className="text-stroke">ARSENAL.</h2>
              <p style={{ color: '#cc0018', fontSize: '6rem', letterSpacing: '4rem', textTransform: 'uppercase', marginTop: '-6rem', opacity: 0.4, fontFamily: 'var(--font-zh)' }}>核心实力</p>
           </div>

           <div className="spinner-container">
              <div className="spinner-wheel">
                 {services.map((s, i) => (
                   <div 
                     key={s.id} 
                     className="service-card"
                     style={{ 
                        transform: `rotateY(${i * 90}deg) translateZ(650px)`, 
                     }}
                   >
                      <div style={{ position: 'absolute', top: '4rem', left: '4rem' }}>
                         <span style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1.2rem', textTransform: 'uppercase', color: s.color, opacity: 0.6 }}>{s.zh}</span>
                      </div>
                      <h3 style={{ fontSize: '5rem', fontWeight: 900, fontStyle: 'italic', marginBottom: '2.5rem', textTransform: 'uppercase', color: 'white' }}>{s.title}</h3>
                      <div style={{ width: '6rem', height: '6rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s ease' }}>
                         <ArrowUpRight size={36} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" style={{ padding: '40rem 10rem', background: 'black', textAlign: 'center', position: 'relative' }}>
           <div className="cloud-texture" style={{ opacity: 0.05 }} />
           <span style={{ color: '#cc0018', fontWeight: 900, letterSpacing: '3rem', textTransform: 'uppercase', fontSize: '0.9rem', display: 'block', marginBottom: '5rem' }}>ESTABLISH_LINK_SYNC</span>
           <h2 style={{ fontSize: '22rem', fontWeight: 900, lineHeight: 0.6, fontStyle: 'italic', letterSpacing: '-0.08em', marginBottom: '6rem', textTransform: 'uppercase', color: 'white' }}>BEYOND<br />LEGEND.</h2>
           <Link 
             href="mailto:hello@venlong.studio" 
             style={{ fontSize: '6rem', fontWeight: 100, borderBottom: '2px solid rgba(204,0,24,0.2)', paddingBottom: '3rem', display: 'inline-block', textDecoration: 'none', color: 'inherit', fontStyle: 'italic', transition: 'all 0.8s ease' }}
           >
              hello@venlong.studio
           </Link>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', marginTop: '12rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2rem', textTransform: 'uppercase', color: '#333' }}>
              {['Instagram', 'Twitter', 'LinkedIn', 'Behance'].map(s => (
                <a key={s} href="#" style={{ textDecoration: 'none', color: 'inherit' }}>{s}</a>
              ))}
           </div>
           
           <div style={{ marginTop: '40rem', paddingTop: '5rem', borderTop: '1px solid rgba(204,0,24,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1.2rem', color: '#222' }}>
              <p>© 2024 VENLONG_CYBER_STUDIO_V4.0</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                 <p style={{ color: '#cc0018', opacity: 0.4 }}>IMPERIAL_SYNC</p>
                 <p style={{ fontSize: '3rem', fontFamily: 'var(--font-zh)', opacity: 0.15 }}>赛博龙 / 文龙</p>
              </div>
           </div>
        </footer>

      </div>
    </main>
  );
}
