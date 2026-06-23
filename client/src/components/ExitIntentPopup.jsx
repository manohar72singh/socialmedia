import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user already saw the popup in this session
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
        setHasTriggered(true);
        return;
    }

    const handleMouseLeave = (e) => {
      // Trigger when mouse moves out of the top of the window
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // We send this as a lead to our backend
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Free Guide Request',
          email,
          phone: '',
          service: 'Lead Magnet - Free SEO Guide',
          message: 'Requested the free SEO & Growth Guide from Exit Popup.'
        }),
      });

      if (res.ok) {
        toast.success('Awesome! Check your email for the guide.', {
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #22c55e'
          }
        });
        setIsVisible(false);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg p-8 overflow-hidden rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Decorative Gradient Blob */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--brand-primary,#6366f1)] rounded-full mix-blend-screen filter blur-[80px] opacity-50"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--brand-secondary,#a855f7)] rounded-full mix-blend-screen filter blur-[80px] opacity-50"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Wait! Don't leave empty-handed.
              </h2>
              <p className="text-gray-300 mb-6">
                Get our exclusive <span className="font-semibold text-white">"10x Growth & SEO Playbook"</span> delivered straight to your inbox. Free for a limited time.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Enter your best email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--brand-primary,#6366f1)] focus:ring-1 focus:ring-[var(--brand-primary,#6366f1)] transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-[var(--brand-primary,#6366f1)] to-[var(--brand-secondary,#a855f7)] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Me The Free Playbook'}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4">
                We respect your privacy. No spam, ever.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
