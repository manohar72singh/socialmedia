import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';

export default function AdminPortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, category: '', title: '', industry: '', tag: '', 
    description: '', image: '', metrics: [], gradient: '', accentColor: '', duration: '' 
  });

  useEffect(() => { fetchPortfolio(); }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolio(data);
    } catch (err) {
      toast.error('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `/api/portfolio/${formData.id}` : '/api/portfolio';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        toast.success(`Portfolio ${formData.id ? 'updated' : 'added'}`);
        setShowForm(false);
        fetchPortfolio();
      }
    } catch (err) {
      toast.error('Error saving portfolio');
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      toast.success('Project deleted');
      fetchPortfolio();
    } catch (err) {
      toast.error('Error deleting project');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Portfolio</h2>
        <button 
          onClick={() => { setFormData({ id: null, category: '', title: '', industry: '', tag: '', description: '', image: '', metrics: [], gradient: '', accentColor: '', duration: '' }); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
          <h3 className="text-xl font-bold mb-4">{formData.id ? 'Edit Project' : 'Add New Project'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Industry</label>
                <input type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Tag (e.g., 🚀 300% Growth)</label>
                <input type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div>
              <ImageUpload 
                currentImage={formData.image} 
                onUploadComplete={(url) => setFormData({ ...formData, image: url })} 
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white h-24" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">Save Project</button>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">Loading...</td></tr>
            ) : portfolio.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">No projects found.</td></tr>
            ) : (
              portfolio.map(p => (
                <tr key={p.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4"><img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" /></td>
                  <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300 mr-3"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
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
