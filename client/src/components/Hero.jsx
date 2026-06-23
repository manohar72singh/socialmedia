import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import ParticlesBackground from './ParticlesBackground';

const words = ["Digital Landscape", "SEO Rankings", "Sales & Leads", "Brand Growth"];

const trustBadges = [
  { icon: Star, label: "5★ Google Rated", color: "text-yellow-400" },
  { icon: CheckCircle2, label: "Google Partner", color: "text-green-400" },
  { icon: TrendingUp, label: "500+ Projects", color: "text-indigo-400" },
];

// Fake avatar initials for social proof
const avatars = ["RK", "SM", "AP", "JD", "NK"];

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#020617] pt-24 sm:pt-20 px-5 sm:px-6 overflow-hidden">
      
      {/* Interactive Particles */}
      <ParticlesBackground />

      {/* Grid background (subtle) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />

      {/* Radial fade over grid */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent to-[#020617] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, #020617 80%)' }} />

      {/* Interactive Mouse Spotlight */}
      <motion.div
        animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
        transition={{ type: "spring", damping: 40, stiffness: 150, mass: 0.5 }}
        className="hidden sm:block fixed top-0 left-0 w-[600px] h-[600px] bg-indigo-600/12 rounded-full blur-[120px] pointer-events-none z-0"
      />

      {/* Static background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[5%] w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] right-[20%] w-[250px] h-[250px] bg-pink-600/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto relative z-10 text-center flex flex-col items-center max-w-6xl">

        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8"
        >
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill border border-white/10 text-xs font-semibold"
              >
                <Icon className={`w-3.5 h-3.5 ${badge.color}`} />
                <span className="text-slate-200">{badge.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-5 sm:mb-6 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md"
        >
          <span className="neon-dot" />
          <span className="text-indigo-300 text-xs sm:text-sm font-bold tracking-widest uppercase">
            AI-Powered Marketing Agency
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-5 sm:mb-6 leading-[1.1] tracking-tight"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Dominate your{' '}
          <br className="hidden sm:block" />
          <span className="inline-block min-w-[280px] sm:min-w-[400px] md:min-w-[580px] text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="inline-block gradient-text"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto font-light leading-relaxed"
        >
          We engineer explosive growth using <strong className="text-white font-semibold">data-driven strategies</strong>, 
          beautiful design, and intelligent AI automation systems.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 w-full max-w-xs sm:max-w-none mb-12 sm:mb-16"
        >
          <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
            <Link
              id="hero-cta-primary"
              to="/contact"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-[0_4px_24px_rgba(99,102,241,0.45)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.65)] transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <Zap className="w-4 h-4" />
              Get Free Strategy Call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
            <Link
              id="hero-cta-secondary"
              to="/services"
              className="flex items-center justify-center gap-2 px-8 py-4 glass-pill rounded-full font-bold text-white hover:bg-slate-800/60 transition-all border border-white/15"
            >
              Explore Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Social Proof: Avatars + Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
        >
          {/* Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-3">
              {avatars.map((initials, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#020617] flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, hsl(${200 + i * 30}, 70%, 45%), hsl(${220 + i * 30}, 80%, 55%))`,
                    zIndex: avatars.length - i,
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-slate-400 font-medium">200+ happy clients</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-700" />

          {/* Quick stats */}
          <div className="flex items-center gap-6">
            {[
              { value: "300%", label: "Avg. ROI" },
              { value: "98%", label: "Client Retention" },
              { value: "48h", label: "Onboarding" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none z-10" />
    </section>
  );
}
