import React from 'react';
import { motion } from 'framer-motion';
import { Search, Lightbulb, Rocket, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discovery & Audit",
    description: "We deep-dive into your business, industry, competitors, and current digital presence to understand exactly where you stand and where the biggest opportunities lie.",
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(99, 102, 241, 0.4)",
    tags: ["Brand Audit", "Competitor Research", "Goal Setting"],
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Strategy & Planning",
    description: "Our AI-powered team crafts a custom growth blueprint tailored to your goals, audience, and budget — with clear milestones and measurable KPIs.",
    color: "from-purple-500 to-pink-600",
    glow: "rgba(168, 85, 247, 0.4)",
    tags: ["Custom Roadmap", "KPI Definition", "Budget Planning"],
  },
  {
    number: "03",
    icon: Rocket,
    title: "Execution & Launch",
    description: "We execute with precision — launching campaigns, building content, optimizing your web presence, and automating workflows for maximum impact.",
    color: "from-orange-500 to-red-500",
    glow: "rgba(249, 115, 22, 0.4)",
    tags: ["Campaign Launch", "Content Creation", "Automation Setup"],
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Optimize & Scale",
    description: "We monitor every metric, A/B test constantly, and refine strategies to compound your results — turning good performance into extraordinary growth.",
    color: "from-green-500 to-emerald-600",
    glow: "rgba(16, 185, 129, 0.4)",
    tags: ["A/B Testing", "Performance Reports", "Scaling Strategy"],
  },
];

export default function Process() {
  return (
    <section id="process" className="py-16 sm:py-20 lg:py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #020617 0%, #080d1f 100%)' }}>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-24"
        >
          <span className="section-label mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
            How We Work
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Our Proven{' '}
            <span className="gradient-text">4-Step Process</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light">
            A systematic, data-backed approach that consistently delivers results for our clients across every industry.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">

          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[calc(100%-80px)] bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
          <div className="hidden md:block absolute left-[calc(25%-2px)] right-[calc(25%-2px)] top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="relative group"
              >
                {/* Card */}
                <div className="glass-card rounded-[2rem] p-6 sm:p-8 h-full border border-white/5 hover:border-indigo-500/30 transition-all duration-500">

                  {/* Number + Icon header */}
                  <div className="flex items-start gap-5 mb-5">
                    {/* Big number */}
                    <span className="text-5xl sm:text-6xl font-black leading-none select-none"
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))',
                      }}
                    >
                      {step.number}
                    </span>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${step.color} shadow-lg flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300`}
                      style={{ boxShadow: `0 8px 24px ${step.glow}` }}>
                      <Icon className="text-white w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm sm:text-[15px] mb-5 font-light">
                    {step.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag, ti) => (
                      <span key={ti} className="px-3 py-1 rounded-full text-[11px] font-semibold text-slate-300 border border-slate-700/60"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom timeline bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-14 sm:mt-20 relative"
        >
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #ec4899, transparent)' }} />
            {["Start", "Week 1-2", "Week 3-4", "Ongoing"].map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-500 bg-[#020617]"
                  style={{ boxShadow: '0 0 10px rgba(99,102,241,0.6)' }} />
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
