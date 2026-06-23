import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Search, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);

  // Form State
  const [clientId, setClientId] = useState('');
  const [contentType, setContentType] = useState('Blog Post');
  const [title, setTitle] = useState('');
  const [contentDetails, setContentDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [appRes, clientsRes] = await Promise.all([
        fetch('/api/approvals'),
        fetch('/api/clients')
      ]);
      setApprovals(await appRes.json());
      setClients(await clientsRes.json());
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!clientId || !title || !contentDetails) return toast.error('Please fill all fields');
    
    setIsSubmitting(true);
    const tId = toast.loading('Sending to client...');

    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          content_type: contentType,
          title,
          content_details: contentDetails
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Sent to client for approval!', { id: tId });
        setShowNewForm(false);
        setTitle('');
        setContentDetails('');
        fetchData();
      } else {
        toast.error(data.error || 'Failed to send', { id: tId });
      }
    } catch (err) {
      toast.error('Network error', { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'changes_requested': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <FileCheck className="text-emerald-400" /> Client Approvals
          </h2>
          <p className="text-slate-400 text-sm">Send content to clients and track approval status.</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
        >
          {showNewForm ? 'Cancel' : <><Send size={16} /> Send New For Approval</>}
        </button>
      </div>

      {showNewForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Client</label>
              <select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 transition-colors"
                required
              >
                <option value="">-- Choose Client --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.company_name} ({c.name})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 transition-colors"
              >
                <option value="Blog Post">Blog Post</option>
                <option value="Ad Copy">Ad Copy</option>
                <option value="Social Media Post">Social Media Post</option>
                <option value="Email Newsletter">Email Newsletter</option>
                <option value="Strategy Document">Strategy Document</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title / Subject</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Q3 SEO Strategy Update"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content Details (Text or JSON)</label>
              <textarea
                value={contentDetails}
                onChange={e => setContentDetails(e.target.value)}
                rows="6"
                placeholder="Paste the content here for the client to review..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 transition-colors resize-none"
                required
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send to Client'}
            </button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading approvals...</p>
        </div>
      ) : approvals.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <FileCheck size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Approvals Yet</h3>
          <p className="text-slate-400 text-sm">Send content to your clients for review and approval.</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Content Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {approvals.map(app => (
                  <tr key={app.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{app.company_name}</p>
                      <p className="text-[10px] text-slate-500">{app.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate" title={app.title}>
                      {app.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                        {app.content_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
