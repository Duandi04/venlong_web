/* ============================================================
   VENLONG — main.js  v2
   Stack: Lenis · GSAP + ScrollTrigger · Swiper
============================================================ */
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   1. THEME TOGGLE (light / dark)
───────────────────────────────────────────────────────────── */
const html        = document.documentElement;
const themeBtn    = document.getElementById('theme-toggle');
const savedTheme  = localStorage.getItem('vl-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('vl-theme', next);
});

/* ─────────────────────────────────────────────────────────────
   2. LENIS — smooth scroll
───────────────────────────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.5,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  lerp: 0.08,
});
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ─────────────────────────────────────────────────────────────
   3. CUSTOM CURSOR
───────────────────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: .08, ease: 'none' });
});

// Ring follows with lag
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Click burst
window.addEventListener('click', e => {
  gsap.fromTo(cursorDot,
    { width:'8px', height:'8px' },
    { width:'20px', height:'20px', duration:.15, yoyo:true, repeat:1, ease:'power2.out' }
  );
});

/* ─────────────────────────────────────────────────────────────
   4. PARTICLE CANVAS — floating gold particles
───────────────────────────────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const isDark = () => html.getAttribute('data-theme') === 'dark';

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x    = Math.random() * W;
    this.y    = init ? Math.random() * H : H + 10;
    this.size = Math.random() * 2.5 + .5;
    this.speedY = -(Math.random() * .5 + .2);
    this.speedX = (Math.random() - .5) * .3;
    this.alpha  = Math.random() * .5 + .1;
    this.flicker= Math.random() * Math.PI * 2;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.flicker += .02;
    if (this.y < -10) this.reset();
  }
  draw() {
    const alpha = this.alpha * (.7 + .3 * Math.sin(this.flicker));
    const color = isDark()
      ? `rgba(200,164,74,${alpha})`
      : `rgba(156,122,42,${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ─────────────────────────────────────────────────────────────
   5. NAVBAR — scroll state & mobile menu
───────────────────────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const hamburger= document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose= document.getElementById('mobile-close');

lenis.on('scroll', ({ scroll }) => {
  navbar.classList.toggle('stuck', scroll > 60);
});

// Desktop nav scroll
document.querySelectorAll('.nav-links button').forEach(btn => {
  btn.addEventListener('click', () => {
    const el = document.getElementById(btn.dataset.target);
    if (el) lenis.scrollTo(el, { offset: -80, duration: 1.6 });
  });
});

// Mobile menu GSAP timeline
const tlMenu = gsap.timeline({ paused: true });
tlMenu.fromTo('.mobile-link', 
  { y: '120%', rotateZ: 5, opacity: 0 }, 
  { y: '0%', rotateZ: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
);

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  const isOpen = hamburger.classList.contains('open');
  mobileMenu.classList.toggle('open', isOpen);
  lenis[isOpen ? 'stop' : 'start']();
  if (isOpen) tlMenu.restart();
});

mobileClose.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  lenis.start();
});

document.querySelectorAll('.mobile-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const el = document.getElementById(btn.dataset.target);
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    lenis.start();
    setTimeout(() => { if (el) lenis.scrollTo(el, { offset:-80, duration:1.6 }); }, 200);
  });
});


/* ─────────────────────────────────────────────────────────────
   6. HERO — cinematic scrub
───────────────────────────────────────────────────────────── */
const heroImgLayer  = document.getElementById('hero-img-layer');
const heroTextLayer = document.getElementById('hero-text-layer');
const heroTitle     = document.getElementById('hero-title');
const heroScrollHint= document.getElementById('hero-scroll-hint');

const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2,
  }
});

heroTl
  .to(heroImgLayer,   { scale: 1.1, ease: 'none' }, 0)
  .to(heroImgLayer,   { opacity: 0, scale: .88, ease: 'none' }, 0.28)
  .fromTo(heroTextLayer,
    { opacity: 0, scale: 1.25 },
    { opacity: 1, scale: 1, ease: 'none' }, 0.42)
  .to(heroScrollHint, { opacity: 0, ease: 'none' }, 0.45)
  .to(heroTextLayer,  { yPercent: -16, opacity: 0, ease: 'none' }, 0.82);

// Initial title entrance
const titleChars = heroTitle.textContent.split('');
heroTitle.innerHTML = titleChars.map(c =>
  `<span class="char" style="display:inline-block">${c}</span>`
).join('');

gsap.from('.char', {
  duration: 1.2,
  opacity: 0,
  y: 60,
  rotateX: -40,
  stagger: .06,
  delay: .3,
  ease: 'power4.out',
});

gsap.from('#hero-tagline, #hero-tagline-zh', {
  duration: 1.4,
  opacity: 0,
  y: 20,
  stagger: .15,
  delay: 1.2,
  ease: 'power3.out',
});

/* ─────────────────────────────────────────────────────────────
   7. SECTION REVEALS
───────────────────────────────────────────────────────────── */
document.querySelectorAll('[data-reveal]').forEach(el => {
  const type  = el.dataset.reveal;
  const delay = parseFloat(el.dataset.delay || 0) * 0.14;
  const from  = type === 'slide-in' ? { x: -50, opacity: 0 } : { y: 55, opacity: 0 };
  const to    = type === 'slide-in'
    ? { x: 0,  opacity: 1, duration: .9, ease: 'power3.out', delay }
    : { y: 0,  opacity: 1, duration: .9, ease: 'power3.out', delay };

  gsap.fromTo(el, from, {
    ...to,
    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
  });
});

/* ─────────────────────────────────────────────────────────────
   8. SERVICE CARDS — stagger
───────────────────────────────────────────────────────────── */
gsap.fromTo('.card',
  { y: 70, opacity: 0, scale: .96 },
  {
    y: 0, opacity: 1, scale: 1,
    stagger: 0.1,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.cards', start: 'top 82%', once: true }
  }
);

/* ─────────────────────────────────────────────────────────────
   9. COUNTER ANIMATION (About stats)
───────────────────────────────────────────────────────────── */
const counters = document.querySelectorAll('.stat-num[data-count]');
counters.forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
      });
    }
  });
});

/* ─────────────────────────────────────────────────────────────
   10. CONTACT BUTTONS — magnetic hover
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.contact-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    gsap.to(btn, {
      x: (e.clientX - cx) * 0.2,
      y: (e.clientY - cy) * 0.2,
      duration: .45, ease: 'power2.out',
    });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,0.4)' });
  });
});

/* ─────────────────────────────────────────────────────────────
   11. PARALLAX — section headings drift slightly
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.section-heading').forEach(el => {
  gsap.to(el, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: el.closest('.section'),
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    }
  });
});

/* ─────────────────────────────────────────────────────────────
   12. SWIPER — Projects carousel
───────────────────────────────────────────────────────────── */
new Swiper('.projects-swiper', {
  modules: [Navigation, Pagination, A11y],
  slidesPerView: 1.15,
  spaceBetween: 20,
  loop: false,
  pagination: { el: '.projects-pagination', clickable: true },
  navigation: { prevEl: '.projects-prev', nextEl: '.projects-next' },
  breakpoints: {
    640:  { slidesPerView: 1.6, spaceBetween: 22 },
    900:  { slidesPerView: 2.2, spaceBetween: 24 },
    1200: { slidesPerView: 2.6, spaceBetween: 26 },
  },
  on: {
    touchMove() { lenis.stop(); },
    touchEnd()  { lenis.start(); },
  }
});

/* ─────────────────────────────────────────────────────────────
   13. HOVER GLOW on cards
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.card, .ps-inner, .about-stat').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  });
});

/* ─────────────────────────────────────────────────────────────
   14. PAGE LOAD — entrance animation
───────────────────────────────────────────────────────────── */
const loadTl = gsap.timeline();
loadTl
  .from('#navbar', { y: -60, opacity: 0, duration: .9, ease: 'power3.out' })
  .from('.deco-left, .deco-right', { opacity: 0, duration: 1 }, '-=.4');

/* ─────────────────────────────────────────────────────────────
   15. 3D HOVER TILT (Projects & Angpao)
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.ps-inner, .about-angpao').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-1 to 1)
    const xNorm = (x / rect.width - 0.5) * 2;
    const yNorm = (y / rect.height - 0.5) * 2;
    
    // Calculate rotation (max 10 degrees)
    const rotateX = yNorm * -10;
    const rotateY = xNorm * 10;
    
    gsap.to(el, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1200
    });
  });
  
  el.addEventListener('mouseleave', () => {
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.4)'
    });
  });
});

/* ─────────────────────────────────────────────────────────────
   16. DETAIL MODAL (Cinematic Full-Screen Overlay)
───────────────────────────────────────────────────────────── */
const detailModal = document.getElementById('detail-modal');
const detailCloseBtn = document.querySelector('.detail-close');
const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-desc');
const detailTags = document.getElementById('detail-tags');
const detailZh = document.getElementById('detail-zh');

document.querySelectorAll('.card, .ps-inner').forEach(item => {
  item.addEventListener('click', () => {
    let title, desc, zh, tagsHtml;
    
    if (item.classList.contains('ps-inner')) {
      title = item.querySelector('.ps-title').innerText;
      desc = item.querySelector('.ps-desc').innerText;
      zh = item.querySelector('.ps-zh').innerText;
      const tags = Array.from(item.querySelectorAll('.ps-tags span')).map(s => `<span>${s.innerText}</span>`);
      tagsHtml = tags.join('');
    } else {
      title = item.querySelector('h3').innerText;
      desc = item.querySelector('p').innerText;
      zh = item.querySelector('.card-footer').innerText;
      tagsHtml = `<span>Premium Service</span><span>Digital</span>`;
    }

    // Populate modal content dynamically
    detailTitle.innerText = title;
    detailDesc.innerText = desc;
    detailZh.innerText = zh;
    detailTags.innerHTML = tagsHtml;

    // Show GSAP overlay
    detailModal.classList.add('active');
    lenis.stop();
  });
});

if (detailCloseBtn) {
  detailCloseBtn.addEventListener('click', () => {
    detailModal.classList.remove('active');
    lenis.start();
  });
}

/* Toggle Angpao manually on Mobile Tap */
const angpao = document.querySelector('.about-angpao');
if (angpao) {
  angpao.addEventListener('click', () => {
    angpao.classList.toggle('open');
  });
}
