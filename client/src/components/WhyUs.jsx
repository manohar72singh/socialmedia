import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Users, TrendingUp } from 'lucide-react';
import useCountUp from '../hooks/useCountUp';

const stats = [
  { id: 1, label: 'Projects Delivered', value: '500+', numeric: 500, suffix: '+', icon: Zap },
  { id: 2, label: 'Happy Clients', value: '350+', numeric: 350, suffix: '+', icon: Users },
  { id: 3, label: 'Ad Spend Managed', value: '$2M+', numeric: 2, suffix: 'M+', prefix: '$', icon: Target },
  { id: 4, label: 'Average ROI', value: '300%', numeric: 300, suffix: '%', icon: TrendingUp },
];

function StatCard({ stat, index }) {
  const Icon = stat.icon;
  const { count, ref } = useCountUp(stat.numeric, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="glass-panel p-6 sm:p-8 lg:p-10 rounded-[2rem] flex flex-col items-center text-center relative group overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/40 transition-colors duration-500" />

      <div className="relative z-10 p-3 sm:p-4 lg:p-5 bg-slate-800/50 rounded-2xl mb-4 sm:mb-6 shadow-inner border border-slate-700/50">
        <Icon className="text-indigo-400 w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Animated number */}
      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 tracking-tighter">
        {stat.prefix || ''}
        {count}
        {stat.suffix}
      </h3>
      <p className="text-slate-400 font-medium tracking-wide uppercase text-[10px] sm:text-xs">{stat.label}</p>
    </motion.div>
  );
}

export default function WhyUs() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-400 font-bold uppercase tracking-widest mb-3 text-xs sm:text-sm"
          >
            Why Choose Us
          </motion.h4>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            Numbers That Speak
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
