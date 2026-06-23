import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Key, Mail, CheckCircle2, UserPlus, Building, Search, X, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [projectStatus, setProjectStatus] = useState('Onboarding');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !email || !username || !password) {
      return toast.error('Please fill all required fields');
    }

    setIsSubmitting(true);
    const tId = toast.loading('Creating client account...');

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password, project_status: projectStatus })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Client account created successfully!', { id: tId });
        setShowForm(false);
        setName(''); setEmail(''); setUsername(''); setPassword(''); setProjectStatus('Onboarding');
        fetchClients();
      } else {
        toast.error(data.error || 'Failed to create account', { id: tId });
      }
    } catch (err) {
      toast.error('Network Error', { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = (clientEmail, clientUser) => {
    const text = `Hey there! Your client portal is ready.\n\nLink: ${window.location.origin}/client\nEmail: ${clientEmail}\nUsername: ${clientUser}\n\nPlease login to track your campaign progress.`;
    navigator.clipboard.writeText(text);
    toast.success('Login details copied to clipboard!');
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <UserPlus className="text-blue-400" /> Client Accounts
          </h2>
          <p className="text-slate-400 text-sm">Manage client access to their dedicated portals.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Client Account'}
        </button>
      </div>

      {/* New Client Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreate} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company / Client Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. hello@acmecorp.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Login Username</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. acmecorp"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                    <span>Password</span>
                    <button type="button" onClick={generatePassword} className="text-blue-400 hover:text-blue-300 text-[10px]">Generate Random</button>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Initial Project Status</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 transition-colors"
                  >
                    <option value="Onboarding">Onboarding</option>
                    <option value="Active Campaign">Active Campaign</option>
                    <option value="Website Development">Website Development</option>
                    <option value="SEO Audit Phase">SEO Audit Phase</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input
          type="text"
          placeholder="Search clients by name, email, or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Clients List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <Users size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Clients Found</h3>
          <p className="text-slate-400 text-sm">Create client accounts to give them access to their portal.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <div key={client.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{client.name}</h3>
                    <p className="text-xs text-slate-400">@{client.username}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Mail size={14} className="text-slate-500" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={14} className="text-slate-500" />
                  <span className="truncate bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs border border-blue-500/20">{client.project_status}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-500">Joined {new Date(client.created_at).toLocaleDateString()}</span>
                <button
                  onClick={() => copyCredentials(client.email, client.username)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <Copy size={14} /> Copy Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
