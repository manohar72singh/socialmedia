import React, { useState, useEffect } from 'react';
import { FileSignature, Plus, Trash2, Eye, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProposals() {
  const [proposals, setProposals] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [newProp, setNewProp] = useState({
    client_id: '',
    title: '',
    price: '',
    content: '1. Services Included:\n\n2. Timeline:\n\n3. Terms & Conditions:\n'
  });

  useEffect(() => {
    fetchProposals();
    fetchClients();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await fetch('/api/proposals');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProposals(data);
      } else {
        setProposals([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProp.client_id || !newProp.title || !newProp.price) return;
    
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });
      if (res.ok) {
        toast.success('Proposal Created');
        setShowForm(false);
        setNewProp({ client_id: '', title: '', price: '', content: '1. Services Included:\n\n2. Timeline:\n\n3. Terms & Conditions:\n' });
        fetchProposals();
      }
    } catch (err) {
      toast.error('Failed to create proposal');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this proposal?')) return;
    try {
      await fetch(`/api/proposals/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      fetchProposals();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const copyLink = (id) => {
    const url = `${window.location.origin}/proposal/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Proposal Link Copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileSignature className="text-blue-400" /> Proposals & E-Signatures
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> New Proposal</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Select Client</label>
              <select 
                value={newProp.client_id}
                onChange={e => setNewProp({...newProp, client_id: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" required
              >
                <option value="">Choose...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Proposal Title</label>
              <input 
                type="text" 
                value={newProp.title}
                onChange={e => setNewProp({...newProp, title: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                placeholder="e.g. 6-Month SEO Campaign" required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Price ($)</label>
              <input 
                type="number" 
                value={newProp.price}
                onChange={e => setNewProp({...newProp, price: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                placeholder="2500" required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Proposal Terms & Content</label>
            <textarea 
              value={newProp.content}
              onChange={e => setNewProp({...newProp, content: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-48 font-mono text-sm" 
              required
            />
          </div>

          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold">
            Generate Proposal Link
          </button>
        </form>
      )}

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map(prop => (
              <tr key={prop.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="p-4">
                  <div className="font-medium text-white">{prop.client_name}</div>
                  <div className="text-xs text-slate-500">{prop.client_email}</div>
                </td>
                <td className="p-4 text-white">{prop.title}</td>
                <td className="p-4 text-emerald-400 font-bold">${prop.price}</td>
                <td className="p-4">
                  {prop.status === 'signed' ? (
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs uppercase font-bold tracking-wider">Signed</span>
                  ) : (
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs uppercase font-bold tracking-wider">Sent (Pending)</span>
                  )}
                </td>
                <td className="p-4 text-slate-400 text-sm">{new Date(prop.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => copyLink(prop.id)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Copy Link">
                      <Copy size={16} />
                    </button>
                    <a href={`/proposal/${prop.id}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="View">
                      <Eye size={16} />
                    </a>
                    <button onClick={() => handleDelete(prop.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {proposals.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">No proposals found. Create one to send to a client.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
