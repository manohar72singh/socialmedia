import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Phone, Mail, MapPin, Clock, MessageSquare, Calendar } from 'lucide-react';
import BookingCalendar from './BookingCalendar';

const SERVICES = [
  { id: 'seo', label: '🔍 SEO Optimization', value: 'SEO' },
  { id: 'social', label: '📱 Social Media', value: 'Social Media' },
  { id: 'web', label: '💻 Web Design', value: 'Web Design' },
  { id: 'ppc', label: '🎯 PPC & Ads', value: 'PPC' },
  { id: 'content', label: '✍️ Content Marketing', value: 'Content' },
  { id: 'auto', label: '🤖 AI Automation', value: 'Automation' },
];

const BUDGETS = [
  { label: 'Under ₹15K/mo', value: 'under_15k' },
  { label: '₹15K–₹35K/mo', value: '15k_35k' },
  { label: '₹35K–₹75K/mo', value: '35k_75k' },
  { label: '₹75K+/mo', value: '75k_plus' },
  { label: 'Custom / Not Sure', value: 'custom' },
];

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210', color: 'text-green-400' },
  { icon: Mail, label: 'Email', value: 'hello@techdigi.in', href: 'mailto:hello@techdigi.in', color: 'text-indigo-400' },
  { icon: MapPin, label: 'Location', value: 'Mumbai, Maharashtra', href: null, color: 'text-pink-400' },
  { icon: Clock, label: 'Response Time', value: 'Within 2 hours', href: null, color: 'text-yellow-400' },
];

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'calendar'

  const toggleService = (val) => {
    setSelectedServices(prev =>
      prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]
    );
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, services: selectedServices.join(', '), budget: selectedBudget };
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.previewUrl) {
          console.log('%c💌 Lead captured!', 'color: #6366F1; font-weight: bold;');
          console.log(resData.previewUrl);
        }
        setSubmitted(true);
        reset();
        setSelectedServices([]);
        setSelectedBudget('');
      } else {
        toast.error('Failed to send. Please try again.');
      }
    } catch {
      toast.error('Network error. Check your connection.');
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 max-w-6xl mx-auto">

          {/* Left: Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            <span className="section-label mb-5 inline-flex w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
              Contact Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Let's Start Your <span className="gradient-text">Growth Story</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 font-light">
              Tell us about your business and goals. Our team will get back to you within 2 hours with a custom plan.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <motion.div
                  key={label}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/6 transition-colors hover:border-indigo-500/20"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
                    {href ? (
                      <a href={href} className="text-slate-300 text-sm font-medium hover:text-white transition-colors">{value}</a>
                    ) : (
                      <p className="text-slate-300 text-sm font-medium">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp quick link */}
            <a
              href="https://wa.me/919876543210?text=Hi! I want to grow my business with Tech Digi."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)]"
              style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp Instead
            </a>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                /* Success State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-[2rem] p-10 sm:p-14 text-center border border-green-500/20 flex flex-col items-center justify-center min-h-[500px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Message Received! 🎉
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm mb-6">
                    Our team will review your requirements and get back to you within <strong className="text-white">2 hours</strong>. Check your inbox!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
                  >
                    Send another message →
                  </button>
                </motion.div>
              ) : (
                /* Form or Calendar */
                <motion.div key="form-container" className="glass-card rounded-[2rem] p-7 sm:p-10 border border-white/6 h-full flex flex-col">
                  
                  {/* Tabs */}
                  <div className="flex items-center gap-2 mb-8 bg-white/5 p-1.5 rounded-full border border-white/5 w-fit">
                    <button
                      onClick={() => setActiveTab('form')}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'form' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </button>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'calendar' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Calendar className="w-4 h-4" />
                      Book a Call
                    </button>
                  </div>

                  {activeTab === 'form' ? (
                    <>
                      <h3 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Tell us about your project
                      </h3>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-1 flex flex-col justify-between">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: errors.name ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                          onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}
                        />
                        {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email *</label>
                        <input
                          type="email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email' }
                          })}
                          placeholder="rahul@company.com"
                          className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: errors.email ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                          onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}
                        />
                        {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        {...register('phone', {
                          pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                        })}
                        maxLength="10"
                        placeholder="9876543210"
                        className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                      {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Services multi-select */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                        Services Needed <span className="text-slate-600 normal-case font-normal">(select all that apply)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SERVICES.map(s => {
                          const active = selectedServices.includes(s.value);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleService(s.value)}
                              className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                              style={{
                                background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                                border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                color: active ? '#a5b4fc' : '#64748b',
                                boxShadow: active ? '0 0 12px rgba(99,102,241,0.2)' : 'none',
                              }}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Monthly Budget</label>
                      <div className="flex flex-wrap gap-2">
                        {BUDGETS.map(b => {
                          const active = selectedBudget === b.value;
                          return (
                            <button
                              key={b.value}
                              type="button"
                              onClick={() => setSelectedBudget(b.value)}
                              className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                              style={{
                                background: active ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
                                border: active ? '1px solid rgba(251,191,36,0.45)' : '1px solid rgba(255,255,255,0.08)',
                                color: active ? '#fbbf24' : '#64748b',
                              }}
                            >
                              {b.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Message</label>
                      <textarea
                        {...register('message')}
                        rows="3"
                        placeholder="Tell us about your business — current challenges, goals, timeline..."
                        className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none transition-all resize-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </div>

                    {/* Honeypot spam protection */}
                    <input type="text" {...register('_honey')} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.55)]"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Sending...' : 'Send Message — Get Free Plan'}
                    </motion.button>

                    <p className="text-slate-600 text-[11px] text-center">
                      🔒 Your info is safe. We never share or sell your data.
                    </p>
                  </form>
                    </>
                  ) : (
                    <motion.div 
                      key="calendar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-6 flex flex-col"
                    >
                      <BookingCalendar />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
