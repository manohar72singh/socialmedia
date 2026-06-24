import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Copy, Check, Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIContentGenerator({ tier, clientId }) {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('ad_copy');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const isPremium = tier === 'pro' || tier === 'enterprise';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai-tools/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type, clientId, tier })
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setResult(data.content);
      }
    } catch (err) {
      toast.error('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isPremium) {
    return (
      <div className="premium-glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Unlock AI Content Generator</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Upgrade to Pro or Enterprise to generate high-converting ad copy, blog outlines, and social media captions in seconds.
        </p>
        <button className="btn-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="premium-glass-panel rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">AI Content Generator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Content Type</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ad_copy', label: 'Ad Copy' },
              { id: 'blog_outline', label: 'Blog Outline' },
              { id: 'social_caption', label: 'Social Caption' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  type === t.id 
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">What should we write about?</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A Facebook ad for a new AI marketing tool targeting small business owners..."
            className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {loading ? 'Generating...' : 'Generate Content'}
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Generated Result:</h3>
              <button
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
