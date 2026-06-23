import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] bg-[#020617] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 relative"
          >
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-indigo-500/30 blur-[40px] rounded-full animate-pulse"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)] relative z-10">
              <span className="text-white font-black text-3xl leading-none">T</span>
            </div>
            <span className="text-4xl font-black tracking-tight text-white relative z-10">
              Tech <span className="text-indigo-400">Digi</span>
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-8"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
