import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export default function PremiumBadge({ tier }) {
  if (!tier || tier === 'free') return null;

  const isEnterprise = tier === 'enterprise';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
        isEnterprise 
          ? 'border-yellow-400/50 bg-yellow-400/10 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' 
          : 'border-purple-400/50 bg-purple-400/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
      }`}
    >
      <Crown className="w-3.5 h-3.5" />
      {tier}
    </motion.div>
  );
}
