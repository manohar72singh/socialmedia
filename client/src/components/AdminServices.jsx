import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', icon: '', color: '' });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `/api/services/${formData.id}` : '/api/services';
    
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      fetchServices();
      setFormData({ id: null, title: '', description: '', icon: '', color: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (service) => {
    setFormData(service);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Services</h2>
        <button 
          onClick={() => { setFormData({ id: null, title: '', description: '', icon: '', color: '' }); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
          <h3 className="text-xl font-bold mb-4">{formData.id ? 'Edit Service' : 'Add New Service'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Icon (Lucide Name)</label>
                <input required type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="e.g. Search, Palette" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white h-24" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Color Gradient Classes</label>
              <input required type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} placeholder="e.g. from-blue-500 to-cyan-400" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">Save Service</button>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Icon</th>
              <th className="px-6 py-4">Color</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">No services found.</td></tr>
            ) : (
              services.map(s => (
                <tr key={s.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-white">{s.title}</td>
                  <td className="px-6 py-4">{s.icon}</td>
                  <td className="px-6 py-4">{s.color}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(s)} className="text-blue-400 hover:text-blue-300"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
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
