import React, { useState, useEffect } from 'react';
import { Mail, Send, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNewsletter() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribers');
      const data = await res.json();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch subscribers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGenerate = async () => {
    const loadingToast = toast.loading('Gemini AI is reading your latest blogs and generating a newsletter...');
    try {
      const res = await fetch('/api/newsletter/auto-campaign', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSubject(data.subject);
        setContent(data.content);
        toast.success('Campaign generated!', { id: loadingToast });
      } else {
        toast.error('Not enough published blogs or API error', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Failed to generate campaign', { id: loadingToast });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !content) {
      setStatus({ type: 'error', message: 'Subject and Content are required.' });
      return;
    }
    if (subscribers.length === 0) {
      setStatus({ type: 'error', message: 'No subscribers to send to.' });
      return;
    }

    setSending(true);
    setStatus({ type: '', message: '' });

    try {
      // Create a mock API route for this if it doesn't exist, or we can assume it will exist
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content, recipients: subscribers.map(s => s.email) })
      });

      if (response.ok) {
        setStatus({ type: 'success', message: `Email campaign sent successfully to ${subscribers.length} subscribers!` });
        setSubject('');
        setContent('');
      } else {
        setStatus({ type: 'error', message: 'Failed to send campaign. Check server logs.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error while sending campaign.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Email Campaigns</h2>
          <p className="text-slate-400">Send updates to your newsletter subscribers.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAutoGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg"
          >
            <Sparkles size={16} /> Auto-Generate from Blogs
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <Mail className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">{subscribers.length}</span>
            <span className="text-sm text-slate-400">Subscribers</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <form onSubmit={handleSend} className="space-y-5">
          {status.message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Monthly SEO Updates from Tech Digi"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">HTML Content</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<h1>Hello!</h1><p>Here are the latest updates...</p>"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">You can use standard HTML tags to format your email.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={sending || subscribers.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/25"
            >
              {sending ? 'Sending Campaign...' : 'Send to All Subscribers'}
              {!sending && <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>

      {/* Subscriber List Preview */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="font-bold text-white">Active Subscribers</h3>
        </div>
        <div className="p-0 max-h-60 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-slate-400">Loading subscribers...</p>
          ) : subscribers.length === 0 ? (
            <p className="p-4 text-slate-400">No subscribers found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-700/50">
                {subscribers.map((sub, i) => (
                  <tr key={i} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-slate-300">{sub.email}</td>
                    <td className="px-4 py-3 text-slate-500 text-right">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
