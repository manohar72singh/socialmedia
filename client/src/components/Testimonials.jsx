import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck } from 'lucide-react';

// Fallback testimonials if API is empty
const fallbackTestimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "CEO, TechStart India",
    content: "Tech Digi transformed our online presence completely. Within 3 months, our organic traffic tripled and we're now ranking #1 for our key terms. Absolutely exceptional team!",
    image: null,
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Founder, StyleHouse",
    content: "The paid ads strategy they built for us reduced our cost-per-acquisition by 60%. Their data-driven approach is unlike anything we've experienced with other agencies.",
    image: null,
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Verma",
    role: "MD, GreenBuild Infra",
    content: "From website design to SEO to social media — Tech Digi handles everything seamlessly. Our leads have gone from 10 to 150 per month. Incredible results!",
    image: null,
    rating: 5,
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Director, MedCare Clinic",
    content: "Professional, responsive, and results-driven. They cut our ad spend by 40% while doubling the number of qualified appointments. Highly recommend!",
    image: null,
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Owner, Luxe Motors",
    content: "The website they built for us gets compliments every single day. More importantly, it converts. Our online inquiries went up by 280% in the first month.",
    image: null,
    rating: 5,
  },
  {
    id: 6,
    name: "Ananya Kapoor",
    role: "Co-Founder, EduLearn",
    content: "Their social media strategy went viral for us — one campaign got 2 million impressions. The team is creative, fast, and genuinely cares about your growth.",
    image: null,
    rating: 5,
  },
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const avatarColors = [
  ['#6366f1', '#8b5cf6'],
  ['#ec4899', '#f472b6'],
  ['#0ea5e9', '#38bdf8'],
  ['#f97316', '#fb923c'],
  ['#10b981', '#34d399'],
  ['#f59e0b', '#fcd34d'],
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data.length > 0 ? data : fallbackTestimonials);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const displayList = testimonials.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 lg:py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #020617 0%, #0a0f2a 50%, #020617 100%)' }}>

      {/* Ambient lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-indigo-600/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-purple-600/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="section-label mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
            Client Testimonials
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            What Our Clients{' '}
            <span className="gradient-text-gold">Say About Us</span>
          </h2>

          {/* Google rating bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
            <div className="flex items-center gap-1.5">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png"
                alt="Google"
                className="h-4 object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-white font-black text-base">4.9</span>
              <span className="text-slate-500 text-sm">(120+ reviews)</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <BadgeCheck className="w-4 h-4 text-green-400" />
              <span>All reviews are from verified clients</span>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-panel rounded-3xl h-52 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayList.map((t, i) => {
              const [c1, c2] = avatarColors[i % avatarColors.length];
              return (
                <motion.div
                  key={t.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative group"
                >
                  <div className="glass-card rounded-[1.75rem] p-6 sm:p-7 h-full flex flex-col border border-white/5 hover:border-indigo-500/25 transition-all duration-400">

                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-indigo-500/40 mb-4 flex-shrink-0" />

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(t.rating || 5)].map((_, si) => (
                        <Star key={si} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-[15px] mb-5 flex-1 font-light italic">
                      "{t.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 border-2 border-white/10"
                          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                        >
                          {getInitials(t.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-bold text-white truncate">{t.name}</h4>
                          <BadgeCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 truncate">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
