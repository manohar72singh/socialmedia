import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Top Bar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1440px] px-4 sm:px-6 pt-3 sm:pt-5 flex justify-center pointer-events-none"
      >
        <nav
          className={`pointer-events-auto w-full max-w-5xl flex items-center justify-between rounded-2xl sm:rounded-full px-4 sm:px-7 py-3 transition-all duration-500 ${
            scrolled
              ? 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-xl'
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_14px_rgba(99,102,241,0.55)] group-hover:shadow-[0_0_22px_rgba(99,102,241,0.8)] transition-all">
              <span className="text-white font-black text-base leading-none">T</span>
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white whitespace-nowrap">
              Tech <span className="text-indigo-400">Digi</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {NAV_LINKS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative group transition-colors ${isActive ? 'text-white' : 'hover:text-white'}`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-500 rounded-full transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block shrink-0">
            <Link
              to="/contact"
              className="block px-5 py-2.5 bg-white text-indigo-900 rounded-full font-bold text-sm shadow-[0_0_18px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all"
            >
              Let's Talk
            </Link>
          </motion.div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 text-white hover:bg-slate-700 transition-all shrink-0"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[75vw] max-w-[280px] bg-slate-900 border-l border-slate-700/50 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                <Link to="/" className="text-white font-bold text-base">
                  Tech <span className="text-indigo-400">Digi</span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col px-6 py-6 gap-1 flex-1">
                {NAV_LINKS.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 + 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all text-base ${
                          isActive
                            ? 'text-white bg-indigo-500/20 border border-indigo-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* CTA */}
              <div className="px-6 pb-8">
                <Link
                  to="/contact"
                  className="block w-full text-center py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_28px_rgba(99,102,241,0.55)] transition-all"
                >
                  Let's Talk →
                </Link>
                <p className="text-center text-slate-600 text-xs mt-3">AI-Powered Marketing Agency</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
