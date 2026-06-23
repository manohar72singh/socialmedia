import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientCalendar({ clientId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (clientId) fetchPosts();
  }, [clientId]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/calendar/client/${clientId}`);
      if(res.ok) setPosts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`/api/calendar/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Post marked as ${status}`);
        fetchPosts();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-800 shadow-xl mt-8" data-html2canvas-ignore>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="text-pink-400" /> Upcoming Social Media Posts
          </h3>
          <p className="text-sm text-slate-400 mt-1">Review and approve content scheduled by our team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex flex-col shadow-lg">
            {post.image_url ? (
              <div className="h-48 bg-slate-800 relative">
                <img src={post.image_url} alt="Creative" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white text-xs px-2 py-1 rounded font-bold border border-slate-700">
                  {post.platform}
                </div>
              </div>
            ) : (
              <div className="h-16 bg-slate-800 flex items-center px-4 border-b border-slate-700">
                <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded font-bold">{post.platform}</span>
                <span className="ml-2 text-slate-500 text-xs">Text Only</span>
              </div>
            )}
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-3">
                <Clock size={12}/> Scheduled for {new Date(post.post_date).toLocaleDateString()} at {post.post_time}
              </div>
              
              <div className="text-sm text-slate-300 mb-6 flex-1 whitespace-pre-wrap">
                {post.caption}
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-700">
                {post.status === 'scheduled' ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(post.id, 'approved')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(post.id, 'rejected')}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                ) : (
                  <div className={`text-center py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2
                    ${post.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}
                  `}>
                    {post.status === 'approved' ? <><CheckCircle size={16} /> Approved by You</> : <><XCircle size={16} /> Needs Revision</>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
            No posts have been scheduled yet. Our team is working on your content calendar.
          </div>
        )}
      </div>
    </div>
  );
}
