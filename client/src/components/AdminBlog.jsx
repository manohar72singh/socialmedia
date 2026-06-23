import React, { useState } from 'react';
import { Save, Image as ImageIcon, Send, Clock, Tag, Sparkles, Calendar, Share2, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import ImageUpload from './ImageUpload';
import 'react-quill-new/dist/quill.snow.css';

export default function AdminBlog() {
  const [post, setPost] = useState({
    title: '',
    category: 'SEO',
    excerpt: '',
    content: '',
    image: '',
    status: 'published',
    scheduled_at: ''
  });

  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [socialPosts, setSocialPosts] = useState(null);
  const [isRepurposing, setIsRepurposing] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Please enter a topic first');

    setIsGenerating(true);
    const loadingToast = toast.loading('Gemini AI is writing your blog...');

    try {
      const res = await fetch('/api/blogs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (res.ok) {
        const data = await res.json();

        // Helper function to find a key regardless of case, and even if it's nested
        const findValue = (obj, keyToFind) => {
          for (let key in obj) {
            if (key.toLowerCase() === keyToFind.toLowerCase()) return obj[key];
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const nestedVal = findValue(obj[key], keyToFind);
              if (nestedVal) return nestedVal;
            }
          }
          return '';
        };

        const newTitle = findValue(data, 'title');
        const newExcerpt = findValue(data, 'excerpt') || findValue(data, 'summary');
        const newContent = findValue(data, 'content') || findValue(data, 'article') || findValue(data, 'body');
        const newImage = findValue(data, 'image') || findValue(data, 'coverImage') || findValue(data, 'url');

        setPost(prev => ({
          ...prev,
          title: newTitle || prev.title,
          excerpt: newExcerpt || prev.excerpt,
          content: newContent || prev.content,
          image: newImage || prev.image
        }));
        toast.success('Blog generated successfully!', { id: loadingToast });
        setTopic('');
      } else {
        toast.error('Failed to generate blog', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Network error while generating', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRepurpose = async () => {
    if (!post.title || !post.content) return toast.error('Generate or write a blog first');
    setIsRepurposing(true);
    const loadingToast = toast.loading('Generating social media posts...');
    try {
      const res = await fetch('/api/blogs/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: post.title, content: post.content })
      });
      if (res.ok) {
        const data = await res.json();
        setSocialPosts(data);
        toast.success('Social posts ready!', { id: loadingToast });
      } else {
        toast.error('Failed to generate', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Network error', { id: loadingToast });
    } finally {
      setIsRepurposing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.title || !post.content) return toast.error('Title and Content required');

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (res.ok) {
        toast.success(post.status === 'scheduled' ? 'Blog scheduled!' : 'Blog post published successfully!');
        setPost({ title: '', category: 'SEO', excerpt: '', content: '', image: '', status: 'published', scheduled_at: '' });
      } else {
        toast.error('Failed to publish');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  // Calculate SEO Score
  const getSEOScore = () => {
    let score = 0;
    if (post.title.length > 30) score += 20;
    if (post.excerpt.length > 50) score += 20;
    if (post.content.length > 300) score += 30;
    if (post.content.includes('<h2') || post.content.includes('<h3')) score += 15;
    if (post.image) score += 15;
    return score;
  };
  const seoScore = getSEOScore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Write New Article</h2>
          <p className="text-slate-400 text-sm">Publish SEO-optimized content to your blog.</p>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Send size={16} /> {post.status === 'scheduled' ? 'Schedule Post' : post.status === 'draft' ? 'Save Draft' : 'Publish Post'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-4">

          {/* AI Generator Panel */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-white flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-yellow-400" /> AI Auto-Blog Generator
            </h3>
            <p className="text-slate-400 text-sm mb-4">Enter a topic and let Gemini AI write a complete, SEO-optimized article for you in seconds.</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g., Top 10 SEO Trends for 2026..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="flex-1 bg-slate-900 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? 'Writing...' : 'Generate with AI'}
              </button>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl">
            <input
              type="text"
              placeholder="Article Title..."
              value={post.title}
              onChange={e => setPost(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-transparent text-3xl font-black text-white placeholder-slate-600 focus:outline-none mb-6 font-['Space_Grotesk']"
            />

            <div className="h-px w-full bg-slate-800 mb-6"></div>

            <div className="bg-slate-900 rounded-xl overflow-hidden border-none quill-wrapper">
              <ReactQuill
                theme="snow"
                value={post.content}
                onChange={(content) => setPost(prev => ({ ...prev, content }))}
                placeholder="Start writing your amazing article here..."
                className="text-slate-300"
                modules={{
                  toolbar: [
                    [{ 'header': [2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Tag size={18} className="text-indigo-400" /> Post Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select
                value={post.category}
                onChange={e => setPost(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="SEO">SEO</option>
                <option value="Social Media">Social Media</option>
                <option value="Paid Ads">Paid Ads</option>
                <option value="Web Design">Web Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cover Image</label>
              <ImageUpload 
                currentImage={post.image} 
                onUploadComplete={(url) => setPost(prev => ({ ...prev, image: url }))} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Excerpt (SEO)</label>
              <textarea
                rows={3}
                placeholder="Brief summary for search results..."
                value={post.excerpt}
                onChange={e => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Publish Status</label>
              <select
                value={post.status}
                onChange={e => setPost(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 mb-3"
              >
                <option value="published">Publish Now</option>
                <option value="draft">Save as Draft</option>
                <option value="scheduled">Schedule for Later</option>
              </select>
              {post.status === 'scheduled' && (
                <input
                  type="datetime-local"
                  value={post.scheduled_at}
                  onChange={e => setPost(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                />
              )}
            </div>

            <button onClick={handleSubmit} className="w-full py-2.5 flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700">
              <Save size={16} /> {post.status === 'scheduled' ? 'Confirm Schedule' : post.status === 'draft' ? 'Save as Draft' : 'Publish to Live'}
            </button>
          </div>

          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-emerald-400" /> SEO Analyzer
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-emerald-500 text-xl font-bold text-white">
                {seoScore}
              </div>
              <div className="text-sm text-slate-400">
                <p>Score out of 100</p>
                <p className="text-xs mt-1">{seoScore >= 80 ? 'Excellent! Ready to rank.' : 'Keep adding content, headings, and images.'}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Share2 size={18} className="text-pink-400" /> Repurpose Content
            </h3>
            <p className="text-xs text-slate-400">Turn this blog into ready-to-post social media content.</p>
            <button
              onClick={handleRepurpose}
              disabled={isRepurposing || !post.title}
              className="w-full py-2.5 flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50"
            >
              <Sparkles size={16} className="text-pink-400" /> {isRepurposing ? 'Generating...' : 'Generate Social Posts'}
            </button>

            {socialPosts && (
              <div className="mt-4 space-y-3">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <p className="text-xs font-bold text-blue-400 mb-1">LinkedIn</p>
                  <p className="text-xs text-slate-300 line-clamp-4">{socialPosts.linkedin}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <p className="text-xs font-bold text-slate-100 mb-1">Twitter / X</p>
                  <p className="text-xs text-slate-300 line-clamp-4">{socialPosts.twitter}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <p className="text-xs font-bold text-pink-500 mb-1">Instagram</p>
                  <p className="text-xs text-slate-300 line-clamp-4">{socialPosts.instagram}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
