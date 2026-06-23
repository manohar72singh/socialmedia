import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar, User } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPost(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#020617] flex flex-col items-center justify-center text-center px-5">
        <h2 className="text-3xl font-black text-white mb-4">Blog Post Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md">The article you are looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pt-32 pb-20 bg-[#020617] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-5 sm:px-6 relative z-10 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>

        {/* Header */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {post.category || 'Article'}
            </span>
            <span className="text-slate-400 text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {post.title}
          </h1>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-white/5 inline-flex backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold">{post.author || 'Tech Digi Team'}</p>
              <p className="text-slate-400 text-sm">Digital Marketing Expert</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 sm:mb-16 border border-white/5 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-indigo max-w-none prose-lg">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-slate-300 leading-relaxed font-light" />
          ) : (
            <p className="text-slate-300 leading-relaxed font-light">{post.excerpt || 'No content provided.'}</p>
          )}
        </div>
      </div>
    </article>
  );
}
