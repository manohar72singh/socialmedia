import React from 'react';
import { motion } from 'framer-motion';

// Brand logos as SVG text badges (real-feel brand names)
const logosRow1 = [
  { name: "Google", color: "#4285F4" },
  { name: "Shopify", color: "#96bf48" },
  { name: "HubSpot", color: "#FF7A59" },
  { name: "Mailchimp", color: "#FFE01B" },
  { name: "Salesforce", color: "#00A1E0" },
  { name: "Stripe", color: "#635BFF" },
  { name: "Notion", color: "#ffffff" },
  { name: "Zapier", color: "#FF4A00" },
];

const logosRow2 = [
  { name: "Semrush", color: "#FF6B00" },
  { name: "Ahrefs", color: "#2563EB" },
  { name: "Canva", color: "#00C4CC" },
  { name: "Webflow", color: "#4353FF" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Slack", color: "#4A154B" },
  { name: "Asana", color: "#F06A6A" },
  { name: "Monday", color: "#F8485E" },
];

function LogoItem({ logo }) {
  return (
    <div className="flex-shrink-0 mx-6 sm:mx-8">
      <div
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/8 hover:border-white/20 transition-all duration-300 group cursor-default"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        {/* Color dot representing brand */}
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ background: logo.color, boxShadow: `0 0 8px ${logo.color}60` }}
        />
        <span className="text-slate-400 group-hover:text-slate-200 font-semibold text-sm transition-colors whitespace-nowrap"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {logo.name}
        </span>
      </div>
    </div>
  );
}

export default function ClientLogos() {
  return (
    <section className="py-14 sm:py-20 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #020617 0%, #0a0f2a 50%, #020617 100%)' }}>

      {/* Subtle top/bottom dividers */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
            Trusted By Industry Leaders
          </span>
          <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-md mx-auto">
            We've partnered with & helped businesses using tools trusted by the world's top brands
          </p>
        </motion.div>
      </div>

      {/* Row 1 — Left scroll */}
      <div className="relative overflow-hidden mb-4">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #020617 0%, transparent 100%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #020617 0%, transparent 100%)' }} />

        <div className="animate-marquee-left flex">
          {[...logosRow1, ...logosRow1].map((logo, i) => (
            <LogoItem key={`r1-${i}`} logo={logo} />
          ))}
        </div>
      </div>

      {/* Row 2 — Right scroll */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #020617 0%, transparent 100%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #020617 0%, transparent 100%)' }} />

        <div className="animate-marquee-right flex">
          {[...logosRow2, ...logosRow2].map((logo, i) => (
            <LogoItem key={`r2-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
