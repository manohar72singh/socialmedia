import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Sparkles, CheckCircle2, AlertCircle, TrendingUp, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SEOAuditTool() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!url || !email) return toast.error('Please enter both URL and Email');
    
    setLoading(true);
    const tId = toast.loading('Our AI is scanning your website...');

    try {
      const res = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setReport(data.report);
        toast.success('Audit Complete!', { id: tId });
      } else {
        toast.error(data.error || 'Failed to scan website', { id: tId });
      }
    } catch (err) {
      toast.error('Network Error', { id: tId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#0A0F1C] relative overflow-hidden" id="free-audit">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6">
              <Sparkles size={16} /> Free AI SEO Audit
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Is Your Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">Losing Customers?</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Get an instant AI-powered SEO analysis. Enter your website URL to discover critical issues and uncover hidden growth opportunities.
            </p>
          </div>

          {/* Form */}
          {!report && (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleAudit}
              className="bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500" />
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Website URL</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="e.g. www.yourwebsite.com"
                      className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Where should we send the full report?</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. you@company.com"
                      className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-xl shadow-indigo-500/25"
                >
                  {loading ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sparkles size={24} /></motion.div> Scanning Website...</>
                  ) : (
                    <><TrendingUp size={24} /> Get My Free Audit</>
                  )}
                </button>
                <p className="text-slate-500 text-sm mt-4">100% Free. Secure analysis. No credit card required.</p>
              </div>
            </motion.form>
          )}

          {/* Results Display */}
          <AnimatePresence>
            {report && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Score Header */}
                <div className="bg-slate-800/50 p-8 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Audit Results for <span className="text-indigo-400">{url}</span></h3>
                    <p className="text-slate-400">A detailed copy has been sent to {email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">SEO Score</p>
                      <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                        {report.overallScore}/100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8">
                  {/* Strengths */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 size={20} /> What You're Doing Right
                    </h4>
                    <ul className="space-y-3">
                      {report.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-slate-300 text-sm">{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-red-400 flex items-center gap-2">
                      <AlertCircle size={20} /> Critical Issues Found
                    </h4>
                    <ul className="space-y-3">
                      {report.weaknesses.map((wk, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                          <span className="text-slate-300 text-sm">{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendations Call to Action */}
                <div className="bg-indigo-600 p-8 text-center">
                  <h4 className="text-2xl font-bold text-white mb-4">Want to fix these issues and rank higher?</h4>
                  <p className="text-indigo-200 mb-6 max-w-2xl mx-auto">
                    Our team of experts can implement these recommendations ({report.recommendations[0]}) and drive organic traffic to your business.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                      Book a Free Strategy Call
                    </button>
                    <button 
                      onClick={() => setReport(null)}
                      className="px-6 py-3 rounded-xl font-bold border border-indigo-400 text-white hover:bg-indigo-500 transition-colors"
                    >
                      Audit Another Site
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
