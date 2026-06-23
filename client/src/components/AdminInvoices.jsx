import React, { useState, useEffect } from 'react';
import { CreditCard, FileText, Plus, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ client_name: '', client_email: '', service_details: '', amount: '', due_date: '' });

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      setInvoices(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const tId = toast.loading('Creating invoice...');
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Invoice created!', { id: tId });
        setShowModal(false);
        setFormData({ client_name: '', client_email: '', service_details: '', amount: '', due_date: '' });
        fetchInvoices();
      } else {
        toast.error('Failed to create', { id: tId });
      }
    } catch (err) {
      toast.error('Error', { id: tId });
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/invoices/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      toast.success(`Marked as ${status}`);
      fetchInvoices();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <CreditCard className="text-emerald-500" /> Billing & Invoices
          </h2>
          <p className="text-slate-400 text-sm">Manage client payments and generate invoices.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all"
        >
          <Plus size={16} /> New Invoice
        </button>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center">Loading...</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{inv.client_name}</p>
                    <p className="text-xs text-slate-500">{inv.client_email}</p>
                  </td>
                  <td className="px-6 py-4 text-xs">{inv.service_details}</td>
                  <td className="px-6 py-4 font-bold text-white">${inv.amount}</td>
                  <td className="px-6 py-4">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {inv.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold"><CheckCircle2 size={12}/> Paid</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded text-xs font-bold"><Clock size={12}/> Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {inv.status === 'Pending' && (
                      <button onClick={() => updateStatus(inv.id, 'Paid')} className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded transition-colors">Mark Paid</button>
                    )}
                    <button className="text-xs px-3 py-1 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded transition-colors flex items-center gap-1 inline-flex"><FileText size={12}/> PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1E293B] p-6 rounded-2xl w-full max-w-md border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Create Invoice</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="Client Name" required value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm" />
              <input type="email" placeholder="Client Email" required value={formData.client_email} onChange={e => setFormData({...formData, client_email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm" />
              <input type="text" placeholder="Service Details" required value={formData.service_details} onChange={e => setFormData({...formData, service_details: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm" />
              <input type="number" placeholder="Amount ($)" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm" />
              <input type="date" required value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 text-sm" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-800 text-white rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-bold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
