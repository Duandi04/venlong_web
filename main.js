/* ============================================================
   VENLONG — main.js
   Stack: Lenis 1.x · GSAP + ScrollTrigger · Swiper
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
   1. LENIS — smooth scroll (reference: lenis 1.1.20 pattern)
───────────────────────────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  lerp: 0.1,
});

// Sync Lenis → GSAP ticker  (recommended pattern)
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ─────────────────────────────────────────────────────────────
   2. NAVBAR — stuck state & smooth nav-links
───────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
lenis.on('scroll', ({ scroll }) => {
  navbar.classList.toggle('stuck', scroll > 60);
});

document.querySelectorAll('.nav-links button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.6 });
  });
});

/* ─────────────────────────────────────────────────────────────
   3. HERO — image → VENLONG text scrub
   #hero is 300vh tall; the .hero-stage is sticky 100vh.
   ScrollTrigger scrubs across the full scroll distance.

   Timeline breakdown (progress 0 → 1):
     0.00 → 0.35  : image zooms slightly (feels alive)
     0.35 → 0.60  : image fades + shrinks out
     0.50 → 0.80  : VENLONG text fades + scales IN
     0.82 → 1.00  : text drifts up & fades as hero exits
───────────────────────────────────────────────────────────── */
const heroImgLayer  = document.getElementById('hero-img-layer');
const heroTextLayer = document.getElementById('hero-text-layer');
const heroTitle     = document.getElementById('hero-title');

const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.8,           // slight lag = cinematic feel
  }
});

// phase 1 – gentle zoom on image
heroTl.to(heroImgLayer, { scale: 1.08, ease: 'none' }, 0);

// phase 2 – image fades out
heroTl.to(heroImgLayer, { opacity: 0, scale: 0.9, ease: 'none' }, 0.30);

// phase 3 – VENLONG scales in from slightly large
heroTl.fromTo(heroTextLayer,
  { opacity: 0, scale: 1.2 },
  { opacity: 1, scale: 1,   ease: 'none' },
  0.45
);

// phase 4 – text drifts up as section exits viewport
heroTl.to(heroTextLayer, { yPercent: -18, opacity: 0, ease: 'none' }, 0.82);

/* Stagger the title chars on first load */
gsap.from(heroTitle, {
  duration: 1.6,
  opacity: 0,
  y: 40,
  delay: 0.2,
  ease: 'power4.out',
});

/* ─────────────────────────────────────────────────────────────
   4. SECTION REVEALS — [data-reveal] attribute pattern
───────────────────────────────────────────────────────────── */
document.querySelectorAll('[data-reveal]').forEach(el => {
  const type  = el.dataset.reveal;
  const delay = parseFloat(el.dataset.delay || 0) * 0.15;

  const from = type === 'slide-in'
    ? { x: -50, opacity: 0 }
    : { y: 55,  opacity: 0 };

  const to   = type === 'slide-in'
    ? { x: 0,   opacity: 1, duration: 0.9, ease: 'power3.out', delay }
    : { y: 0,   opacity: 1, duration: 0.9, ease: 'power3.out', delay };

  gsap.fromTo(el, from, {
    ...to,
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true,
    }
  });
});

/* ─────────────────────────────────────────────────────────────
   5. SERVICE CARDS — stagger on scroll
───────────────────────────────────────────────────────────── */
gsap.fromTo('.card',
  { y: 60, opacity: 0 },
  {
    y: 0, opacity: 1,
    stagger: 0.12,
    duration: 0.85,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.cards', start: 'top 82%', once: true }
  }
);

/* ─────────────────────────────────────────────────────────────
   6. CONTACT BUTTONS — magnetic hover (like Framer Motion spring)
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.contact-btn').forEach(btn => {
  const handleMove = e => {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    gsap.to(btn, {
      x: (e.clientX - cx) * 0.22,
      y: (e.clientY - cy) * 0.22,
      duration: 0.5,
      ease: 'power2.out',
    });
  };
  const handleLeave = () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  };
  btn.addEventListener('mousemove', handleMove);
  btn.addEventListener('mouseleave', handleLeave);
});

/* ─────────────────────────────────────────────────────────────
   7. SWIPER — Projects carousel
───────────────────────────────────────────────────────────── */
new Swiper('.projects-swiper', {
  modules: [Navigation, Pagination, A11y],
  slidesPerView: 1.1,
  spaceBetween: 24,
  centeredSlides: false,
  loop: false,
  pagination: {
    el: '.projects-pagination',
    clickable: true,
  },
  navigation: {
    prevEl: '.projects-prev',
    nextEl: '.projects-next',
  },
  breakpoints: {
    640:  { slidesPerView: 1.6 },
    900:  { slidesPerView: 2.2 },
    1200: { slidesPerView: 2.6 },
  },
  // Let Lenis handle scroll momentum; disable Swiper freeMode touchMove
  on: {
    touchMove() { lenis.stop(); },
    touchEnd()  { lenis.start(); },
  }
});
