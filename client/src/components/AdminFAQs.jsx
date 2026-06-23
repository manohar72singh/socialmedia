import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, question: '', answer: '', category: 'general' });

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      toast.error('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `/api/faqs/${formData.id}` : '/api/faqs';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        toast.success(`FAQ ${formData.id ? 'updated' : 'added'}`);
        setShowForm(false);
        fetchFaqs();
      }
    } catch (err) {
      toast.error('Error saving FAQ');
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      toast.success('FAQ deleted');
      fetchFaqs();
    } catch (err) {
      toast.error('Error deleting FAQ');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage FAQs</h2>
        <button 
          onClick={() => { setFormData({ id: null, question: '', answer: '', category: 'general' }); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
          <h3 className="text-xl font-bold mb-4">{formData.id ? 'Edit FAQ' : 'Add New FAQ'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Question</label>
              <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white">
                <option value="general">General</option>
                <option value="pricing">Pricing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Answer</label>
              <textarea required value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white h-24" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">Save FAQ</button>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Question</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr><td colSpan="3" className="px-6 py-8 text-center">Loading...</td></tr>
            ) : faqs.length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-8 text-center">No FAQs found.</td></tr>
            ) : (
              faqs.map(f => (
                <tr key={f.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-white max-w-sm truncate">{f.question}</td>
                  <td className="px-6 py-4 capitalize">{f.category}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(f)} className="text-blue-400 hover:text-blue-300 mr-3"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(f.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
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
