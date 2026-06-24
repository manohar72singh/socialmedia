import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Users, Eye, MousePointerClick, Lock } from 'lucide-react';

const data = [
  { name: 'Jan', visitors: 4000, leads: 240, clicks: 2400 },
  { name: 'Feb', visitors: 5000, leads: 398, clicks: 2210 },
  { name: 'Mar', visitors: 6000, leads: 480, clicks: 2290 },
  { name: 'Apr', visitors: 5780, leads: 390, clicks: 2000 },
  { name: 'May', visitors: 8900, leads: 480, clicks: 2181 },
  { name: 'Jun', visitors: 11390, leads: 880, clicks: 2500 },
  { name: 'Jul', visitors: 14490, leads: 1300, clicks: 3100 },
];

export default function AdvancedAnalytics({ tier }) {
  const isPremium = tier === 'pro' || tier === 'enterprise';

  if (!isPremium) {
    return (
      <div className="premium-glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Unlock Advanced Analytics</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Upgrade to Pro or Enterprise to access deep campaign insights, conversion funnels, and real-time demographic data.
        </p>
      </div>
    );
  }

  return (
    <div className="premium-glass-panel rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-bold text-white">Advanced Campaign Analytics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Visitors', value: '14,490', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Qualified Leads', value: '1,300', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Avg CTR', value: '4.8%', icon: MousePointerClick, color: 'text-pink-400', bg: 'bg-pink-400/10' },
          { label: 'Conversion Rate', value: '8.9%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="h-80 bg-slate-900/50 border border-slate-700 p-4 rounded-xl">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Traffic vs Leads Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="h-80 bg-slate-900/50 border border-slate-700 p-4 rounded-xl">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Engagement Clicks</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                cursor={{ fill: '#334155', opacity: 0.4 }}
              />
              <Bar dataKey="clicks" fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
