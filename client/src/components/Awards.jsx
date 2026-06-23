import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Shield, Zap, TrendingUp, Globe } from 'lucide-react';

const awards = [
  {
    icon: '🏆',
    title: 'Google Partner',
    subtitle: 'Certified Agency 2024',
    description: 'Official Google Partner for Search, Display & YouTube advertising excellence.',
    color: '#4285F4',
    bg: 'rgba(66, 133, 244, 0.1)',
    border: 'rgba(66, 133, 244, 0.25)',
  },
  {
    icon: '⭐',
    title: 'Meta Business Partner',
    subtitle: 'Facebook & Instagram Ads',
    description: 'Recognized partner for delivering outstanding results on Meta advertising platforms.',
    color: '#0866FF',
    bg: 'rgba(8, 102, 255, 0.1)',
    border: 'rgba(8, 102, 255, 0.25)',
  },
  {
    icon: '🥇',
    title: 'Top Digital Agency',
    subtitle: 'Clutch.co — India 2024',
    description: 'Ranked among India\'s top digital marketing agencies by Clutch based on client reviews.',
    color: '#ff3d2e',
    bg: 'rgba(255, 61, 46, 0.1)',
    border: 'rgba(255, 61, 46, 0.25)',
  },
  {
    icon: '🎖️',
    title: 'HubSpot Certified',
    subtitle: 'Inbound Marketing',
    description: 'HubSpot Academy certified team in inbound marketing, content strategy & CRM.',
    color: '#FF7A59',
    bg: 'rgba(255, 122, 89, 0.1)',
    border: 'rgba(255, 122, 89, 0.25)',
  },
  {
    icon: '🌐',
    title: 'Semrush Agency',
    subtitle: 'SEO Partner',
    description: 'Official Semrush Partner Agency — recognized for advanced SEO expertise and results.',
    color: '#FF6B00',
    bg: 'rgba(255, 107, 0, 0.1)',
    border: 'rgba(255, 107, 0, 0.25)',
  },
  {
    icon: '💎',
    title: 'ISO 9001 Certified',
    subtitle: 'Quality Management',
    description: 'Our processes meet international quality management standards for consistent service delivery.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.25)',
  },
];

const stats = [
  { icon: Star, value: '4.9/5', label: 'Average Rating', color: '#fbbf24', sub: 'Across 120+ reviews' },
  { icon: Award, value: '12+', label: 'Awards Won', color: '#6366f1', sub: 'Industry recognition' },
  { icon: Shield, value: '100%', label: 'Data Security', color: '#10b981', sub: 'SSL & GDPR compliant' },
  { icon: TrendingUp, value: '98%', label: 'Client Retention', color: '#ec4899', sub: 'Year-over-year' },
];

export default function Awards() {
  return (
    <section id="awards" className="py-16 sm:py-20 lg:py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080d1f 0%, #020617 100%)' }}>

      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="section-label mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
            Awards & Certifications
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Recognized by the <span className="gradient-text-gold">Industry's Best</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Our certifications and partnerships prove we don't just talk results — we're validated by the world's top platforms.
          </p>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16 sm:mb-20">
          {awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative p-6 rounded-2xl transition-all duration-300"
              style={{
                background: award.bg,
                border: `1px solid ${award.border}`,
                boxShadow: `0 4px 24px ${award.color}12`,
              }}
            >
              {/* Glow orb */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30"
                style={{ background: award.color }} />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl leading-none flex-shrink-0">{award.icon}</div>
                  <div>
                    <h3 className="text-base font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {award.title}
                    </h3>
                    <p className="text-xs font-bold" style={{ color: award.color }}>{award.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-light">{award.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-2xl border border-white/6 transition-all hover:border-white/12"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: s.color + '18', border: `1px solid ${s.color}30` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', color: s.color }}>
                  {s.value}
                </div>
                <div className="text-white text-xs sm:text-sm font-bold mb-0.5">{s.label}</div>
                <div className="text-slate-600 text-[11px]">{s.sub}</div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
