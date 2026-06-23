import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight, ChevronLeft, User, Mail, Send, AlertCircle } from 'lucide-react';

export default function BookingCalendar() {
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Success
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Generate next 14 days
  const today = new Date();
  const availableDays = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Skip weekends
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      availableDays.push(d);
    }
  }

  // Standard working hours 10 AM to 5 PM
  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM'
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in your name and email.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
          time: selectedTime
        })
      });

      if (response.ok) {
        setStep(3); // Success
      } else {
        setError('Failed to book appointment. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 w-full flex flex-col h-[600px]">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col h-full"
          >
            <div className="mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" /> Select a Date & Time
              </h3>
              <p className="text-sm text-slate-400 mt-1">Book a 30-minute discovery call with our team.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
              {/* Date Selection */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">1. Pick a Day</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableDays.map((date, i) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected 
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="text-sm font-bold">
                          {date.getDate()} {date.toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-4">2. Pick a Time</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((time, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                            selectedTime === time
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-bold">{time}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-4 border-t border-white/10 mt-auto">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
          >
            <div className="mb-6 flex items-center gap-3">
              <button onClick={() => setStep(1)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-xl font-black text-white">Confirm Details</h3>
                <p className="text-sm text-slate-400 mt-1">Enter your info to secure your spot.</p>
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider mb-1">Your Selected Slot</p>
                <p className="text-white font-medium">{formatDate(selectedDate)} at {selectedTime}</p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4 flex-1">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email}
                  className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center h-full py-10"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Booking Confirmed!</h3>
            <p className="text-slate-400 max-w-sm mb-6 text-sm">
              We've sent a calendar invite to <strong>{email}</strong>. Our team is looking forward to speaking with you on {formatDate(selectedDate)} at {selectedTime}.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setSelectedDate(null);
                setSelectedTime(null);
                setName('');
                setEmail('');
              }}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 font-medium transition-colors"
            >
              Book another call
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
