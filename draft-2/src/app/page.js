'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { Plus, Volume2, ArrowUpRight, Globe, Zap, Camera, Briefcase, Cpu, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SplitType from 'split-type';
import ThemeToggle from '@/components/ThemeToggle';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Box, Torus, Octahedron, Icosahedron } from '@react-three/drei';


gsap.registerPlugin(ScrollTrigger);

// --- Components ---

const ServiceVisual = ({ activeIndex, color }) => {
  const shapes = [
    <Sphere args={[1, 64, 64]}><MeshDistortMaterial color={color} speed={3} distort={0.4} roughness={0.1} metalness={0.8} /></Sphere>,
    <Box args={[1.5, 1.5, 1.5]}><MeshWobbleMaterial color={color} factor={1} speed={2} roughness={0.1} metalness={0.8} /></Box>,
    <Torus args={[1, 0.4, 16, 100]}><MeshDistortMaterial color={color} speed={2} distort={0.3} roughness={0.1} metalness={0.8} /></Torus>,
    <Octahedron args={[1.5]}><MeshWobbleMaterial color={color} factor={0.5} speed={3} roughness={0.1} metalness={0.8} /></Octahedron>,
    <Icosahedron args={[1.5, 0]}><MeshDistortMaterial color={color} speed={4} distort={0.25} roughness={0.1} metalness={0.8} /></Icosahedron>
  ];

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
      {shapes[activeIndex] || shapes[0]}
    </Float>
  );
};

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
      <div ref={dotRef} style={{ position: 'fixed', width: '0.8rem', height: '0.8rem', backgroundColor: 'var(--red)', borderRadius: '50%', pointerEvents: 'none', zIndex: 100000, transform: 'translate(-50%, -50%)', boxShadow: '0 0 15px var(--red)' }} />
      <div ref={ringRef} style={{ position: 'fixed', width: '4rem', height: '4rem', border: '1px solid var(--red)', opacity: 0.3, borderRadius: '50%', pointerEvents: 'none', zIndex: 99999, transform: 'translate(-50%, -50%)' }} />
    </>
  );
};

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

  const [activeService, setActiveService] = useState(0);
  const servicesRef = useRef(null);
  const wheelRef = useRef(null);

  const services = [
    { 
      id: 'web', 
      title: 'Web & Apps Development', 
      zh: '网页与应用开发', 
      description: 'Architecting ultra-responsive web and mobile applications with cutting-edge frameworks.', 
      icon: <Globe size={48} />,
      color: '#cc0018' 
    },
    { 
      id: '3d', 
      title: '3D Modeling & Rendering', 
      zh: '三维建模渲染', 
      description: 'Creating immersive 3D environments that bridge digital imagination and reality.', 
      icon: <Zap size={48} />,
      color: '#c8a44a' 
    },
    { 
      id: 'video', 
      title: 'Cinematic Video Editing', 
      zh: '影视後期制作', 
      description: 'Crafting powerful visual stories through professional color grading and motion graphics.', 
      icon: <Camera size={48} />,
      color: '#00ccff' 
    },
    { 
      id: 'design', 
      title: 'Design & Photoshop', 
      zh: '平面设计与后期', 
      description: 'Fusing traditional aesthetics with futuristic design principles to build iconic brands.', 
      icon: <Briefcase size={48} />,
      color: '#ff00ff' 
    },
    { 
      id: 'social', 
      title: 'Social Media Strategy', 
      zh: '社交媒体策略', 
      description: 'Harnessing social logic and interactive content to scale your digital presence.', 
      icon: <Cpu size={48} />,
      color: '#00ff88' 
    },
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

      // Services Scroll Logic
      const servicesTl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const index = Math.min(
              services.length - 1,
              Math.floor(self.progress * services.length)
            );
            setActiveService(prev => prev !== index ? index : prev);
          }
        }
      });

      servicesTl.to(wheelRef.current, {
        rotation: -360 * (services.length - 1) / services.length,
        ease: "none"
      });

    }, containerRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [phase, mounted]);

  if (!mounted) return null;

  return (
    <main className={`main-container ${mounted ? 'mounted' : ''}`}>
      <CustomCursor />
      <div className="hud-grid" />

      
      {/* Hanzi HUD elements */}
      <div className="hanzi-hud">
         <span className="hanzi-item">赛博龙</span>
         <span className="hanzi-item">帝国</span>
         <span className="hanzi-item">核心</span>
         <span className="hanzi-item" style={{ marginTop: '5rem', color: 'var(--gold)' }}>恭喜发财</span>
      </div>


      <AnimatePresence>
        {phase === 'loading' && <LoadingScreen onComplete={() => setPhase('content')} />}
      </AnimatePresence>

      <div ref={containerRef} style={{ opacity: phase === 'content' ? 1 : 0, transition: 'opacity 1.5s ease', pointerEvents: phase === 'content' ? 'auto' : 'none' }}>
        
        {/* HEADER */}
        <header ref={headerRef} className="imperial-header">
          <div style={{ width: '220px' }} />
          
          <nav className="header-nav">
             <ul className="nav-list">
                {['Services', 'Archives', 'Tech', 'Sync'].map((item) => (
                  <li key={item}>
                    <Link href={item === 'Services' ? '#services' : `#${item.toLowerCase()}`} className="nav-link">
                      {item}
                    </Link>
                  </li>
                ))}
             </ul>
          </nav>

          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
             <ThemeToggle />
             <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass)' }}>
                <Volume2 size={20} className="text-muted" style={{ margin: 'auto' }} />
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
             <img src="/assets/dragon-new.png" alt="Cyber Dragon" />
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
        <section id="about" style={{ padding: '40rem 8rem', background: 'var(--bg)', position: 'relative' }}>
           <div style={{ maxWidth: '140rem', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20rem', alignItems: 'center' }}>
              <motion.div 
                initial={{ opacity: 0, x: -150 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                 <span style={{ color: 'var(--red)', fontWeight: 900, letterSpacing: '2.5rem', textTransform: 'uppercase', fontSize: '0.9rem', display: 'block', marginBottom: '4rem' }}>01 — THE DRAGON'S LEGACY</span>
                 <h2 style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 0.7, marginBottom: '5rem', letterSpacing: '-0.06em', fontStyle: 'italic', textTransform: 'uppercase', color: 'var(--text)' }}>
                   BORN OF<br /><span className="text-stroke">ETERNITY.</span>
                 </h2>

                 <p style={{ fontSize: '3rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6, marginBottom: '6rem', maxWidth: '45rem' }}>
                    Integrating millennium-old Chinese heritage with neural architecture. We build digital monoliths that breathe life into tradition.
                 </p>

                 <div style={{ marginBottom: '8rem' }}>
                    {['2024 Dragon Protocol', '150+ Neural Shrines Built', 'Imperial Grade Security'].map(stat => (
                      <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '2.5rem' }}>
                         <Plus size={20} style={{ color: 'var(--red)' }} />
                         <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1rem', color: 'var(--text)', opacity: 0.5 }}>{stat}</span>
                      </div>
                    ))}
                 </div>
                 <button className="btn-secondary" style={{ padding: '1.5rem 6rem', border: '1px solid var(--red)', color: 'var(--red)', opacity: 0.6 }}>
                    Access Codex
                 </button>
              </motion.div>
              
              <div style={{ position: 'relative' }}>
                 <div style={{ aspectRatio: '4/5', background: 'var(--glass)', borderRadius: '6rem', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 0 150px var(--red-glow)' }}>
                    {/* Chinese Lattice Pattern Overlay */}
                    <div style={{ position: 'absolute', inset: '2rem', border: '1px solid var(--red)', opacity: 0.1, zIndex: 1, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: '3rem', border: '1px solid var(--red)', opacity: 0.05, zIndex: 1, pointerEvents: 'none' }} />
                    
                    <img 
                      src="/assets/shrine.png" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, filter: 'contrast(1.2)' }}
                      alt="Dragon Aesthetic"
                    />

                    <div style={{ position: 'absolute', bottom: '5rem', left: '5rem' }}>
                       <h4 style={{ fontSize: '7rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1, color: 'var(--text)', marginBottom: '1.5rem' }}>IMPERIAL-01</h4>
                       <p style={{ color: 'var(--red)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2rem', textTransform: 'uppercase' }}>SHRINE 2024</p>
                    </div>
                 </div>
              </div>
            </div>
         </section>

        {/* SERVICES SECTION */}
        <section id="services" ref={servicesRef} className="services-section-v2">
           <div className="services-content-grid">
              <div className="services-info-panel">
                <AnimatePresence mode="wait">
                    <motion.div
                      key={activeService}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                    <span style={{ color: services[activeService].color, fontWeight: 900, letterSpacing: '1.5rem', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '2rem' }}>
                      {services[activeService].zh}
                    </span>
                    <h2 style={{ fontSize: '7rem', fontWeight: 900, lineHeight: 0.8, marginBottom: '4rem', letterSpacing: '-0.05em', textTransform: 'uppercase', color: 'var(--text)' }}>
                      {services[activeService].title.replace(' & ', ' &\n')}
                    </h2>
                    <p style={{ fontSize: '2.5rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.5, marginBottom: '6rem', maxWidth: '50rem' }}>
                      {services[activeService].description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '4rem' }}>
                       <button className="btn-secondary" style={{ borderColor: services[activeService].color, color: services[activeService].color }}>
                         Initiate Project
                       </button>
                       <div className="manual-nav">
                          <button 
                            onClick={() => {
                              const prevIndex = (activeService - 1 + services.length) % services.length;
                              const sectionTop = servicesRef.current.offsetTop;
                              const sectionHeight = window.innerHeight * 3;
                              window.scrollTo({
                                top: sectionTop + (prevIndex / services.length) * sectionHeight + 50,
                                behavior: 'smooth'
                              });
                            }}
                            className="nav-btn-circle"
                          >
                             <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={() => {
                              const nextIndex = (activeService + 1) % services.length;
                              const sectionTop = servicesRef.current.offsetTop;
                              const sectionHeight = window.innerHeight * 3;
                              window.scrollTo({
                                top: sectionTop + (nextIndex / services.length) * sectionHeight + 50,
                                behavior: 'smooth'
                              });
                            }}
                            className="nav-btn-circle"
                          >
                             <ChevronRight size={20} />
                          </button>
                          <button className="nav-btn-circle gear-rotate">
                             <Settings size={20} />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="services-wheel-panel">
                 <div className="wheel-container">
                    <div className="canvas-nexus">
                       <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                          <ambientLight intensity={0.5} />
                          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                          <pointLight position={[-10, -10, -10]} />
                          <ServiceVisual activeIndex={activeService} color={services[activeService].color} />
                       </Canvas>
                    </div>

                    <div ref={wheelRef} className="wheel-inner">
                       {services.map((s, i) => {
                         const angle = (i * (360 / services.length));
                         const isActive = activeService === i;
                         return (
                           <div 
                             key={s.id}
                             className={`wheel-item ${isActive ? 'active' : ''}`}
                             style={{
                               transform: `rotate(${angle}deg) translate(35rem) rotate(-${angle}deg)`,
                               '--accent-color': s.color
                             }}
                             onClick={() => setActiveService(i)}
                           >
                             <div className="item-icon">{s.icon}</div>
                             <span className="item-number">0{i+1}</span>
                           </div>
                         )
                       })}
                    </div>
                 </div>
              </div>
           </div>

           {/* Large Watermark */}
           <div className="services-watermark">
              SERVICES
           </div>
        </section>

        <footer id="contact" style={{ padding: '40rem 10rem', background: 'var(--bg)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
           <div className="cloud-texture" style={{ opacity: 0.05 }} />
           
           {/* Fortune Watermark */}
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80rem', height: '80rem', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
              <img src="/assets/fortune.png" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(1)' }} />
           </div>

           <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ color: 'var(--red)', fontWeight: 900, letterSpacing: '3rem', textTransform: 'uppercase', fontSize: '0.9rem', display: 'block', marginBottom: '5rem' }}>ESTABLISH_LINK_SYNC</span>
              <h2 style={{ fontSize: '22rem', fontWeight: 900, lineHeight: 0.6, fontStyle: 'italic', letterSpacing: '-0.08em', marginBottom: '6rem', textTransform: 'uppercase', color: 'var(--text)' }}>BEYOND<br />LEGEND.</h2>

              <Link 
                href="mailto:hello@venlong.studio" 
                style={{ fontSize: '6rem', fontWeight: 100, borderBottom: '2px solid rgba(204,0,24,0.2)', paddingBottom: '3rem', display: 'inline-block', textDecoration: 'none', color: 'inherit', fontStyle: 'italic', transition: 'all 0.8s ease' }}
              >
                 hello@venlong.studio
              </Link>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', marginTop: '12rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2rem', textTransform: 'uppercase', color: 'var(--muted)' }}>
                 {['Instagram', 'Twitter', 'LinkedIn', 'Behance'].map(s => (
                   <a key={s} href="#" style={{ textDecoration: 'none', color: 'inherit' }}>{s}</a>
                 ))}
              </div>
              
              <div style={{ marginTop: '40rem', paddingTop: '5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1.2rem', color: 'var(--muted)' }}>
                 <p>© 2024 VENLONG_CYBER_STUDIO_V4.0</p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <p style={{ color: 'var(--red)', opacity: 0.4 }}>IMPERIAL_SYNC</p>
                    <p style={{ fontSize: '3rem', fontFamily: 'var(--font-zh)', opacity: 0.15, color: 'var(--text)' }}>赛博龙 / 文龙</p>
                 </div>
              </div>
           </div>
        </footer>

      </div>
    </main>
  );
}
