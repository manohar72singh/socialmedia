import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, User, AlertCircle, Eye, X } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Appointment Bookings</h2>
          <p className="text-slate-400">View upcoming discovery calls scheduled by users.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-white">{bookings.length}</span>
          <span className="text-sm text-slate-400">Total</span>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    Loading appointments...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400 font-medium">No bookings yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white">{booking.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {booking.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold transition-colors border border-indigo-500/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View More Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Booking Details
              </h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Client Name</p>
                  <p className="text-lg font-semibold text-white">{selectedBooking.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${selectedBooking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {selectedBooking.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Email Address</p>
                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  {selectedBooking.email}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Appointment Date</p>
                  <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    {formatDate(selectedBooking.date)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Scheduled Time</p>
                  <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    {selectedBooking.time}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Booked On</p>
                <p className="text-sm text-slate-500 font-mono bg-slate-800/30 p-3 rounded-xl border border-slate-700/30 inline-block">
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-700 bg-slate-800/50 flex justify-end">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
