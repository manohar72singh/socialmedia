import React, { useState, useEffect } from 'react';
import { Settings, Save, Palette, Mail, Phone, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

export default function AdminSettings() {
  const { settings, fetchSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const tId = toast.loading('Saving global settings...');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Settings updated successfully!', { id: tId });
        await fetchSettings(); // Refresh global state
      } else {
        toast.error('Failed to save settings', { id: tId });
      }
    } catch (err) {
      toast.error('Network error', { id: tId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Settings className="text-indigo-400" /> Global Settings
        </h2>
        <p className="text-slate-400 text-sm">Manage website branding and contact details globally.</p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-6 shadow-xl">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
            <Building2 className="text-slate-400" size={20} /> Brand Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Agency Name</label>
              <input
                type="text"
                name="brand_name"
                value={formData.brand_name || ''}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-indigo-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Color Theme</label>
              <div className="relative">
                <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select
                  name="brand_color"
                  value={formData.brand_color || 'indigo'}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option value="indigo">Indigo (Default)</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="emerald">Emerald Green</option>
                  <option value="rose">Rose Red</option>
                  <option value="amber">Amber Yellow</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
            <Phone className="text-slate-400" size={20} /> Contact Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Public Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  name="brand_email"
                  value={formData.brand_email || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  name="brand_phone"
                  value={formData.brand_phone || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-700">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
