import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, Zap, Star, Building2, ArrowRight, HelpCircle } from 'lucide-react';

import * as LucideIcons from 'lucide-react';

function PlanCard({ plan, isYearly, index }) {
  const Icon = LucideIcons[plan.icon] || LucideIcons.Zap;
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const saving = plan.monthlyPrice - plan.yearlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -8 }}
      className="relative"
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-5 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest whitespace-nowrap shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)' }}>
            ⭐ Most Popular
          </div>
        </div>
      )}

      {/* Glow border for popular */}
      {plan.popular && (
        <div className="absolute -inset-0.5 rounded-[2rem] opacity-70 blur-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)' }} />
      )}

      <div className="relative h-full rounded-[2rem] flex flex-col overflow-hidden"
        style={{
          background: plan.popular
            ? 'linear-gradient(180deg, #0f172a 0%, #0c1228 100%)'
            : 'rgba(15, 23, 42, 0.6)',
          border: `1px solid ${plan.borderColor}`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 20px 60px ${plan.glow}`,
        }}>

        {/* Top color bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${plan.color}`} />

        <div className="p-7 sm:p-8 flex flex-col flex-1">
          {/* Plan header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3 shadow-lg`}
                style={{ boxShadow: `0 8px 20px ${plan.glow}` }}>
                <Icon className="text-white w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{plan.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{plan.tagline}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-end gap-1">
              <span className="text-slate-400 text-lg font-semibold">{plan.currency}</span>
              <span className="text-4xl sm:text-5xl font-black text-white leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {price.toLocaleString('en-IN')}
              </span>
              <span className="text-slate-500 text-sm mb-1">/mo</span>
            </div>
            {isYearly && (
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-slate-500 text-xs line-through">₹{plan.monthlyPrice.toLocaleString('en-IN')}/mo</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-green-300 border border-green-500/30"
                  style={{ background: 'rgba(16,185,129,0.1)' }}>
                  Save ₹{(saving * 12).toLocaleString('en-IN')}/yr
                </span>
              </div>
            )}
          </div>
          <p className="text-slate-600 text-[11px] mb-6">Billed {isYearly ? 'yearly' : 'monthly'} · No lock-in contract</p>

          {/* Features */}
          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                {feat.included ? (
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5 shadow`}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-2.5 h-2.5 text-slate-600" strokeWidth={3} />
                  </div>
                )}
                <span className={feat.included ? 'text-slate-300' : 'text-slate-600'}>{feat.text}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all ${
                plan.popular
                  ? 'text-white shadow-[0_4px_24px_rgba(99,102,241,0.5)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.7)]'
                  : 'text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
              style={plan.popular ? { background: `linear-gradient(135deg, ${plan.color.includes('indigo') ? '#6366f1, #8b5cf6' : plan.color.includes('amber') ? '#f59e0b, #f97316' : '#3b82f6, #6366f1'})` } : {}}
            >
              {plan.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [plans, setPlans] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch('/api/pricing').then(res => res.json()),
      fetch('/api/faqs').then(res => res.json())
    ]).then(([pricingData, faqsData]) => {
      setPlans(pricingData);
      setFaqs(faqsData.filter(f => f.category === 'pricing'));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-16 bg-[#020617] relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-purple-600/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

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
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Transparent Plans,{' '}
            <span className="gradient-text">Real Results</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-light">
            No hidden fees. No long contracts. Just results — or your money back.
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-semibold ${!isYearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none"
              style={{ background: isYearly ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)' }}
            >
              <motion.div
                animate={{ x: isYearly ? 28 : 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-2 ${isYearly ? 'text-white' : 'text-slate-500'}`}>
              Yearly
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-green-300 border border-green-500/30"
                style={{ background: 'rgba(16,185,129,0.12)' }}>
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} isYearly={isYearly} index={i} />
          ))}
        </div>

        {/* Custom Plan Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl border border-indigo-500/15 mb-16"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.04))' }}
        >
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Need something custom? 🤔
            </h3>
            <p className="text-slate-400 text-sm">We also build custom packages tailored to your specific business goals.</p>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-sm transition-all hover:shadow-[0_8px_32px_rgba(99,102,241,0.5)]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Custom Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-black text-white text-center mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Questions about pricing?
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-white/5 overflow-hidden transition-colors" style={{ background: openFaq === i ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-slate-200 text-sm sm:text-base pr-8">{faq.question}</span>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${openFaq === i ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                    <ArrowRight className={`w-3 h-3 transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-slate-400 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
