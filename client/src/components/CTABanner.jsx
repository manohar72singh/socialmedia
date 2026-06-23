import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Clock, Zap, Shield } from 'lucide-react';

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;

      if (diff <= 0) {
        // Reset to next day if expired
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(23, 59, 59, 0);
        setTimeLeft({ hours: 23, minutes: 59, seconds: 59 });
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black text-white mb-1 border border-white/15"
        style={{
          background: 'rgba(255,255,255,0.08)',
          fontFamily: 'Space Grotesk, sans-serif',
          backdropFilter: 'blur(10px)',
        }}>
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
    </div>
  );
}

const perks = [
  { icon: Zap, text: "No commitment required" },
  { icon: Shield, text: "100% free, no credit card" },
  { icon: Clock, text: "30-minute focused session" },
  { icon: Phone, text: "Real expert on the call" },
];

export default function CTABanner() {
  // Target: end of today
  const [targetDate] = useState(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d;
  });

  const timeLeft = useCountdown(targetDate);

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">

      {/* Gradient background */}
      <div className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #2d1b69 75%, #1e1b4b 100%)',
        }}
      />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-[10%] w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(139, 92, 246, 0.35)' }}
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-[10%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(99, 102, 241, 0.4)' }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10 text-center max-w-4xl">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 mb-7"
          style={{ background: 'rgba(251, 191, 36, 0.1)' }}
        >
          <span className="text-yellow-400 text-sm">⚡</span>
          <span className="text-yellow-300 text-xs sm:text-sm font-bold uppercase tracking-widest">
            Limited Slots Available This Week
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-5 tracking-tight leading-[1.1]"
        >
          Ready to Grow Your{' '}
          <span style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fcd34d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Business 10x?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Book your <strong className="text-white">free 30-minute strategy call</strong> today. 
          Our experts will analyze your business and give you a custom growth plan — zero obligation.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center mb-10"
        >
          <p className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Today's offer expires in:
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <span className="text-2xl font-black text-white/40 mb-5">:</span>
            <TimeBlock value={timeLeft.minutes} label="Minutes" />
            <span className="text-2xl font-black text-white/40 mb-5">:</span>
            <TimeBlock value={timeLeft.seconds} label="Seconds" />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10"
        >
          <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              id="cta-banner-btn"
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-black text-indigo-900 transition-all shadow-[0_8px_40px_rgba(251,191,36,0.4)] hover:shadow-[0_12px_60px_rgba(251,191,36,0.6)]"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
            >
              <Phone className="w-5 h-5" />
              Book My Free Strategy Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6"
        >
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm">
                <Icon className="w-4 h-4 text-indigo-300" />
                {perk.text}
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
