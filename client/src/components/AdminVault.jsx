import React, { useState, useEffect } from 'react';
import { Lock, Key, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVault() {
  const [credentials, setCredentials] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    fetchVault();
  }, []);

  const fetchVault = async () => {
    try {
      const res = await fetch('/api/vault/admin');
      if (res.ok) {
        setCredentials(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const toggleVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this credential?')) return;
    try {
      await fetch(`/api/vault/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      fetchVault();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Lock className="text-emerald-400" /> Decrypted Password Vault
        </h2>
      </div>
      <p className="text-slate-400 text-sm">Access secure client credentials. Passwords are AES-256 encrypted in the database.</p>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Platform</th>
              <th className="p-4 font-medium">Username</th>
              <th className="p-4 font-medium">Password</th>
              <th className="p-4 font-medium">Notes</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map(cred => (
              <tr key={cred.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="p-4">
                  <div className="font-bold text-white">{cred.client_name}</div>
                  <div className="text-xs text-slate-500">{cred.client_email}</div>
                </td>
                <td className="p-4 font-medium text-indigo-400 flex items-center gap-2">
                  <Key size={14} /> {cred.platform}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm font-mono">{cred.username}</span>
                    <button onClick={() => copyToClipboard(cred.username, 'Username')} className="text-slate-500 hover:text-white"><Copy size={14} /></button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono text-sm bg-emerald-500/10 px-2 py-1 rounded">
                      {visiblePasswords[cred.id] ? cred.password_decrypted : '••••••••••••'}
                    </span>
                    <button onClick={() => toggleVisibility(cred.id)} className="text-slate-500 hover:text-white">
                      {visiblePasswords[cred.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    {visiblePasswords[cred.id] && (
                      <button onClick={() => copyToClipboard(cred.password_decrypted, 'Password')} className="text-slate-500 hover:text-white">
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-4 text-xs text-slate-400 max-w-[150px] truncate" title={cred.notes}>
                  {cred.notes || '-'}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(cred.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {credentials.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">Vault is empty.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
