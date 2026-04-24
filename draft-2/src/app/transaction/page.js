'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Suspense } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

function TransactionContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service') || 'web';

  const serviceNames = {
    'web': 'Web & Apps Development',
    '3d': '3D Visualization',
    'video': 'Video Editing',
    'design': 'Design & Photoshop',
    'social': 'Social Media'
  };

  const gallery = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop',
  ];

  return (
    <main className="min-h-screen bg-background text-white">
      {/* Header */}
      <nav className="p-8 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="text-2xl font-black tracking-tighter">VENLONG</Link>
        <Link href="/services" className="text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors">Back to Services</Link>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Info & Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6">Let's build <br /> <span className="text-accent">together.</span></h1>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
                <h2 className="text-lg font-bold mb-2 uppercase tracking-widest text-accent">Selected Service</h2>
                <p className="text-3xl font-bold">{serviceNames[serviceId]}</p>
              </div>
            </motion.div>

            {/* Service Details */}
            <div className="prose prose-invert mb-12">
              <h3 className="text-sm uppercase tracking-[0.3em] text-white/30 mb-6">Service Details</h3>
              <p className="text-white/70 leading-relaxed text-lg mb-4">
                Our {serviceNames[serviceId]} service is tailored to elevate your brand's digital presence. 
                We combine technical excellence with artistic vision to deliver results that exceed expectations.
              </p>
              <ul className="grid grid-cols-2 gap-4 text-white/60">
                <li>• Premium Quality Output</li>
                <li>• Interactive Design</li>
                <li>• Strategic Development</li>
                <li>• Ongoing Support</li>
              </ul>
            </div>

            {/* Gallery Slider */}
            <h3 className="text-sm uppercase tracking-[0.3em] text-white/30 mb-6">Recent Work Portfolio</h3>
            <Swiper
              modules={[Autoplay, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              autoplay={{ delay: 2500 }}
              className="w-full h-80"
            >
              {gallery.map((img, i) => (
                <SwiperSlide key={i} className="w-64 h-full">
                  <img src={img} alt="Portfolio" className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="glass-card">
              <h3 className="text-2xl font-bold mb-8">Start Project</h3>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-accent transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Email Address</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-accent transition-colors" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Project Details</label>
                  <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-accent transition-colors" placeholder="Tell us about your project..." />
                </div>
                <button type="submit" className="w-full btn-premium justify-center py-5 bg-accent border-accent text-white hover:bg-white hover:text-black">
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </form>

              <div className="mt-12 pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest">Email</p>
                    <p className="text-white">hello@venlong.tech</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest">Phone</p>
                    <p className="text-white">+62 123 4567 89</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TransactionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>}>
      <TransactionContent />
    </Suspense>
  );
}
