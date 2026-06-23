import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowUpRight, Zap } from 'lucide-react';

/* ── Custom SVG social icons ── */
const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  ),
};

const socials = [
  { key: 'Instagram', href: import.meta.env.VITE_SOCIAL_INSTAGRAM || 'https://instagram.com', label: 'Instagram', hoverColor: '#e1306c' },
  { key: 'LinkedIn', href: import.meta.env.VITE_SOCIAL_LINKEDIN || 'https://linkedin.com', label: 'LinkedIn', hoverColor: '#0077b5' },
  { key: 'Twitter', href: import.meta.env.VITE_SOCIAL_TWITTER || 'https://twitter.com', label: 'Twitter/X', hoverColor: '#1da1f2' },
  { key: 'WhatsApp', href: `https://wa.me/${(import.meta.env.VITE_BRAND_PHONE || '919876543210').replace(/[^0-9]/g, '')}`, label: 'WhatsApp', hoverColor: '#25d366' },
];

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Our Process', to: '/services' },
  { label: 'Case Studies', to: '/services' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
];

const serviceLinks = [
  { label: 'SEO Optimization', to: '/services' },
  { label: 'Social Media', to: '/services' },
  { label: 'Web Design', to: '/services' },
  { label: 'PPC & Paid Ads', to: '/services' },
  { label: 'Content Marketing', to: '/services' },
  { label: 'AI Automation', to: '/services' },
];

/* ── Floating Particle ── */
function Particle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
    />
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const particles = [
    { width: 4, height: 4, background: '#6366f1', top: '20%', left: '8%', boxShadow: '0 0 8px #6366f1' },
    { width: 3, height: 3, background: '#a78bfa', top: '60%', left: '15%', boxShadow: '0 0 6px #a78bfa' },
    { width: 5, height: 5, background: '#818cf8', top: '35%', right: '10%', boxShadow: '0 0 10px #818cf8' },
    { width: 3, height: 3, background: '#ec4899', top: '75%', right: '20%', boxShadow: '0 0 6px #ec4899' },
    { width: 4, height: 4, background: '#34d399', top: '15%', right: '35%', boxShadow: '0 0 8px #34d399' },
    { width: 2, height: 2, background: '#fbbf24', top: '80%', left: '40%', boxShadow: '0 0 5px #fbbf24' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: '#020617' }}>

      {/* ── SVG Wave Divider on Top ── */}
      <div className="relative w-full overflow-hidden leading-none" style={{ height: '80px' }}>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z"
            fill="#080d1f"
          />
        </svg>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      </div>

      {/* ── Main Footer Body ── */}
      <div
        className="relative"
        style={{ background: 'linear-gradient(180deg, #080d1f 0%, #04081a 60%, #020617 100%)' }}
      >
        {/* Floating particles */}
        {particles.map((p, i) => <Particle key={i} style={p} />)}

        {/* Big glowing orbit ring - decorative */}
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none hidden lg:block"
          style={{ border: '1px solid rgba(99,102,241,0.08)', boxShadow: 'inset 0 0 60px rgba(99,102,241,0.04)' }} />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none hidden lg:block"
          style={{ border: '1px solid rgba(139,92,246,0.1)', boxShadow: 'inset 0 0 40px rgba(139,92,246,0.05)' }} />
        <div className="absolute -right-0 top-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full pointer-events-none hidden lg:block"
          style={{ border: '1px solid rgba(168,85,247,0.15)', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

        {/* Ambient left glow */}
        <div className="absolute -left-20 top-10 w-[350px] h-[350px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-6 pt-14 sm:pt-18 pb-0 relative z-10" style={{ paddingTop: '56px' }}>

          {/* ── BIG Brand Statement ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 mb-5"
              style={{ background: 'rgba(99,102,241,0.08)' }}>
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Start Your Growth Journey</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Let's Build Something{' '}
              <span style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #f472b6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Extraordinary
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8 font-light">
              Ready to dominate your market? Let's talk strategy — free, no strings attached.
            </p>
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-indigo-900 text-sm shadow-[0_4px_24px_rgba(251,191,36,0.35)] hover:shadow-[0_8px_40px_rgba(251,191,36,0.55)] transition-all"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
              >
                Book a Free Strategy Call
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Gradient Divider ── */}
          <div className="h-px mb-12 sm:mb-14" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(168,85,247,0.4), transparent)' }} />

          {/* ── Links Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-8 sm:gap-10 mb-12 sm:mb-14">

            {/* Brand block */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-4">
              <Link to="/" className="flex items-center gap-2.5 group mb-4 w-fit">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <span className="text-white font-black text-lg leading-none">T</span>
                </div>
                <span className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Tech <span className="text-indigo-400">Digi</span>
                </span>
              </Link>

              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-[240px]">
                AI-powered growth agency. We help ambitious brands win online — with data, design & automation.
              </p>

              {/* Social icons — unique pill style */}
              <div className="flex flex-wrap gap-2 mb-6">
                {socials.map(({ key, href, label, hoverColor }) => {
                  const Icon = SocialIcons[key];
                  const isHovered = hoveredSocial === key;
                  return (
                    <motion.a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      onMouseEnter={() => setHoveredSocial(key)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      whileHover={{ y: -4, scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border"
                      style={{
                        background: isHovered ? `${hoverColor}18` : 'rgba(255,255,255,0.04)',
                        borderColor: isHovered ? `${hoverColor}50` : 'rgba(255,255,255,0.08)',
                        color: isHovered ? hoverColor : '#94a3b8',
                        boxShadow: isHovered ? `0 4px 16px ${hoverColor}25` : 'none',
                      }}
                    >
                      <Icon />
                      <span className="hidden sm:inline">{label}</span>
                    </motion.a>
                  );
                })}
              </div>

              {/* Contact mini block */}
              <div className="space-y-2.5">
                {[
                  { icon: Mail, text: import.meta.env.VITE_BRAND_EMAIL || 'hello@techdigi.in', href: `mailto:${import.meta.env.VITE_BRAND_EMAIL || 'hello@techdigi.in'}` },
                  { icon: Phone, text: import.meta.env.VITE_BRAND_PHONE || '+91 98765 43210', href: `tel:${(import.meta.env.VITE_BRAND_PHONE || '+91 98765 43210').replace(/[^0-9+]/g, '')}` },
                  { icon: MapPin, text: import.meta.env.VITE_BRAND_ADDRESS || 'Mumbai, India', href: null },
                ].map(({ icon: Icon, text, href }) => (
                  <div key={text}>
                    {href ? (
                      <a href={href} className="flex items-center gap-2 text-slate-500 hover:text-indigo-300 text-xs transition-colors group">
                        <Icon className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-300 flex-shrink-0" />
                        {text}
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Icon className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        {text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-5 flex items-center gap-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="w-4 h-px bg-indigo-500 inline-block" />
                Company
              </h5>
              <ul className="space-y-3">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}
                      className="text-slate-500 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 inline-block flex-shrink-0" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-5 flex items-center gap-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="w-4 h-px bg-purple-500 inline-block" />
                Services
              </h5>
              <ul className="space-y-3">
                {serviceLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}
                      className="text-slate-500 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 inline-block flex-shrink-0" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-4">
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-5 flex items-center gap-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="w-4 h-px bg-pink-500 inline-block" />
                Free Marketing Tips
              </h5>

              <div className="p-5 rounded-2xl mb-5 border border-indigo-500/12"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.04))' }}>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  🚀 Join <span className="text-white font-semibold">5,000+ entrepreneurs</span> who get our weekly digital growth playbook — free, every Monday.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.2)'}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    {subscribed ? (
                      <span className="flex items-center gap-2">✓ You're in! Welcome 🎉</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Subscribe — It's Free
                      </>
                    )}
                  </motion.button>
                </form>
                <p className="text-slate-600 text-[11px] mt-2 text-center">No spam. Unsubscribe anytime.</p>
              </div>

              {/* Trust badges row */}
              <div className="flex flex-wrap gap-2">
                {[
                  { emoji: '🔒', label: 'SSL Secured' },
                  { emoji: '🏆', label: 'Google Partner' },
                  { emoji: '⭐', label: '4.9 Rated' },
                  { emoji: '🇮🇳', label: 'Made in India' },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-slate-500 border border-slate-800/80"
                    style={{ background: 'rgba(255,255,255,0.025)' }}>
                    <span>{b.emoji}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="relative">
            {/* Gradient line */}
            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent)' }} />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
              {/* Left */}
              <p className="text-slate-600 text-xs text-center sm:text-left">
                © {new Date().getFullYear()}
                <span className="text-slate-500 font-semibold mx-1">Tech Digi</span>
                — All rights reserved. Made with ❤️ in India.
              </p>

              {/* Center — Legal links */}
              <div className="flex items-center gap-1 text-xs text-slate-700">
                <Link to="/privacy" className="hover:text-slate-400 transition-colors px-2 py-1 rounded hover:bg-slate-800/50">Privacy</Link>
                <span>·</span>
                <Link to="/terms" className="hover:text-slate-400 transition-colors px-2 py-1 rounded hover:bg-slate-800/50">Terms</Link>
                <span>·</span>
                <a href="/admin" className="hover:text-slate-400 transition-colors px-2 py-1 rounded hover:bg-slate-800/50">Admin</a>
              </div>

              {/* Right — Back to top */}
              <motion.button
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white border border-slate-800 hover:border-indigo-500/50 transition-all"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                ↑ Back to Top
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
