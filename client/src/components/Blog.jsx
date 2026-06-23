import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Tag, TrendingUp } from 'lucide-react';

const blogCategories = ['All', 'SEO', 'Social Media', 'Paid Ads', 'Web Design', 'AI & Tools'];



function BlogCard({ post, index, featured = false }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      layout
      whileHover={{ y: -6 }}
      className={`group rounded-[2rem] overflow-hidden flex flex-col ${featured ? 'md:flex-row' : ''}`}
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        transition: 'border-color 0.3s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = post.accentColor + '35'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'md:w-1/2 h-56 md:h-auto' : 'h-48'}`}>
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6 }}
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${post.gradient} opacity-70`} />
        <span className="absolute top-4 left-4 text-[11px] font-bold px-3 py-1 rounded-full text-white"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          {post.tag}
        </span>
      </div>

      {/* Content */}
      <div className={`p-6 sm:p-7 flex flex-col flex-1 ${featured ? 'justify-center' : ''}`}>
        {/* Category + Read time */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ color: post.accentColor, background: post.accentColor + '18', border: `1px solid ${post.accentColor}30` }}>
            <Tag className="w-2.5 h-2.5" />
            {post.category}
          </span>
          <span className="text-slate-600 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime || '5 min read'}
          </span>
        </div>

        <h3 className={`font-black text-white mb-2 leading-snug tracking-tight ${featured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {post.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 font-light flex-1">{post.excerpt}</p>

        {/* Author + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              {post.author?.emoji || '👨‍💼'}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">{post.author?.name || post.author || 'Admin'}</p>
              <p className="text-[10px] text-slate-600">{new Date(post.created_at || post.date || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <Link
            to={`/blog/${post.id}`}
            className="flex items-center gap-1.5 text-xs font-bold transition-colors group/link"
            style={{ color: post.accentColor }}
          >
            Read More
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        // Add random gradients for new posts without them
        const processed = data.map((post, i) => {
          const colors = ['#6366f1', '#ec4899', '#f59e0b', '#f97316', '#14b8a6'];
          const gradients = [
            'from-indigo-600/30 to-blue-600/20',
            'from-pink-600/30 to-rose-600/20',
            'from-yellow-600/30 to-orange-600/20',
            'from-orange-600/30 to-amber-600/20',
            'from-teal-600/30 to-cyan-600/20'
          ];
          return {
            ...post,
            accentColor: post.accentColor || colors[i % colors.length],
            gradient: post.gradient || gradients[i % gradients.length],
            tag: post.tag || 'News'
          };
        });
        setBlogPosts(processed);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = activeFilter === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeFilter);

  const [featured, ...rest] = filtered;

  return (
    <section id="blog" className="py-16 sm:py-20 lg:py-16 bg-[#020617] relative overflow-hidden">

      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-purple-600/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="section-label mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            Blog & Insights
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Free Marketing <span className="gradient-text">Knowledge</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Actionable guides, industry insights, and expert tactics — completely free.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14"
        >
          {blogCategories.map((cat) => {
            const active = activeFilter === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300"
                style={{
                  background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                  color: active ? 'white' : '#64748b',
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: active ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Featured Post (large) */}
        <AnimatePresence mode="popLayout">
          {featured && (
            <motion.div key={`featured-${featured.id}`} className="mb-6 lg:mb-8">
              <BlogCard post={featured} index={0} featured={true} />
            </motion.div>
          )}

          {/* Rest grid */}
          {rest.length > 0 && (
            <motion.div
              key="rest-grid"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {rest.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">No articles in this category yet.</div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl border border-indigo-500/15"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))' }}
        >
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              📩 Never Miss a Post
            </h3>
            <p className="text-slate-400 text-sm">Get new articles in your inbox every week — free.</p>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-white text-sm transition-all hover:shadow-[0_8px_24px_rgba(99,102,241,0.4)]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Subscribe Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
