import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, MessageSquare, TrendingUp, Activity, BarChart2, SplitSquareHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminOverview({ setActiveTab }) {
  const [stats, setStats] = useState({ leads: [], services: [], testimonials: [] });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [leadsRes, servicesRes, testRes, analyticsRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/services'),
          fetch('/api/testimonials'),
          fetch('/api/analytics')
        ]);
        
        const leads = await leadsRes.json();
        const services = await servicesRes.json();
        const testimonials = await testRes.json();
        const analyticsData = await analyticsRes.json();

        setStats({ leads, services, testimonials });
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching overview stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Dashboard Overview</h2>
          <p className="text-slate-400">Welcome back to the Tech Digi CMS.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
          <Activity size={16} className="animate-pulse" />
          <span className="text-sm font-semibold">System Online</span>
        </div>
      </div>

      {loading || !analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-800 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Leads', value: analytics?.totals?.leads || 0, icon: Users, color: 'from-blue-500 to-cyan-400', tab: 'leads' },
              { title: 'Subscribers', value: analytics?.totals?.subscribers || 0, icon: MessageSquare, color: 'from-purple-500 to-pink-500', tab: 'newsletter' },
              { title: 'Portfolio Projects', value: analytics?.totals?.projects || 0, icon: Briefcase, color: 'from-emerald-500 to-teal-400', tab: 'portfolio' },
              { title: 'Total Views', value: analytics?.totals?.views || 0, icon: Activity, color: 'from-orange-500 to-red-500', tab: 'overview' },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveTab(card.tab)}
                  className="relative group cursor-pointer"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300`}></div>
                  <div className="relative bg-slate-800 p-6 rounded-2xl flex items-center justify-between border border-slate-700">
                    <div>
                      <p className="text-slate-400 text-sm font-medium mb-1">{card.title}</p>
                      <h3 className="text-3xl font-black text-white">{card.value}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Area Chart: Leads Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-400" /> Live Web Traffic (Last 7 Days)
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#fff' }}
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bar Chart: Services Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <BarChart2 size={18} className="text-emerald-400" /> Top Pages
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topPages || []} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="path" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={120} />
                    <RechartsTooltip 
                      cursor={{fill: '#334155', opacity: 0.4}}
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#fff' }}
                    />
                    <Bar dataKey="views" fill="#34d399" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Leads Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-pink-400" /> Recent Leads
              </h3>
              <button onClick={() => setActiveTab('leads')} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                View All →
              </button>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 uppercase font-medium text-xs">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Service Required</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {stats.leads.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-500">No recent leads.</td></tr>
                  ) : (
                    stats.leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                            {lead.service || 'General Inquiry'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* A/B Testing Simulator Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden lg:col-span-3 mt-6"
          >
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <SplitSquareHorizontal size={18} className="text-purple-400" /> A/B Testing Results (Hero Section)
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><SplitSquareHorizontal size={100} /></div>
                <h4 className="text-white font-bold mb-2">Variant A (Original)</h4>
                <p className="text-slate-400 text-sm mb-4">Dark theme with central CTA</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold text-white">4.2%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Conversion Rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 font-medium">1,240 Visitors</p>
                    <p className="text-slate-500 text-xs">52 Conversions</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-400"><TrendingUp size={100} /></div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold">Variant B (Challenger)</h4>
                  <span className="bg-indigo-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Winning</span>
                </div>
                <p className="text-indigo-200 text-sm mb-4">Animated hero with floating elements</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold text-indigo-400">7.8%</p>
                    <p className="text-xs text-indigo-300 uppercase tracking-wider font-bold mt-1">Conversion Rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 font-medium">1,265 Visitors</p>
                    <p className="text-slate-500 text-xs">98 Conversions</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
