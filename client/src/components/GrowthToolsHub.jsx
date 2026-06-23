import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Sparkles, Target, Map } from 'lucide-react';

import ROICalculator from './ROICalculator';
import SEOAuditTool from './SEOAudiTool';
import CompetitorTool from './CompetitorTool';
import StrategyGenerator from './StrategyGenerator';

export default function GrowthToolsHub() {
  const [activeTab, setActiveTab] = useState('seo');

  const tabs = [
    { id: 'seo', label: 'SEO Audit', icon: <Sparkles size={18} /> },
    { id: 'competitor', label: 'Competitor Spy', icon: <Target size={18} /> },
    { id: 'roi', label: 'ROI Calculator', icon: <Calculator size={18} /> },
    { id: 'strategy', label: 'Strategy Gen', icon: <Map size={18} /> },
  ];

  return (
    <section className="py-16 bg-[#0A0F1C] relative overflow-hidden" id="free-tools">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="section-label mb-4 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Free Growth Tools
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Everything You Need To <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Scale Fast</span>
          </h2>
          <p className="text-lg text-slate-400">
            Access our premium AI tools below to uncover hidden growth opportunities. 100% Free.
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-2 bg-[#111827] rounded-3xl border border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-base flex items-center gap-2 transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon} {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto bg-[#050B14] rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden min-h-[600px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* To prevent nested sections padding from looking weird, we use a wrapper. 
                  The individual tools already have their own <section> and py-16 paddings.
                  We can render them directly here, but they might need slight layout tweaks if they were designed as full-width sections. 
                  Since they are responsive, they will fit beautifully inside this container! */}
              {activeTab === 'seo' && <SEOAuditTool />}
              {activeTab === 'competitor' && <CompetitorTool />}
              {activeTab === 'roi' && <ROICalculator />}
              {activeTab === 'strategy' && <StrategyGenerator />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
