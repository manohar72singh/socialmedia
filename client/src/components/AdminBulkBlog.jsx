import React, { useState } from 'react';
import { Sparkles, Layers, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBulkBlog() {
  const [topicsText, setTopicsText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBulkGenerate = async () => {
    const topics = topicsText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    
    if (topics.length === 0) return toast.error('Please enter at least one topic');
    if (topics.length > 10) return toast.error('Maximum 10 topics allowed at once');

    setIsGenerating(true);
    const loadingToast = toast.loading('Initiating Bulk Blog Generation...');

    try {
      const res = await fetch('/api/blogs/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics })
      });
      
      if (res.ok) {
        toast.success('Bulk generation started! Blogs will appear in drafts shortly.', { id: loadingToast, duration: 5000 });
        setTopicsText('');
      } else {
        toast.error('Failed to initiate bulk generation', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Network error', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Bulk AI Blog Generator</h2>
        <p className="text-slate-400 text-sm">Generate up to 10 fully SEO-optimized articles at once. They will be saved to your drafts.</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <Layers className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Enter Topics (1 per line)</h3>
            <p className="text-slate-400 text-xs">Maximum 10 topics per request to prevent API throttling.</p>
          </div>
        </div>

        <textarea 
          rows={10}
          value={topicsText}
          onChange={e => setTopicsText(e.target.value)}
          placeholder="Topic 1: SEO Trends 2026\nTopic 2: Ultimate Guide to Web Design\nTopic 3: Social Media Marketing Strategies..."
          className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors mb-4 font-mono resize-none shadow-inner"
          disabled={isGenerating}
        />

        <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-700">
           <div className="flex items-center gap-2 text-slate-400 text-sm">
             <CheckCircle size={16} className="text-emerald-400" />
             <span>{topicsText.split('\n').map(t => t.trim()).filter(t => t.length > 0).length} valid topics found</span>
           </div>
           <button 
             onClick={handleBulkGenerate}
             disabled={isGenerating}
             className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 flex items-center gap-2"
           >
             {isGenerating ? 'Generating in Background...' : '✨ Generate All Topics'}
           </button>
        </div>
      </div>
    </div>
  );
}
