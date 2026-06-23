import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, name: '', tagline: '', monthlyPrice: 0, yearlyPrice: 0, popular: false
  });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      toast.error('Failed to fetch pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `/api/pricing/${formData.id}` : '/api/pricing';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        toast.success(`Plan ${formData.id ? 'updated' : 'added'}`);
        setShowForm(false);
        fetchPlans();
      }
    } catch (err) {
      toast.error('Error saving plan');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      tagline: item.tagline,
      monthlyPrice: item.monthlyPrice,
      yearlyPrice: item.yearlyPrice,
      popular: item.popular
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await fetch(`/api/pricing/${id}`, { method: 'DELETE' });
      toast.success('Plan deleted');
      fetchPlans();
    } catch (err) {
      toast.error('Error deleting plan');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Pricing Plans</h2>
        <button 
          onClick={() => { setFormData({ id: null, name: '', tagline: '', monthlyPrice: 0, yearlyPrice: 0, popular: false }); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
          <h3 className="text-xl font-bold mb-4">{formData.id ? 'Edit Plan' : 'Add New Plan'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Plan Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Tagline</label>
                <input required type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Monthly Price (₹)</label>
                <input required type="number" value={formData.monthlyPrice} onChange={e => setFormData({...formData, monthlyPrice: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Yearly Price (₹)</label>
                <input required type="number" value={formData.yearlyPrice} onChange={e => setFormData({...formData, yearlyPrice: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="popular" checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-4 h-4" />
              <label htmlFor="popular" className="text-sm text-slate-300">Mark as "Most Popular"</label>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">Save Plan</button>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Plan Name</th>
              <th className="px-6 py-4">Monthly (₹)</th>
              <th className="px-6 py-4">Yearly (₹)</th>
              <th className="px-6 py-4">Popular</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center">Loading...</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center">No plans found.</td></tr>
            ) : (
              plans.map(p => (
                <tr key={p.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4">{p.monthlyPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">{p.yearlyPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">{p.popular ? '⭐ Yes' : 'No'}</td>
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
