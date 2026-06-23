import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = '919876543210'; // 🔧 Apna number yahan daalo (91 + 10 digit)
const PRE_FILLED_MESSAGE = "Hi! I found your website and I'm interested in growing my business with Tech Digi. Can we talk?";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  // Show button after 2s, show tooltip after 5s
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 2000);
    const t2 = setTimeout(() => {
      setShowTooltip(true);
      // Hide tooltip after 4s
      setTimeout(() => setShowTooltip(false), 4000);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Pulse every 8 seconds to grab attention
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setPulseCount(c => c + 1);
      setTimeout(() => setPulseCount(0), 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRE_FILLED_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[50] flex flex-col items-end gap-2">

          {/* Tooltip bubble */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-[180px]"
              >
                <div className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-white leading-snug shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #075e54, #128c7e)',
                    boxShadow: '0 8px 24px rgba(18, 140, 126, 0.4)',
                  }}>
                  👋 Chat with us on WhatsApp — get a free reply in minutes!
                </div>
                {/* Arrow pointing down-right */}
                <div className="absolute -bottom-2 right-6 w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '8px solid #128c7e',
                  }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={handleClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="Chat on WhatsApp"
            className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl focus:outline-none"
            style={{
              background: 'linear-gradient(135deg, #25d366, #128c7e)',
              boxShadow: '0 8px 32px rgba(37, 211, 102, 0.45)',
            }}
            whileHover={{ scale: 1.12, boxShadow: '0 12px 40px rgba(37, 211, 102, 0.65)' }}
            whileTap={{ scale: 0.92 }}
          >
            {/* Pulsing ring animation */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(37, 211, 102, 0.4)' }}
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(37, 211, 102, 0.25)' }}
              animate={{ scale: [1, 1.8, 1.8], opacity: [0.4, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
            />

            {/* WhatsApp SVG Icon */}
            <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </motion.button>

          {/* "Chat Now" label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-[10px] font-bold text-slate-500 ml-1 tracking-wide uppercase"
          >
            Chat Now
          </motion.span>
        </div>
      )}
    </AnimatePresence>
  );
}
