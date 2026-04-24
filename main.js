import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

/* ─── 1. THEME ─────────────────────────────────────────────── */
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('vl-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('vl-theme', next);
});

/* ─── 2. LENIS ──────────────────────────────────────────────── */
const lenis = new Lenis({ duration: 1.5, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ─── 3. CURSOR ─────────────────────────────────────────────── */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: .08, ease: 'none' });
});
(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

/* ─── 4. PARTICLES ──────────────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resizeCanvas() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const isDark = () => html.getAttribute('data-theme') === 'dark';
class Particle {
  constructor() { this.reset(true); }
  reset(init=false) {
    this.x = Math.random()*W; this.y = init ? Math.random()*H : H+10;
    this.size = Math.random()*2.5+.5; this.speedY = -(Math.random()*.5+.2);
    this.speedX = (Math.random()-.5)*.3; this.alpha = Math.random()*.5+.1;
    this.flicker = Math.random()*Math.PI*2;
  }
  update() { this.y+=this.speedY; this.x+=this.speedX; this.flicker+=.02; if(this.y<-10) this.reset(); }
  draw() {
    const a = this.alpha*(.7+.3*Math.sin(this.flicker));
    ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle = isDark() ? `rgba(200,164,74,${a})` : `rgba(156,122,42,${a})`;
    ctx.fill();
  }
}
for(let i=0;i<80;i++) particles.push(new Particle());
(function draw() { ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(draw); })();

/* ─── 5. NAVBAR ─────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
lenis.on('scroll', ({ scroll }) => navbar.classList.toggle('stuck', scroll > 60));
document.querySelectorAll('.nav-links button').forEach(btn => {
  btn.addEventListener('click', () => {
    const el = document.getElementById(btn.dataset.target);
    if (el) lenis.scrollTo(el, { offset: -80, duration: 1.6 });
  });
});
const tlMenu = gsap.timeline({ paused: true });
tlMenu.fromTo('.mobile-link', { y:'120%', rotateZ:5, opacity:0 }, { y:'0%', rotateZ:0, opacity:1, duration:0.6, stagger:0.1, ease:'power3.out' });
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  const isOpen = hamburger.classList.contains('open');
  mobileMenu.classList.toggle('open', isOpen);
  lenis[isOpen ? 'stop' : 'start']();
  if (isOpen) tlMenu.restart();
});
mobileClose.addEventListener('click', () => { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); lenis.start(); });
document.querySelectorAll('.mobile-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const el = document.getElementById(btn.dataset.target);
    hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); lenis.start();
    setTimeout(() => { if(el) lenis.scrollTo(el, { offset:-80, duration:1.6 }); }, 200);
  });
});

/* ─── 6. HERO ───────────────────────────────────────────────── */
const heroImgLayer = document.getElementById('hero-img-layer');
const heroTextLayer = document.getElementById('hero-text-layer');
const heroTitle = document.getElementById('hero-title');
const heroScrollHint = document.getElementById('hero-scroll-hint');
const heroTl = gsap.timeline({ scrollTrigger: { trigger:'#hero', start:'top top', end:'bottom bottom', scrub:2 }});
heroTl
  .to(heroImgLayer, { scale:1.1, ease:'none' }, 0)
  .to(heroImgLayer, { opacity:0, scale:.88, ease:'none' }, 0.28)
  .fromTo(heroTextLayer, { opacity:0, scale:1.25 }, { opacity:1, scale:1, ease:'none' }, 0.42)
  .to(heroScrollHint, { opacity:0, ease:'none' }, 0.45)
  .to(heroTextLayer, { yPercent:-16, opacity:0, ease:'none' }, 0.82);

const titleChars = heroTitle.textContent.split('');
heroTitle.innerHTML = titleChars.map(c => `<span class="char" style="display:inline-block">${c}</span>`).join('');
gsap.from('.char', { duration:1.2, opacity:0, y:60, rotateX:-40, stagger:.06, delay:.3, ease:'power4.out' });
gsap.from('#hero-tagline, #hero-tagline-zh', { duration:1.4, opacity:0, y:20, stagger:.15, delay:1.2, ease:'power3.out' });

/* ─── 7. REVEALS ────────────────────────────────────────────── */
document.querySelectorAll('[data-reveal]').forEach(el => {
  const type = el.dataset.reveal;
  const delay = parseFloat(el.dataset.delay||0)*0.14;
  const from = type==='slide-in' ? {x:-50,opacity:0} : {y:55,opacity:0};
  const to = type==='slide-in' ? {x:0,opacity:1,duration:.9,ease:'power3.out',delay} : {y:0,opacity:1,duration:.9,ease:'power3.out',delay};
  gsap.fromTo(el, from, { ...to, scrollTrigger:{trigger:el,start:'top 88%',once:true} });
});

/* ─── 8. CARDS STAGGER ──────────────────────────────────────── */
gsap.fromTo('.card', {y:70,opacity:0,scale:.96}, { y:0,opacity:1,scale:1,stagger:0.1,duration:0.9,ease:'power3.out', scrollTrigger:{trigger:'.cards',start:'top 82%',once:true} });

/* ─── 9. COUNTERS ───────────────────────────────────────────── */
document.querySelectorAll('.stat-num[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  ScrollTrigger.create({ trigger:el, start:'top 85%', once:true, onEnter:() => {
    gsap.to({val:0}, { val:target, duration:1.6, ease:'power2.out', onUpdate() { el.textContent = Math.round(this.targets()[0].val); } });
  }});
});

/* ─── 10. MAGNETIC CONTACT BTNS ────────────────────────────── */
document.querySelectorAll('.contact-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    gsap.to(btn, { x:(e.clientX-r.left-r.width/2)*0.2, y:(e.clientY-r.top-r.height/2)*0.2, duration:.45, ease:'power2.out' });
  });
  btn.addEventListener('mouseleave', () => gsap.to(btn, { x:0, y:0, duration:.7, ease:'elastic.out(1,0.4)' }));
});

/* ─── 11. PARALLAX HEADINGS ─────────────────────────────────── */
document.querySelectorAll('.section-heading').forEach(el => {
  gsap.to(el, { yPercent:-8, ease:'none', scrollTrigger:{ trigger:el.closest('.section'), start:'top bottom', end:'bottom top', scrub:1.5 }});
});

/* ─── 12. SWIPER ────────────────────────────────────────────── */
new Swiper('.projects-swiper', {
  modules:[Navigation,Pagination,A11y],
  slidesPerView:1.15, spaceBetween:20, loop:false,
  pagination:{el:'.projects-pagination',clickable:true},
  navigation:{prevEl:'.projects-prev',nextEl:'.projects-next'},
  breakpoints:{ 640:{slidesPerView:1.6,spaceBetween:22}, 900:{slidesPerView:2.2,spaceBetween:24}, 1200:{slidesPerView:2.6,spaceBetween:26} },
  on:{ touchMove(){lenis.stop();}, touchEnd(){lenis.start();} }
});

/* ─── 13. HOVER GLOW ────────────────────────────────────────── */
document.querySelectorAll('.card, .ps-inner').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((e.clientY-r.top)/r.height*100).toFixed(1)}%`);
  });
});

/* ─── 14. PAGE LOAD ─────────────────────────────────────────── */
gsap.timeline()
  .from('#navbar', { y:-60, opacity:0, duration:.9, ease:'power3.out' })
  .from('.deco-left, .deco-right', { opacity:0, duration:1 }, '-=.4');

/* ─── 15. 3D TILT (project cards) ──────────────────────────── */
document.querySelectorAll('.ps-inner').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const xN = (e.clientX-rect.left)/rect.width-0.5;
    const yN = (e.clientY-rect.top)/rect.height-0.5;
    gsap.to(el, { rotateX:yN*-8, rotateY:xN*8, duration:0.5, ease:'power2.out', transformPerspective:1200 });
  });
  el.addEventListener('mouseleave', () => gsap.to(el, { rotateX:0, rotateY:0, duration:1.2, ease:'elastic.out(1,0.4)' }));
});

/* ══════════════════════════════════════════════════════════════
   16. ANGPAO — Click-triggered GSAP timeline
══════════════════════════════════════════════════════════════ */
const angpao = document.querySelector('.about-angpao');
const envTopWrap = angpao?.querySelector('.env-top-wrap');
const envPaper = angpao?.querySelector('.env-paper');
const angpaoDetails = angpao?.querySelector('.angpao-details');
const envSeal = angpao?.querySelector('.env-seal');

if (angpao && envTopWrap && envPaper) {
  // Set initial state via GSAP (not CSS transforms)
  gsap.set(envTopWrap, { rotateX: 0, transformOrigin: 'top center', transformPerspective: 900 });
  gsap.set(envPaper, { y: '100%' });
  gsap.set(angpaoDetails, { opacity: 0, y: 8 });

  const angpaoTl = gsap.timeline({ paused: true });
  angpaoTl
    .to(envSeal, { opacity: 0, y: -10, scale: 0.7, duration: 0.3, ease: 'power2.in' }, 0)
    .to(envTopWrap, { rotateX: -175, duration: 1.1, ease: 'power2.inOut' }, 0.05)
    .to(envPaper, { y: '-35%', duration: 1.0, ease: 'power3.out' }, 0.4)
    .to(angpaoDetails, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.0);

  let isOpen = false;
  angpao.addEventListener('click', () => {
    isOpen = !isOpen;
    angpao.classList.toggle('open', isOpen);
    if (isOpen) {
      angpaoTl.timeScale(1).play();
    } else {
      angpaoTl.timeScale(1.5).reverse();
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   17. SERVICE PANEL DATA + LOGIC
══════════════════════════════════════════════════════════════ */
const servicesData = {
  'web-dev': {
    num: '01', zh: '网站开发', icon: '网',
    title: 'Web Development',
    body: 'We engineer high-performance web applications with pixel-perfect precision — from lightning-fast landing pages to complex full-stack platforms.',
    features: ['Next.js, React & Vanilla JS', 'Performance-first architecture', 'SEO & Core Web Vitals optimised', 'API integrations & backend systems', 'Mobile-responsive by default']
  },
  'ui-ux': {
    num: '02', zh: '界面设计', icon: '界',
    title: 'UI / UX Design',
    body: 'Interfaces sculpted for beauty and clarity. Every pixel is intentional — from information architecture to micro-interaction choreography.',
    features: ['Figma design systems', 'Interaction & motion design', 'User research & wireframing', 'Accessibility-first approach', 'Design-to-code handoff']
  },
  'brand': {
    num: '03', zh: '品牌形象', icon: '牌',
    title: 'Brand Identity',
    body: 'A legendary brand begins with a story. We craft visual identities that distil your essence into logos, palettes, and typographic systems that endure.',
    features: ['Logo design & mark systems', 'Colour & typography strategy', 'Brand guidelines documentation', 'Print & digital collateral', 'Brand voice & tone']
  },
  'motion': {
    num: '04', zh: '动效三维', icon: '动',
    title: 'Motion & 3D',
    body: 'Bring your digital world to life. From scroll-driven narratives to immersive WebGL environments — we make your audience stop and stare.',
    features: ['GSAP & Lenis animations', 'Three.js / WebGL scenes', 'Scroll-triggered storytelling', 'Cinematic page transitions', 'Interactive 3D models']
  }
};

const servicePanel = document.getElementById('service-panel');
const spClose = document.getElementById('sp-close');

function openServicePanel(id) {
  const data = servicesData[id]; if(!data) return;
  // Populate
  document.getElementById('sp-num-label').textContent = data.num;
  document.getElementById('sp-zh-label').textContent = data.zh;
  document.getElementById('sp-icon').textContent = data.icon;
  document.getElementById('sp-title').textContent = data.title;
  document.getElementById('sp-body').textContent = data.body;
  document.getElementById('sp-num-bg').textContent = data.num;
  const featsEl = document.getElementById('sp-features');
  featsEl.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

  // Show panel
  servicePanel.style.visibility = 'visible';
  servicePanel.style.pointerEvents = 'all';
  lenis.stop();

  const items = featsEl.querySelectorAll('li');
  const tl = gsap.timeline();
  tl.fromTo(servicePanel, { clipPath:'circle(0% at 50% 50%)' }, { clipPath:'circle(150% at 50% 50%)', duration:0.8, ease:'power3.inOut' })
    .fromTo('.sp-close-btn', { opacity:0 }, { opacity:1, duration:0.4 }, 0.5)
    .fromTo('.sp-deco-circle', { opacity:0, scale:0.5 }, { opacity:1, scale:1, duration:1.2, stagger:0.15, ease:'power3.out' }, 0.3)
    .fromTo('.sp-deco-ring', { opacity:0, scale:0.6 }, { opacity:0.4, scale:1, duration:1.0, ease:'power3.out' }, 0.4)
    .fromTo('#sp-num-bg', { opacity:0, y:40 }, { opacity:0.07, y:0, duration:1.0, ease:'power3.out' }, 0.3)
    .fromTo('.sp-visual', { opacity:0, scale:0.7 }, { opacity:1, scale:1, duration:0.9, ease:'back.out(1.4)' }, 0.4)
    .fromTo('.sp-eyebrow', { opacity:0, y:20 }, { opacity:1, y:0, duration:0.5, ease:'power3.out' }, 0.45)
    .fromTo('#sp-title', { opacity:0, y:30 }, { opacity:1, y:0, duration:0.7, ease:'power3.out' }, 0.55)
    .fromTo('#sp-body', { opacity:0, y:20 }, { opacity:1, y:0, duration:0.6, ease:'power3.out' }, 0.65)
    .fromTo(items, { opacity:0, x:-25 }, { opacity:1, x:0, duration:0.5, stagger:0.08, ease:'power3.out' }, 0.75)
    .fromTo('.sp-cta', { opacity:0, y:10 }, { opacity:1, y:0, duration:0.5, ease:'power3.out' }, 1.0);
}

function closeServicePanel() {
  gsap.to(servicePanel, {
    clipPath:'circle(0% at 50% 50%)', duration:0.6, ease:'power3.inOut',
    onComplete:() => { servicePanel.style.visibility='hidden'; servicePanel.style.pointerEvents='none'; lenis.start(); }
  });
}

document.querySelectorAll('.card[data-id]').forEach(card => {
  card.addEventListener('click', () => openServicePanel(card.dataset.id));
});
spClose?.addEventListener('click', closeServicePanel);
document.getElementById('sp-cta-btn')?.addEventListener('click', () => {
  closeServicePanel();
  setTimeout(() => { const el=document.getElementById('contact'); if(el) lenis.scrollTo(el,{offset:-80,duration:1.6}); }, 400);
});

/* ══════════════════════════════════════════════════════════════
   18. PROJECT PANEL DATA + LOGIC
══════════════════════════════════════════════════════════════ */
const projectsData = {
  'crimson-portal': {
    num: '01', zh: '红色门户', tags: ['IMLEK','LIVE EVENT'],
    title: 'Crimson Portal',
    desc: 'A Lunar New Year event platform built for real-time audience engagement. Features live countdown, interactive lantern animations, and a ticket management system handling thousands of concurrent users.',
    col1: { heading: 'TECH STACK', body: 'React, Node.js, Socket.io, GSAP, Framer Motion' },
    col2: { heading: 'TIMELINE', body: '8 weeks — Launched Imlek 2024' },
    gallery: [
      { label: 'Hero Section', grad: 'linear-gradient(135deg,#c8000f,#3a0005)', wide: true },
      { label: 'Live Dashboard', grad: 'linear-gradient(135deg,#8a0008,#2a0004)' },
      { label: 'Mobile View', grad: 'linear-gradient(135deg,#cc0018,#7a0010)' },
    ]
  },
  'aura-ui': {
    num: '02', zh: '灵光界面', tags: ['UI','DESIGN SYSTEM'],
    title: 'Aura UI Kit',
    desc: 'A premium component library with 200+ components built for modern web applications. Features a token-based design system, dark/light mode, and full Figma-to-code documentation.',
    col1: { heading: 'TECH STACK', body: 'React, TypeScript, Storybook, CSS Variables' },
    col2: { heading: 'TIMELINE', body: '12 weeks — Ongoing' },
    gallery: [
      { label: 'Component Library', grad: 'linear-gradient(135deg,#c8a44a,#3a2800)', wide: true },
      { label: 'Dark Mode', grad: 'linear-gradient(135deg,#1a1a2e,#16213e)' },
      { label: 'Design Tokens', grad: 'linear-gradient(135deg,#0d0d1a,#1a0a2e)' },
    ]
  },
  'goldrush': {
    num: '03', zh: '黄金仪表', tags: ['FINTECH','DATA VIZ'],
    title: 'GoldRush Dashboard',
    desc: 'A high-frequency finance dashboard with animated data visualisations, live market feeds, and portfolio management tools. Processes over 50k data points per second.',
    col1: { heading: 'TECH STACK', body: 'Vue 3, D3.js, WebSocket, Pinia, Vite' },
    col2: { heading: 'TIMELINE', body: '16 weeks — Live in production' },
    gallery: [
      { label: 'Market Overview', grad: 'linear-gradient(135deg,#00704a,#003d2a)', wide: true },
      { label: 'Portfolio Chart', grad: 'linear-gradient(135deg,#004d33,#001a11)' },
      { label: 'Trade History', grad: 'linear-gradient(135deg,#ccaa00,#3a2f00)' },
    ]
  },
  'neoncity': {
    num: '04', zh: '霓虹都市', tags: ['THREE.JS','WEBGL'],
    title: 'NeonCity 3D',
    desc: 'A WebGL-powered city explorer with procedurally generated neon environments. Scroll-driven narrative guides users through a cinematic urban story with dynamic lighting and particle systems.',
    col1: { heading: 'TECH STACK', body: 'Three.js, GLSL shaders, GSAP, WebGL 2.0' },
    col2: { heading: 'TIMELINE', body: '10 weeks — Award nominated' },
    gallery: [
      { label: 'City Overview', grad: 'linear-gradient(135deg,#1a0033,#0d0066)', wide: true },
      { label: 'Neon District', grad: 'linear-gradient(135deg,#33006b,#000033)' },
      { label: 'Night Skyline', grad: 'linear-gradient(135deg,#000022,#1a004d)' },
    ]
  }
};

const projectPanel = document.getElementById('project-panel');
const ppClose = document.getElementById('pp-close');
const ppSidebarClose = document.getElementById('pp-sidebar-close');

function openProjectPanel(id) {
  const data = projectsData[id]; if(!data) return;
  document.getElementById('pp-sidebar-num').textContent = data.num;
  document.getElementById('pp-sidebar-zh').textContent = data.zh;
  document.getElementById('pp-sidebar-tags').innerHTML = data.tags.map(t=>`<span>${t}</span>`).join('');
  document.getElementById('pp-title').textContent = data.title;
  document.getElementById('pp-desc').textContent = data.desc;
  document.getElementById('pp-detail-col-1').innerHTML = `<h4>${data.col1.heading}</h4><p>${data.col1.body}</p>`;
  document.getElementById('pp-detail-col-2').innerHTML = `<h4>${data.col2.heading}</h4><p>${data.col2.body}</p>`;

  const gallery = document.getElementById('pp-gallery');
  gallery.innerHTML = data.gallery.map(g =>
    `<div class="pp-gallery-item${g.wide?' pp-gallery-item--wide':''}">
      <div class="pp-gallery-bg" style="background:${g.grad}"></div>
      <span class="pp-gallery-label">${g.label}</span>
    </div>`
  ).join('');

  projectPanel.style.visibility = 'visible';
  projectPanel.style.pointerEvents = 'all';
  lenis.stop();

  const sidebarItems = document.querySelectorAll('.pp-sidebar-num, .pp-sidebar-zh');
  const tagSpans = document.querySelectorAll('.pp-sidebar-tags span');
  const galleryItems = gallery.querySelectorAll('.pp-gallery-item');

  const tl = gsap.timeline();
  tl.fromTo(projectPanel, { y:'100%' }, { y:'0%', duration:0.9, ease:'expo.out' })
    .fromTo('.pp-close-btn', { opacity:0 }, { opacity:1, duration:0.4 }, 0.5)
    .fromTo('.pp-progress-bar', { width:'0%' }, { width:'100%', duration:0.8, ease:'power2.out' }, 0.4)
    .fromTo(sidebarItems, { opacity:0, x:-30 }, { opacity:1, x:0, duration:0.6, stagger:0.1, ease:'power3.out' }, 0.4)
    .fromTo(tagSpans, { opacity:0, x:-20 }, { opacity:1, x:0, duration:0.4, stagger:0.07, ease:'power3.out' }, 0.6)
    .fromTo('.pp-sidebar-close', { opacity:0 }, { opacity:1, duration:0.4 }, 0.9)
    .fromTo('.pp-header', { opacity:0, y:30 }, { opacity:1, y:0, duration:0.7, ease:'power3.out' }, 0.45)
    .fromTo('.pp-gallery', { opacity:0, y:20 }, { opacity:1, y:0, duration:0.6, ease:'power3.out' }, 0.6)
    .fromTo(galleryItems, { scale:0.88, opacity:0 }, { scale:1, opacity:1, duration:0.6, stagger:0.1, ease:'back.out(1.2)' }, 0.65)
    .fromTo('.pp-detail-info', { opacity:0, y:20 }, { opacity:1, y:0, duration:0.5, ease:'power3.out' }, 0.85);
}

function closeProjectPanel() {
  gsap.to(projectPanel, {
    y:'100%', duration:0.7, ease:'power3.inOut',
    onComplete:() => { projectPanel.style.visibility='hidden'; projectPanel.style.pointerEvents='none'; lenis.start(); }
  });
}

document.querySelectorAll('.ps-inner[data-id]').forEach(card => {
  card.addEventListener('click', () => openProjectPanel(card.dataset.id));
});
ppClose?.addEventListener('click', closeProjectPanel);
ppSidebarClose?.addEventListener('click', closeProjectPanel);

// ESC closes any open panel
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (projectPanel?.style.visibility === 'visible') closeProjectPanel();
    if (servicePanel?.style.visibility === 'visible') closeServicePanel();
  }
});
