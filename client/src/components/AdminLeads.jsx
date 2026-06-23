import React, { useState, useEffect } from 'react';
import { Download, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        toast.success('Leads refreshed');
      } else {
        toast.error('Failed to load leads');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const downloadCSV = () => {
    if (leads.length === 0) return toast.error('No leads to export');
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Service', 'Message', 'Date'];
    const csvRows = [headers.join(',')];
    
    leads.forEach(lead => {
      const values = [
        lead.id,
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone || ''}"`,
        `"${lead.service || ''}"`,
        `"${(lead.message || '').replace(/"/g, '""')}"`,
        new Date(lead.created_at).toISOString().split('T')[0]
      ];
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV Exported Successfully');
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.service && l.service.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Leads Management</h2>
          <p className="text-slate-400 text-sm">View, search, and export your captured leads.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchLeads} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[#1E293B] rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 bg-slate-800/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or service..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B1120] text-slate-400 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4 hidden md:table-cell">Message</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading && leads.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading leads data...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No leads found matching your search.</td></tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white">{lead.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <a href={`mailto:${lead.email}`} className="text-indigo-400 hover:underline">{lead.email}</a>
                        <span className="text-xs text-slate-500 mt-1">{lead.phone || 'No phone'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                        {lead.service || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell max-w-[200px] truncate text-slate-400" title={lead.message}>
                      {lead.message || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                      {new Date(lead.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
