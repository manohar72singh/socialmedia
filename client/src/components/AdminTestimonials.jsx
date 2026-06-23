import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', role: '', content: '', image: '' });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `/api/testimonials/${formData.id}` : '/api/testimonials';
    
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      fetchTestimonials();
      setFormData({ id: null, name: '', role: '', content: '', image: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (t) => {
    setFormData(t);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Testimonials</h2>
        <button 
          onClick={() => { setFormData({ id: null, name: '', role: '', content: '', image: '' }); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
          <h3 className="text-xl font-bold mb-4">{formData.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Role/Company</label>
                <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Image URL</label>
              <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Content / Quote</label>
              <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white h-24" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">Save Testimonial</button>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">Loading...</td></tr>
            ) : testimonials.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">No testimonials found.</td></tr>
            ) : (
              testimonials.map(t => (
                <tr key={t.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{t.name}</td>
                  <td className="px-6 py-4">{t.role}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3 items-center">
                    <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300"><Edit2 size={16}/></button>
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
