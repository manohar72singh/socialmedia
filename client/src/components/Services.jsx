import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { Link } from 'react-router-dom';

// Feature lists per service icon-key (fallback if not in DB)
const serviceFeatures = {
  Search: ["Keyword Research & Strategy", "On-Page Optimization", "Technical SEO Audit", "Link Building"],
  Share2: ["Content Calendar", "Community Management", "Viral Campaign Strategy", "Analytics & Reporting"],
  Globe: ["Custom UI/UX Design", "Mobile-First Development", "Speed Optimization", "CMS Integration"],
  Target: ["Google & Meta Ads", "ROI Tracking", "A/B Testing", "Conversion Optimization"],
  FileText: ["Blog & Article Writing", "Video Scripts", "Email Sequences", "Brand Storytelling"],
  BarChart2: ["Real-Time Dashboards", "Competitor Analysis", "Growth Forecasting", "KPI Monitoring"],
};

const defaultFeatures = ["Expert Strategy", "Dedicated Manager", "Monthly Reports", "24/7 Support"];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-16 bg-[#020617] relative overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[150px] pointer-events-none" />

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
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
            Our Services
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Everything Your Brand Needs to{' '}
            <span className="gradient-text">Dominate</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From SEO to social media and beyond — we offer end-to-end digital solutions 
            powered by AI and proven strategies.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-panel rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-slate-400 py-20">No services available.</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {services.map((service, idx) => {
              const Icon = LucideIcons[service.icon] || LucideIcons.HelpCircle;
              const features = serviceFeatures[service.icon] || defaultFeatures;
              const isPopular = idx === 1; // 2nd card = Most Popular

              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  className="relative group rounded-[2rem] glow-ring"
                >
                  {/* Gradient border on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />

                  <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.15} glarePosition="all" scale={1.02} className="h-full">
                    {/* Card */}
                    <div className="relative h-full glass-card p-6 sm:p-8 rounded-[2rem] flex flex-col overflow-hidden">

                      {/* Popular badge */}
                      {isPopular && (
                        <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                          ⭐ Most Popular
                        </div>
                      )}

                      {/* Color orb */}
                      <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${service.color} opacity-8 rounded-full blur-2xl group-hover:opacity-15 transition-opacity duration-500`} />

                      {/* Icon */}
                      <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl mb-5 flex items-center justify-center bg-gradient-to-br ${service.color} shadow-lg`}
                        style={{ width: '52px', height: '52px' }}>
                        <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-400 leading-relaxed font-light text-sm sm:text-[15px] mb-5">
                        {service.description}
                      </p>

                      {/* Feature list */}
                      <ul className="space-y-2 mb-6 flex-1">
                        {features.slice(0, 4).map((feat, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link
                        to="/contact"
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm group/link transition-colors mt-auto"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Tilt>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14 sm:mt-20"
        >
          <p className="text-slate-400 mb-4 text-sm sm:text-base">
            Don't see what you need? We offer custom solutions tailored to your business.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Discuss Custom Solution
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
