import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, TrendingUp, Users, Eye, ShoppingCart } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const categories = ['All', 'SEO', 'Social Media', 'Web Design', 'PPC Ads', 'Content'];



function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8 }}
      className="relative rounded-[2rem] overflow-hidden group cursor-default"
      style={{
        border: `1px solid ${hovered ? project.accentColor + '35' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered ? `0 20px 60px ${project.accentColor}20` : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.1} scale={1.01} className="h-full">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          loading="lazy"
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.6 }}
        />
        {/* Image overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${project.gradient} opacity-80`} />

        {/* Tag badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold text-white"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          {project.tag}
        </div>

        {/* Duration badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold text-white"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          ⏱ {project.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category + Industry */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ color: project.accentColor, background: project.accentColor + '18', border: `1px solid ${project.accentColor}30` }}>
            {project.category}
          </span>
          <span className="text-slate-600 text-xs">{project.industry}</span>
        </div>

        <h3 className="text-lg font-black text-white mb-2 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {project.metrics.map((m, mi) => {
            const iconMap = { TrendingUp, Users, Eye, ShoppingCart };
            const Icon = m.icon && typeof m.icon === 'string' ? iconMap[m.icon] || TrendingUp : TrendingUp;
            return (
              <div key={mi} className="text-center p-2.5 rounded-xl border border-white/5"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: m.color }} />
                <div className="text-[11px] font-black" style={{ color: m.color, fontFamily: 'Space Grotesk, sans-serif' }}>{m.value}</div>
                <div className="text-[9px] text-slate-600 leading-tight">{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          to="/contact"
          className="flex items-center gap-1.5 text-sm font-bold transition-colors group/link"
          style={{ color: project.accentColor }}
        >
          Get Similar Results
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
      </Tilt>
    </motion.div>
  );
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState([]);

  React.useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  }, []);

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-16 sm:py-20 lg:py-16 bg-[#020617] relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-purple-600/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="section-label mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block" />
            Our Work
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Projects That <span className="gradient-text">Delivered Results</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Real campaigns. Real clients. Real numbers. Browse our work by category.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14"
        >
          {categories.map((cat) => {
            const active = activeFilter === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300"
                style={{
                  background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                  color: active ? 'white' : '#64748b',
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: active ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">No projects in this category yet.</div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14 sm:mt-20"
        >
          <p className="text-slate-400 mb-5 text-sm sm:text-base">
            Your business could be here next. Let's create your success story.
          </p>
          <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              id="portfolio-cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm shadow-[0_4px_24px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.6)] transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
