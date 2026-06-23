import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, Map, Flag, CheckCircle, Mail, ArrowRight, Zap, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StrategyGenerator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: '',
    goal: '',
    budget: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.industry || !formData.goal || !formData.budget || !formData.email) {
      toast.error('Please complete all fields.');
      return;
    }

    setLoading(true);
    setStep(2);

    try {
      // Save Lead
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Strategy Generator Lead',
          email: formData.email,
          service: 'Custom Strategy',
          message: `Requested strategy for ${formData.industry}, Goal: ${formData.goal}, Budget: ${formData.budget}`
        })
      });

      // Generate AI Strategy
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.strategy) {
        setStrategy(data.strategy);
        setStep(3);
        toast.success('Strategy Generated!');
      } else {
        toast.error(data.error || 'Failed to generate strategy.');
        setStep(1);
      }
    } catch (err) {
      toast.error('Network error.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#0A0F1C] relative overflow-hidden" id="strategy-generator">
      {/* Background */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0F1C] to-[#0A0F1C] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6">
            <Map size={16} /> Free Action Plan
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Your Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Marketing Roadmap</span>
          </h2>
          <p className="text-xl text-slate-400">
            Tell us about your business, and our AI will generate a step-by-step 3-month growth strategy for you.
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
                onSubmit={handleGenerate}
                className="bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl relative"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">1. What is your Industry?</label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="e.g. Real Estate, E-commerce, SaaS"
                        className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">2. What is your #1 Goal?</label>
                      <select
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500"
                        required
                      >
                        <option value="">Select a Goal...</option>
                        <option value="Increase Sales & Revenue">Increase Sales & Revenue</option>
                        <option value="Generate More Leads">Generate More Leads</option>
                        <option value="Boost Brand Awareness">Boost Brand Awareness</option>
                        <option value="Drive Website Traffic">Drive Website Traffic</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">3. Monthly Marketing Budget?</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Budget Range...</option>
                        <option value="Under $1,000">Under $1,000</option>
                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000+">$10,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">4. Work Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 shadow-xl shadow-indigo-500/20"
                >
                  Generate My 3-Month Strategy <Zap size={20} />
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
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Crafting Your Strategy...</h3>
                  <p className="text-slate-400">Our AI is analyzing top trends in {formData.industry || 'your industry'}.</p>
                </div>
              </motion.div>
            )}

            {step === 3 && strategy && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Months */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { month: 'Month 1', data: strategy.month1, icon: <Route className="text-indigo-400" /> },
                    { month: 'Month 2', data: strategy.month2, icon: <Zap className="text-purple-400" /> },
                    { month: 'Month 3', data: strategy.month3, icon: <Flag className="text-emerald-400" /> },
                  ].map((m, i) => (
                    <div key={i} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                          {m.icon}
                        </div>
                        <h4 className="text-xl font-bold text-white">{m.month}</h4>
                      </div>
                      
                      <p className="text-sm font-bold text-slate-300 mb-4 pb-4 border-b border-slate-800">
                        Focus: {m.data.focus}
                      </p>
                      
                      <ul className="space-y-3">
                        {m.data.actionItems.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                            <CheckCircle size={14} className="text-indigo-500 mt-1 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Lightbulb className="text-yellow-400" /> Estimated Results
                    </h4>
                    <p className="text-indigo-200">
                      {strategy.estimatedResults}
                    </p>
                  </div>
                  <button className="whitespace-nowrap px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-xl">
                    Execute This Strategy
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
