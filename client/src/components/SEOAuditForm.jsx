import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Mail, ArrowRight, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SEOAuditForm() {
  const [step, setStep] = useState(1); // 1: Input, 2: Loading, 3: Result
  const [formData, setFormData] = useState({ url: '', email: '' });
  const [report, setReport] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.url || !formData.email) {
      toast.error('Please provide both URL and Email');
      return;
    }

    setStep(2);
    
    try {
      const res = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setReport(data.report);
        setStep(3);
        toast.success('Audit complete! Full report sent to email.');
      } else {
        toast.error(data.error || 'Audit failed');
        setStep(1);
      }
    } catch (err) {
      toast.error('Network Error');
      setStep(1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#0A0F1C] border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px]"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px]"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
            <Search className="text-indigo-400" size={24} />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Free AI SEO Audit</h3>
          <p className="text-slate-400 text-sm">Enter your website URL to instantly see what's stopping you from ranking #1 on Google.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-4 max-w-md mx-auto"
            >
              <div>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email to receive full PDF"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Scan My Website <ArrowRight size={18} />
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="py-12 flex flex-col items-center text-center space-y-4"
            >
              <RefreshCw className="text-indigo-500 animate-spin" size={48} />
              <h4 className="text-xl font-bold text-white">AI is scanning your website...</h4>
              <p className="text-slate-400 text-sm">Analyzing Meta Tags, H1s, and Content Quality.</p>
            </motion.div>
          )}

          {step === 3 && report && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 max-w-lg mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white">SEO Health Score</h4>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{formData.url}</p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-4 ${
                  report.overallScore > 70 ? 'border-emerald-500 text-emerald-400' :
                  report.overallScore > 40 ? 'border-amber-500 text-amber-400' :
                  'border-red-500 text-red-400'
                }`}>
                  {report.overallScore}
                </div>
              </div>

              <div className="space-y-4 mb-6 text-left">
                {report.strengths?.slice(0, 1).map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                    <p className="text-sm text-slate-300">{s}</p>
                  </div>
                ))}
                {report.weaknesses?.slice(0, 2).map((w, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
                    <p className="text-sm text-slate-300">{w}</p>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3">
                <AlertCircle className="text-indigo-400 shrink-0" size={20} />
                <p className="text-xs text-indigo-200">
                  We've sent the complete 15-point audit report to <strong>{formData.email}</strong>. Our team will contact you shortly to help fix these issues!
                </p>
              </div>

              <button
                onClick={() => { setStep(1); setFormData({ url: '', email: '' }); }}
                className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-sm border border-slate-700"
              >
                Audit Another Website
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
