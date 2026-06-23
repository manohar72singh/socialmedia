import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function TeamCard({ member }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="relative"
      style={{ perspective: '1200px', height: '320px' }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 rounded-[2rem] flex flex-col items-center justify-center p-8 cursor-pointer select-none"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
          onClick={() => setFlipped(true)}
        >
          {/* Avatar circle */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 bg-gradient-to-br ${member.gradient} shadow-2xl`}
            style={{ boxShadow: `0 12px 40px ${member.bgColor}` }}
          >
            {member.emoji}
          </div>

          <h3 className="text-lg font-black text-white mb-1 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {member.name}
          </h3>
          <p className="text-sm font-semibold mb-4 text-center px-2 py-1 rounded-full"
            style={{ color: '#a5b4fc', background: 'rgba(99,102,241,0.12)' }}>
            {member.role}
          </p>

          {/* Quick stats */}
          <div className="flex gap-4 mt-2">
            {Object.entries(member.stats).map(([k, v]) => (
              <div key={k} className="text-center">
                <div className="text-sm font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{v}</div>
                <div className="text-[10px] text-slate-500 capitalize">{k}</div>
              </div>
            ))}
          </div>

          {/* Hint to flip */}
          <p className="absolute bottom-4 text-[11px] text-slate-600">Tap to see bio →</p>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 rounded-[2rem] flex flex-col justify-between p-7 cursor-pointer select-none"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: member.bgColor,
            border: `1px solid ${member.bgColor.replace('0.15', '0.35')}`,
            backdropFilter: 'blur(20px)',
          }}
          onClick={() => setFlipped(false)}
        >
          <div>
            <h3 className="text-base font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {member.name}
            </h3>
            <p className={`text-xs font-bold mb-4 gradient-text`}>{member.role}</p>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 font-light">{member.bio}</p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1.5">
              {member.specialties.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 border border-white/15"
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* LinkedIn + flip back */}
          <div className="flex items-center justify-between">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 text-xs font-bold text-blue-300 hover:text-blue-200 transition-colors"
            >
              <LinkedInIcon />
              LinkedIn Profile
            </a>
            <button onClick={() => setFlipped(false)} className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
              ← Flip back
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team');
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section id="team" className="py-16 sm:py-20 lg:py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #020617 0%, #080d1f 100%)' }}>

      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-indigo-600/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-purple-600/6 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="section-label mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
            Meet The Team
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            The Experts Behind <span className="gradient-text">Your Growth</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light">
            A team of passionate specialists — each a master in their field. <br className="hidden sm:block" />
            <span className="text-slate-500 text-sm">💡 Tap any card to flip and read their story</span>
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>

        {/* Join the team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14 sm:mt-20 p-6 sm:p-8 rounded-3xl border border-indigo-500/15 max-w-2xl mx-auto"
          style={{ background: 'rgba(99, 102, 241, 0.05)' }}
        >
          <div className="text-3xl mb-3">🤝</div>
          <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Want to Join Our Team?
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            We're always looking for talented people who are passionate about digital growth. Send us your portfolio!
          </p>
          <a
            href="mailto:careers@techdigi.in"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all hover:shadow-[0_8px_24px_rgba(99,102,241,0.4)]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Apply Now
          </a>
        </motion.div>

      </div>
    </section>
  );
}
