import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, name: '', role: '', emoji: '', bio: '', linkedin: '', gradient: '', bgColor: ''
  });

  useEffect(() => { fetchTeam(); }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      toast.error('Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `/api/team/${formData.id}` : '/api/team';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        toast.success(`Team member ${formData.id ? 'updated' : 'added'}`);
        setShowForm(false);
        fetchTeam();
      }
    } catch (err) {
      toast.error('Error saving team member');
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' });
      toast.success('Deleted successfully');
      fetchTeam();
    } catch (err) {
      toast.error('Error deleting');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Team</h2>
        <button 
          onClick={() => { setFormData({ id: null, name: '', role: '', emoji: '', bio: '', linkedin: '', gradient: '', bgColor: '' }); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
          <h3 className="text-xl font-bold mb-4">{formData.id ? 'Edit Member' : 'Add New Member'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Role</label>
                <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Emoji (e.g. 👨‍💼)</label>
                <input required type="text" value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">LinkedIn URL</label>
                <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Bio</label>
              <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white h-24" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">Save Member</button>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Emoji</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">Loading...</td></tr>
            ) : team.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">No team members found.</td></tr>
            ) : (
              team.map(t => (
                <tr key={t.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-2xl">{t.emoji}</td>
                  <td className="px-6 py-4 font-medium text-white">{t.name}</td>
                  <td className="px-6 py-4">{t.role}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300 mr-3"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
