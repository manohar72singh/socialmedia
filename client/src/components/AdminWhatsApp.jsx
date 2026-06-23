import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminWhatsApp() {
  const [template, setTemplate] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchTemplate();
    fetchLeads();
  }, []);

  const fetchTemplate = async () => {
    try {
      const res = await fetch('/api/whatsapp/template');
      const data = await res.json();
      setTemplate(data.template);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleBulkSend = async () => {
    setIsSending(true);
    const toastId = toast.loading('Simulating WhatsApp broadcast...');
    try {
      const res = await fetch('/api/whatsapp/send-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { id: toastId });
        fetchLeads(); // refresh statuses
      } else {
        toast.error(data.message || 'Failed to send', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error', { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  const unSentCount = leads.filter(l => !l.whatsapp_sent).length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">WhatsApp Automation</h2>
          <p className="text-slate-400 text-sm">Send automated Welcome Messages to your leads on WhatsApp.</p>
        </div>
        <button 
          onClick={handleBulkSend}
          disabled={isSending || unSentCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#25D366]/20 disabled:opacity-50"
        >
          <Send size={16} /> Send to Pending ({unSentCount})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <MessageCircle size={18} className="text-[#25D366]" /> Message Template
            </h3>
            <textarea
              rows={6}
              value={template}
              onChange={e => setTemplate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#25D366] resize-none"
            />
            <p className="text-xs text-slate-500 mt-2">Available tags: {'{{name}}, {{service}}'}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="font-bold text-white">Lead Broadcast Status</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 font-medium text-xs">
                  <tr>
                    <th className="px-6 py-4">Lead Name</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">WhatsApp Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr><td colSpan="3" className="px-6 py-8 text-center">Loading...</td></tr>
                  ) : leads.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-500">No leads found.</td></tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                        <td className="px-6 py-4">{lead.phone || 'N/A'}</td>
                        <td className="px-6 py-4">
                          {lead.whatsapp_sent ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] text-xs font-semibold">
                              <CheckCircle2 size={12} /> Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-semibold">
                              <AlertCircle size={12} /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
