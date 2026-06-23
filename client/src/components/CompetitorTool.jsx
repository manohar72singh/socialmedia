import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, ShieldAlert, Target, Zap, ChevronRight, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CompetitorTool() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ url: '', competitorUrl: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.url || !formData.competitorUrl || !formData.email) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setStep(2);

    try {
      // 1. Save Lead
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Competitor Analysis Lead',
          email: formData.email,
          service: 'Competitor Analysis',
          message: `Requested analysis for ${formData.url} vs ${formData.competitorUrl}`
        })
      });

      // 2. Fetch Analysis
      const res = await fetch('/api/competitor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.competitorUrl })
      });

      const data = await res.json();
      if (res.ok && data.analysis) {
        setAnalysis(data.analysis);
        setStep(3);
        toast.success('Analysis Complete!');
      } else {
        toast.error(data.error || 'Could not analyze competitor.');
        setStep(1);
      }
    } catch (err) {
      toast.error('Network Error');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#050B14] relative overflow-hidden" id="competitor-tool">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold mb-6">
            <Target size={16} /> Spy on Your Competitors
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Why is your competitor <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">stealing your clients?</span>
          </h2>
          <p className="text-xl text-slate-400">
            Enter your competitor's URL below. Our AI will instantly analyze their digital strategy and give you an actionable plan to outrank them.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleAnalyze}
                className="bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Your Website URL</label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="e.g. www.mycompany.com"
                      className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">#1 Competitor's URL</label>
                    <input
                      type="text"
                      value={formData.competitorUrl}
                      onChange={(e) => setFormData({ ...formData, competitorUrl: e.target.value })}
                      placeholder="e.g. www.theircompany.com"
                      className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-400 mb-2 flex items-center gap-2">
                    <Lock size={14} /> Work Email (To receive full report)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 shadow-xl shadow-orange-500/20"
                >
                  <Crosshair size={20} /> Reveal Competitor Strategy
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 flex flex-col items-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                  <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-400" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Infiltrating Competitor Strategy...</h3>
                  <p className="text-slate-400">Our AI is analyzing {formData.competitorUrl}'s keywords and structure.</p>
                </div>
              </motion.div>
            )}

            {step === 3 && analysis && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="bg-gradient-to-r from-slate-900 to-[#111827] p-8 border-b border-slate-800 text-center">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-orange-500/10 items-center justify-center mb-4">
                    <ShieldAlert className="text-orange-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Competitor Analysis Revealed</h3>
                  <p className="text-slate-400">Target: <span className="text-orange-400 font-mono">{formData.competitorUrl}</span></p>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8">
                  {/* Vulnerabilities (Weaknesses of Competitor) */}
                  <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-2xl">
                    <h4 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
                      <Zap size={20} /> Their Vulnerabilities
                    </h4>
                    <ul className="space-y-3">
                      {analysis.weaknesses?.map((w, i) => (
                         <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                           <span className="text-orange-500 mt-1">▹</span> {w}
                         </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl">
                    <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                      <Target size={20} /> Keyword Opportunities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keyword_opportunities?.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-4">
                      These are gaps in their strategy where you can easily rank higher and steal their traffic.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-8 m-8 mt-0 rounded-2xl border border-slate-700">
                  <h4 className="text-white font-bold mb-3">Your Action Plan to Outrank Them:</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {analysis.action_plan}
                  </p>
                  <button className="w-full py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    Let's Build This Strategy <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
