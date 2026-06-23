import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Key, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientVault({ clientId }) {
  const [credentials, setCredentials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    username: '',
    password: '',
    notes: ''
  });

  useEffect(() => {
    if (clientId) fetchCredentials();
  }, [clientId]);

  const fetchCredentials = async () => {
    try {
      const res = await fetch(`/api/vault/client/${clientId}`);
      if (res.ok) {
        setCredentials(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.platform || !formData.username || !formData.password) return;

    try {
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, client_id: clientId })
      });
      if (res.ok) {
        toast.success('Credential encrypted and saved securely!');
        setFormData({ platform: '', username: '', password: '', notes: '' });
        setShowForm(false);
        fetchCredentials();
      } else {
        toast.error('Failed to save credential');
      }
    } catch (err) {
      toast.error('Network Error');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this credential permanently?')) return;
    try {
      await fetch(`/api/vault/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      fetchCredentials();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-800 shadow-xl" data-html2canvas-ignore>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="text-indigo-400" /> Secure Password Vault
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Share your Facebook/Instagram/Website logins securely using AES-256 encryption. Only your agency admin can decrypt them.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add Login</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-4 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
            <ShieldCheck size={18} /> Data is encrypted end-to-end before saving.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Platform / Website</label>
              <input 
                type="text" 
                value={formData.platform}
                onChange={e => setFormData({...formData, platform: e.target.value})}
                placeholder="e.g. Facebook Ads Manager" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Username / Email</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                required 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                required 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">Notes (Optional)</label>
              <input 
                type="text" 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="e.g. Needs 2FA code" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">
            Encrypt & Save Credential
          </button>
        </form>
      )}

      {credentials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {credentials.map(cred => (
            <div key={cred.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Key size={14} className="text-indigo-400" /> {cred.platform}
                  </h4>
                  <button onClick={() => handleDelete(cred.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-1">User: <span className="text-slate-300">{cred.username}</span></p>
                <p className="text-xs text-emerald-400 font-mono bg-emerald-500/10 inline-block px-2 py-0.5 rounded">Password Encrypted</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-2xl">
          No passwords saved yet.
        </div>
      )}
    </div>
  );
}
