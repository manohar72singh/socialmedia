import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPlanner() {
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    platform: 'Instagram',
    post_date: '',
    post_time: '',
    caption: '',
    image_url: ''
  });

  useEffect(() => {
    fetchPosts();
    fetchClients();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/calendar/admin');
      if(res.ok) setPosts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      if(res.ok) setClients(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Post scheduled successfully');
        setShowForm(false);
        fetchPosts();
        setFormData({...formData, caption: '', image_url: ''}); // keep client and date roughly same
      }
    } catch (err) {
      toast.error('Failed to schedule post');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this post?')) return;
    try {
      await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      fetchPosts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="text-pink-400" /> Social Media Content Planner
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Schedule Post</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Select Client</label>
              <select 
                value={formData.client_id}
                onChange={e => setFormData({...formData, client_id: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" required
              >
                <option value="">Choose...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Platform</label>
              <select 
                value={formData.platform}
                onChange={e => setFormData({...formData, platform: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" required
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Date</label>
              <input 
                type="date" 
                value={formData.post_date}
                onChange={e => setFormData({...formData, post_date: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Time</label>
              <input 
                type="time" 
                value={formData.post_time}
                onChange={e => setFormData({...formData, post_time: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Post Caption</label>
            <textarea 
              value={formData.caption}
              onChange={e => setFormData({...formData, caption: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24" 
              placeholder="Write the caption here... use #hashtags" required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Image/Video URL (Optional)</label>
            <input 
              type="text" 
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold">
            Schedule to Calendar
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col">
            {post.image_url ? (
              <div className="h-40 bg-slate-900 overflow-hidden">
                <img src={post.image_url} alt="Post creative" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <div className="h-20 bg-slate-900 flex items-center justify-center border-b border-slate-700">
                <span className="text-slate-600 text-sm font-medium">Text Only Post</span>
              </div>
            )}
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded font-bold">{post.platform}</span>
                  <div className="text-slate-400 text-xs mt-2 flex items-center gap-1"><Clock size={12}/> {new Date(post.post_date).toLocaleDateString()} at {post.post_time}</div>
                </div>
                {post.status === 'scheduled' && <span className="text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12}/> Pending</span>}
                {post.status === 'approved' && <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Approved</span>}
                {post.status === 'rejected' && <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Rejected</span>}
              </div>
              
              <div className="text-sm text-slate-300 mb-4 flex-1 line-clamp-3">
                {post.caption}
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-700 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500">Client</div>
                  <div className="text-sm font-bold text-white">{post.client_name}</div>
                </div>
                <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
            No posts scheduled yet.
          </div>
        )}
      </div>
    </div>
  );
}
