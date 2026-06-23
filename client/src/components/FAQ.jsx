import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group"
    >
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.12)]'
            : 'border-white/8 hover:border-white/15'
        }`}
        style={{ background: isOpen ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.03)' }}
      >
        {/* Question */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
          aria-expanded={isOpen}
        >
          <span className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {faq.question}
          </span>
          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? 'bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
              : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
          }`}>
            {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </div>
        </button>

        {/* Answer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                <div className="h-px bg-gradient-to-r from-indigo-500/30 to-transparent mb-4" />
                <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed font-light">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          setFaqs(data.filter(f => f.category === 'general'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-16 bg-[#020617] relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/6 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10 max-w-4xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="section-label mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block" />
            FAQ
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Got{' '}
            <span className="gradient-text">Questions?</span>
            {' '}We've Got Answers.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-light">
            Everything you need to know before working with us. Still have questions? Book a free call.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl border border-indigo-500/15"
          style={{ background: 'rgba(99, 102, 241, 0.05)' }}
        >
          <p className="text-slate-400 mb-2 text-sm sm:text-base">Still have questions?</p>
          <h3 className="text-lg sm:text-xl font-black text-white mb-5">Talk directly with our team — for free.</h3>
          <a
            href="/contact"
            id="faq-cta"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-sm transition-all hover:shadow-[0_8px_32px_rgba(99,102,241,0.5)]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Book Free Strategy Call
          </a>
        </motion.div>

      </div>
    </section>
  );
}
