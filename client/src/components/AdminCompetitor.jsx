import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCompetitor() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return toast.error('Please enter a URL');
    
    setLoading(true);
    const tId = toast.loading('Scraping website & AI is analyzing SEO...');
    
    try {
      const res = await fetch('/api/competitor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
        toast.success('Analysis Complete', { id: tId });
      } else {
        toast.error(data.error || 'Failed to analyze', { id: tId });
      }
    } catch (err) {
      toast.error('Network Error', { id: tId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Search className="text-blue-400" /> AI Competitor Analyzer
        </h2>
        <p className="text-slate-400 text-sm">Spy on your competitors' SEO strategy and get actionable advice to outrank them.</p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl">
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="https://competitor-website.com" 
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Analyzing...' : 'Analyze Website'} <Zap size={16} />
          </button>
        </form>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">Scraped SEO Data</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Title Tag</p>
                <p className="text-sm text-slate-300 mt-1">{result.scrapedData.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">H1 Tag</p>
                <p className="text-sm text-slate-300 mt-1">{result.scrapedData.h1 || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Meta Description</p>
                <p className="text-sm text-slate-300 mt-1">{result.scrapedData.metaDescription || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-2xl p-6 border border-indigo-500/30">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-indigo-500/30 pb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" /> Gemini AI Strategy
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-xs text-emerald-400 uppercase font-bold flex items-center gap-1"><CheckCircle size={12}/> Strengths</p>
                <ul className="list-disc list-inside text-sm text-slate-300 mt-1">
                  {result.analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs text-rose-400 uppercase font-bold flex items-center gap-1"><ShieldAlert size={12}/> Weaknesses</p>
                <ul className="list-disc list-inside text-sm text-slate-300 mt-1">
                  {result.analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs text-amber-400 uppercase font-bold flex items-center gap-1"><Zap size={12}/> Keyword Opportunities</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.analysis.keyword_opportunities.map((k, i) => (
                    <span key={i} className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg border border-amber-500/20">{k}</span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-indigo-500/20">
                <p className="text-xs text-indigo-400 uppercase font-bold">Action Plan to Outrank</p>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result.analysis.action_plan}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
