import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Plus, Clock, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDripCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [goal, setGoal] = useState('');

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/drip-campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!name || !targetAudience || !goal) return toast.error('All fields are required');

    setIsGenerating(true);
    const tId = toast.loading('AI is crafting your sequence...');

    try {
      const res = await fetch('/api/drip-campaigns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetAudience, goal })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Campaign generated successfully!', { id: tId });
        setShowForm(false);
        setName('');
        setTargetAudience('');
        setGoal('');
        fetchCampaigns();
      } else {
        toast.error(data.error || 'Failed to generate', { id: tId });
      }
    } catch (err) {
      toast.error('Network Error', { id: tId });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Mail className="text-indigo-400" /> AI Drip Campaigns
          </h2>
          <p className="text-slate-400 text-sm">Generate high-converting email sequences automatically.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20"
        >
          {showForm ? <ChevronUp size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel Generation' : 'New Campaign'}
        </button>
      </div>

      {/* Generation Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleGenerate} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. SEO Lead Nurture"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Local Dentists"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Goal</label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Book a strategy call"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles size={16} /></motion.div> Writing Sequence...</>
                  ) : (
                    <><Sparkles size={16} /> Generate 4-Part Sequence</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaigns List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <Mail size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Campaigns Yet</h3>
          <p className="text-slate-400 text-sm">Create your first AI drip campaign to nurture leads automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map(campaign => {
            const sequence = typeof campaign.sequence_data === 'string' 
              ? JSON.parse(campaign.sequence_data) 
              : campaign.sequence_data;
              
            const isExpanded = expandedId === campaign.id;

            return (
              <div key={campaign.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden transition-all">
                {/* Header Row */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : campaign.id)}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/30 transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                      {campaign.name}
                      <span className="bg-slate-700 text-slate-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
                        {campaign.status}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Audience: <span className="text-slate-300">{campaign.target_audience}</span> • Goal: <span className="text-slate-300">{campaign.goal}</span>
                    </p>
                  </div>
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-700">
                        <div className="space-y-4 mt-4">
                          {sequence && sequence.map((email, idx) => (
                            <div key={idx} className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                                      <Clock size={12} /> {email.delay}
                                    </span>
                                    <h4 className="font-medium text-white text-sm">Subject: {email.subject}</h4>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => copyToClipboard(email.body)}
                                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                                  title="Copy Email Body"
                                >
                                  <Copy size={16} />
                                </button>
                              </div>
                              <div className="bg-[#0A0F1C] p-4 rounded-lg text-sm text-slate-300 whitespace-pre-wrap border border-slate-800">
                                {email.body}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
