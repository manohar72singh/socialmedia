import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Award, Sparkles } from 'lucide-react';

const stats = [
  { label: 'Happy Clients', value: '250+' },
  { label: 'Projects Done', value: '600+' },
  { label: 'Win Rate', value: '98%' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-16 bg-[#020617] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20 sm:mb-28"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>Discover Tech Digi</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
            Architecting <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm">Digital Dominance</span>
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl font-light leading-relaxed">
            We don't just follow trends; we create them. Step into the future with strategies engineered for exponential growth.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Interactive Image Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative h-[500px] sm:h-[600px] w-full"
          >
            {/* Main Image */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 right-0 w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group z-10"
            >
              <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Our Workspace"
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                loading="lazy"
              />
            </motion.div>

            {/* Secondary Image Overlapping */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 group z-20"
            >
              <div className="absolute inset-0 bg-purple-600/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                alt="Strategy Meeting"
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                loading="lazy"
              />
            </motion.div>

            {/* Floating Glass Card (Experience) */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
              className="absolute top-12 -left-6 sm:-left-12 glass-panel p-5 sm:p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl bg-white/5 z-30"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                    <Award className="text-purple-400 w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">10+ Years</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Of Excellence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Bento Box Style Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Redefining the <span className="text-indigo-400">Digital Landscape</span>
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed font-light mb-6">
                Tech Digi is more than just a marketing agency. We are an <strong className="text-white font-semibold border-b border-indigo-500/50 pb-0.5">AI-powered growth engine</strong>. By fusing cutting-edge technology with unbridled human creativity, we craft scalable solutions that propel brands to industry leadership.
              </p>
            </motion.div>

            {/* Feature Bento Grid */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="text-indigo-400 w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Data-Driven</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Precision strategies backed by deep analytics and real-time market insights.</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm hover:bg-slate-800/50 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-purple-400 w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">AI Automation</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Scale operations seamlessly with intelligent workflows and generative AI.</p>
              </div>
            </motion.div>

            {/* Stats Bar */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md flex justify-between items-center mt-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center flex-1 first:border-l-0 border-l border-white/10">
                  <h3 className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight drop-shadow-md">{stat.value}</h3>
                  <p className="text-[10px] sm:text-xs text-indigo-200/80 font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
