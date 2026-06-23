import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, ArrowRight, Award, ExternalLink } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { Link } from 'react-router-dom';

export default function CaseStudies() {
  const [hovered, setHovered] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        // Map portfolio to case studies format
        const mapped = data.map(p => ({
          id: p.id,
          category: p.category,
          client: p.title,
          industry: p.industry,
          challenge: p.description,
          result: 'Achieved significant results with ' + p.industry + ' strategies.',
          metrics: p.metrics || [],
          timeframe: p.duration || '90 Days',
          gradient: p.gradient || 'from-blue-600/20 to-indigo-600/20',
          border: 'border-blue-500/20',
          accentColor: p.accentColor || '#6366f1',
          tag: p.tag || '🏆 Featured'
        }));
        setCaseStudies(mapped.slice(0, 3)); // Show top 3
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <section id="case-studies" className="py-16 sm:py-20 lg:py-16 bg-[#020617] relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-purple-600/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-blue-600/6 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="section-label mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Case Studies
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Real Results for{' '}
            <span className="gradient-text">Real Businesses</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Don't just take our word for it — see the actual numbers we've achieved for our clients.
          </p>
        </motion.div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onHoverStart={() => setHovered(study.id)}
              onHoverEnd={() => setHovered(null)}
              className={`relative rounded-[2rem] border ${study.border} overflow-hidden group cursor-default`}
              style={{
                background: `linear-gradient(135deg, ${study.gradient.replace('from-', '').replace('/20', '').split(' to-')[0]}1a, transparent)`,
              }}
            >
              <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable={true} glareMaxOpacity={0.1} scale={1.01} className="h-full">
              {/* Top gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-40`} />

              <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">

                {/* Category & Tag */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider px-3 py-1 rounded-full border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    {study.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">{study.tag}</span>
                </div>

                {/* Client */}
                <div className="mb-5">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {study.client}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">{study.industry}</p>
                </div>

                {/* Challenge & Result */}
                <div className="flex flex-col gap-3 mb-6 flex-1">
                  <div className="p-4 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Challenge</p>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{study.challenge}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-green-500/10" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1">Result</p>
                    <p className="text-sm text-white font-medium leading-relaxed line-clamp-2">{study.result}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {study.metrics?.slice(0, 3).map((metric, mi) => {
                    const iconMap = { TrendingUp, Users, ShoppingCart, Award };
                    const Icon = metric.icon && typeof metric.icon === 'string' ? iconMap[metric.icon] || TrendingUp : TrendingUp;
                    return (
                      <div key={mi} className="text-center p-3 rounded-xl border border-white/5"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <Icon className={`w-4 h-4 ${metric.color || 'text-indigo-400'} mx-auto mb-1.5`} />
                        <div className={`text-[15px] sm:text-base font-black ${metric.color || 'text-indigo-400'} mb-0.5`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {metric.value}
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wider leading-tight">{metric.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <Link
                  to="/contact"
                  className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-white group/link transition-colors"
                >
                  View Case Study
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl border border-indigo-500/15"
          style={{ background: 'rgba(99, 102, 241, 0.05)' }}
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Want Results Like These?</h3>
            <p className="text-slate-400 text-sm">Book a free 30-minute strategy call with our experts today.</p>
          </div>
          <Link
            to="/contact"
            id="case-study-cta"
            className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-sm transition-all hover:shadow-[0_8px_32px_rgba(99,102,241,0.5)]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Book Free Call
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
