import React from 'react';
import { motion } from 'framer-motion';

export default function PageHero({ title, highlight, subtitle, badge }) {
  return (
    <section className="relative min-h-[42vh] sm:min-h-[48vh] flex items-center justify-center overflow-hidden bg-[#020617] pt-28 pb-16 sm:pt-32 sm:pb-20 px-5">

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-indigo-600/20 rounded-full blur-[90px] sm:blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-20%] right-[-5%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-purple-600/15 rounded-full blur-[80px] sm:blur-[110px]"
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020617] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">

        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              {badge}
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4"
        >
          {title}{' '}
          {highlight && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              {highlight}
            </span>
          )}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 origin-center"
        />
      </div>
    </section>
  );
}
