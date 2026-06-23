import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Users, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ROICalculator() {
  const [visitors, setVisitors] = useState(5000);
  const [conversionRate, setConversionRate] = useState(2);
  const [aov, setAov] = useState(100);
  const [calculated, setCalculated] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Results state
  const [results, setResults] = useState({
    currentRevenue: 0,
    projectedTraffic: 0,
    projectedRevenue: 0,
    roi: 0
  });

  const handleCalculate = () => {
    setShowEmailCapture(true);
  };

  const submitEmailAndCalculate = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      // Send lead to backend
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'ROI Calculator Lead',
          email: email,
          service: 'ROI Calculator',
          message: `Calculated ROI for: ${visitors} visitors, ${conversionRate}% conv rate, $${aov} AOV`
        })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    // Current metrics
    const currentLeads = visitors * (conversionRate / 100);
    const currentRev = currentLeads * aov;

    // Projected metrics (Assuming Tech Digi doubles traffic and improves conversion by 1.5x)
    const newTraffic = visitors * 2.2;
    const newConvRate = conversionRate * 1.5;
    const newLeads = newTraffic * (newConvRate / 100);
    const newRev = newLeads * aov;

    // ROI calculation (assuming average agency retainer of $2000 for calculation purpose)
    const retainer = 2000;
    const profit = newRev - currentRev;
    const roiPercentage = ((profit - retainer) / retainer) * 100;

    setResults({
      currentRevenue: currentRev,
      projectedTraffic: newTraffic,
      projectedRevenue: newRev,
      roi: roiPercentage > 0 ? roiPercentage : 0
    });
    
    setShowEmailCapture(false);
    setCalculated(true);
  };

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-[#020617]">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="section-label mb-5 inline-flex">
            <Calculator className="w-4 h-4 mr-2" />
            ROI Calculator
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-4 tracking-tight">
            Calculate Your <span className="gradient-text">Growth Potential</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto font-light">
            See how much revenue you're leaving on the table. Enter your current metrics and see what Tech Digi can do for you.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Inputs Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">1</span>
              Current Metrics
            </h3>

            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-3">
                  Monthly Website Visitors
                  <span className="text-indigo-400">{visitors.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={visitors}
                  onChange={(e) => setVisitors(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-3">
                  Current Conversion Rate (%)
                  <span className="text-indigo-400">{conversionRate}%</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-3">
                  Average Order Value / Lead Value ($)
                  <span className="text-indigo-400">${aov.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <button
                onClick={handleCalculate}
                className="w-full py-4 mt-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/25"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                Calculate ROI
              </button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`glass-card p-6 sm:p-8 rounded-[2rem] border transition-colors duration-500 h-full flex flex-col ${calculated ? 'border-emerald-500/30' : 'border-white/5'}`}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">2</span>
              Projected Results (6 Months)
            </h3>

            {!calculated && !showEmailCapture && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-50">
                <TrendingUp className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400">Adjust the sliders and click calculate to see your potential growth.</p>
              </div>
            )}

            {showEmailCapture && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                  <Calculator className="w-8 h-8 text-indigo-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Calculation Ready!</h4>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                  Enter your email address to instantly unlock your projected revenue and ROI analysis.
                </p>
                <form onSubmit={submitEmailAndCalculate} className="w-full max-w-sm space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#0A0F1C] border border-slate-700 rounded-xl py-4 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    {loading ? 'Analyzing...' : 'Unlock Results'}
                  </button>
                  <p className="text-xs text-slate-500 mt-2">100% Free. No credit card required.</p>
                </form>
              </div>
            )}

            {calculated && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-bold mb-2">
                      <Users className="w-4 h-4 text-indigo-400" />
                      New Traffic
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {Math.round(results.projectedTraffic).toLocaleString()}
                      <span className="text-xs text-emerald-400 ml-2">/mo</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-bold mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      New Revenue
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      ${Math.round(results.projectedRevenue).toLocaleString()}
                      <span className="text-xs text-emerald-400 ml-2">/mo</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-emerald-500/20 mt-2 flex-1 flex flex-col justify-center"
                     style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))' }}>
                  <div className="text-center mb-2">
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Estimated ROI</span>
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-white text-center tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {Math.round(results.roi)}%
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-4">
                    Based on standard industry improvements after 6 months of active digital marketing.
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-all mt-4"
                >
                  Claim Your Growth Strategy
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
