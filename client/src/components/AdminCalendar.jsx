import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const PLATFORM_COLORS = {
  LinkedIn:  { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  Instagram: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30', dot: 'bg-pink-400' },
  Twitter:   { bg: 'bg-sky-500/20',  text: 'text-sky-300',  border: 'border-sky-500/30',  dot: 'bg-sky-400' },
  YouTube:   { bg: 'bg-red-500/20',  text: 'text-red-300',  border: 'border-red-500/30',  dot: 'bg-red-400' },
  Facebook:  { bg: 'bg-indigo-500/20',text: 'text-indigo-300',border:'border-indigo-500/30',dot:'bg-indigo-400' },
  default:   { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/30', dot: 'bg-violet-400' },
};

function getColor(platform) {
  return PLATFORM_COLORS[platform] || PLATFORM_COLORS.default;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function AdminCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [events, setEvents] = useState({}); // { 'YYYY-MM-DD': [event, ...] }
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [allEvents, setAllEvents] = useState([]); // flat list for agenda

  const prevMonth = () => {
    setViewDate(v => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { ...v, month: v.month - 1 };
    });
  };
  const nextMonth = () => {
    setViewDate(v => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: v.month + 1 };
    });
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Please enter a topic');
    setIsGenerating(true);
    const tId = toast.loading('Gemini AI is planning your 30-day calendar...');

    try {
      const res = await fetch('/api/calendar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();

      if (res.ok) {
        const newEvents = {};
        const flat = [];
        const base = new Date();

        data.forEach(item => {
          const d = new Date(base);
          d.setDate(base.getDate() + item.day);
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
          if (!newEvents[key]) newEvents[key] = [];
          newEvents[key].push(item);
          flat.push({ ...item, date: d, key });
        });

        setEvents(newEvents);
        setAllEvents(flat);

        // Jump to next month (where most events will be)
        const nextM = new Date(base);
        nextM.setDate(base.getDate() + 1);
        setViewDate({ year: nextM.getFullYear(), month: nextM.getMonth() });

        toast.success('30-Day Calendar Generated!', { id: tId });
      } else {
        toast.error(data.error || 'Failed to generate', { id: tId });
      }
    } catch {
      toast.error('Network Error', { id: tId });
    } finally {
      setIsGenerating(false);
    }
  };

  // Build calendar grid
  const { year, month } = viewDate;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const dayKey = (d) => d ? `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` : null;
  const selectedKey = selectedDay ? dayKey(selectedDay) : null;
  const selectedEvents = selectedKey ? (events[selectedKey] || []) : [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <CalendarDays className="text-violet-400" /> AI Content Calendar
          </h2>
          <p className="text-slate-400 text-sm">Generate 30 days of social media content instantly with Gemini AI.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="Topic (e.g. Digital Marketing 2026)"
            className="flex-1 md:w-72 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap shadow-lg shadow-violet-500/20"
          >
            <Sparkles size={15} /> {isGenerating ? 'Generating...' : 'Generate 30 Days'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ── Calendar Grid ── */}
        <div className="xl:col-span-2 bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {/* Month Nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-white font-bold text-base">
              {MONTHS[month]} {year}
            </h3>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-800">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-500 uppercase py-2.5 tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              const key = dayKey(day);
              const dayEvents = key ? (events[key] || []) : [];
              const isToday = key === todayKey;
              const isSelected = key === selectedKey;

              return (
                <div
                  key={idx}
                  onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                  className={`min-h-[80px] p-1.5 border-b border-r border-slate-800/60 transition-colors
                    ${day ? 'cursor-pointer hover:bg-slate-800/40' : ''}
                    ${isSelected ? 'bg-violet-500/10 border-violet-500/20' : ''}
                  `}
                >
                  {day && (
                    <>
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mb-1 mx-auto
                        ${isToday ? 'bg-violet-600 text-white' : isSelected ? 'bg-violet-500/30 text-violet-300' : 'text-slate-400'}
                      `}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((ev, i) => {
                          const c = getColor(ev.platform);
                          return (
                            <div key={i} className={`text-[9px] font-medium px-1 py-0.5 rounded truncate ${c.bg} ${c.text} border ${c.border}`}>
                              {ev.platform}: {ev.title?.slice(0, 18)}…
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-slate-500 pl-1">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="space-y-4">
          {/* Selected Day Detail */}
          <AnimatePresence mode="wait">
            {selectedDay && (
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-xl"
              >
                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Selected Day</p>
                    <h3 className="text-white font-bold text-lg">{MONTHS[month].slice(0,3)} {selectedDay}, {year}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <CalendarDays size={18} className="text-violet-400" />
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  {selectedEvents.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-6">No posts scheduled for this day.</p>
                  ) : (
                    selectedEvents.map((ev, i) => {
                      const c = getColor(ev.platform);
                      return (
                        <div key={i} className={`p-3 rounded-xl border ${c.bg} ${c.border}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                            <span className={`text-xs font-bold uppercase tracking-wide ${c.text}`}>{ev.platform}</span>
                            <span className="ml-auto text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{ev.type}</span>
                          </div>
                          <p className="text-white text-sm font-medium">{ev.title}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Agenda / Summary */}
          <div className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-slate-800">
              <p className="text-white font-bold">
                {allEvents.length > 0 ? `${allEvents.length} Posts Planned` : 'Content Agenda'}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {allEvents.length > 0 ? 'Click a day to see details' : 'Generate a calendar to see your posts'}
              </p>
            </div>
            {allEvents.length > 0 ? (
              <div className="p-3 space-y-1.5 max-h-72 overflow-y-auto">
                {/* Group by platform */}
                {Object.entries(
                  allEvents.reduce((acc, ev) => {
                    acc[ev.platform] = (acc[ev.platform] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([platform, count]) => {
                  const c = getColor(platform);
                  return (
                    <div key={platform} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${c.bg} ${c.border}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                        <span className={`text-sm font-medium ${c.text}`}>{platform}</span>
                      </div>
                      <span className={`text-xs font-bold ${c.text}`}>{count} posts</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={20} className="text-violet-400" />
                </div>
                <p className="text-slate-400 text-sm">Enter a topic above and click<br />"Generate 30 Days" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
