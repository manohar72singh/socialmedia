import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Target, BarChart2, CheckCircle2, TrendingUp, LogOut, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import ClientVault from '../components/ClientVault';
import ClientCalendar from '../components/ClientCalendar';

export default function ClientDashboard() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // Mock traffic data for chart
  const trafficData = [
    { month: 'Jan', traffic: 1200 },
    { month: 'Feb', traffic: 1800 },
    { month: 'Mar', traffic: 2400 },
    { month: 'Apr', traffic: 2200 },
    { month: 'May', traffic: 3100 },
    { month: 'Jun', traffic: 4500 },
  ];

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${username}`);
        if (res.ok) {
          const data = await res.json();
          // parse project details if string
          if (typeof data.project_details === 'string') {
            data.project_details = JSON.parse(data.project_details);
          }
          setClientData(data);
        } else {
          // Fallback if not found
          navigate('/client');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [username, navigate]);

  useEffect(() => {
    if (clientData?.id) {
      const fetchApprovalsAndInvoices = async () => {
        try {
          const [appRes, invRes, taskRes] = await Promise.all([
            fetch(`/api/approvals/client/${clientData.id}`),
            fetch(`/api/invoices/client/${clientData.email}`),
            fetch(`/api/tasks?client_id=${clientData.id}`)
          ]);
          if (appRes.ok) setApprovals(await appRes.json());
          if (invRes.ok) setInvoices(await invRes.json());
          if (taskRes.ok) setTasks(await taskRes.json());
        } catch (err) {
          console.error('Failed to fetch data', err);
        }
      };
      fetchApprovalsAndInvoices();
    }
  }, [clientData?.id]);

  const handleApprovalAction = async (id, status) => {
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Content ${status} successfully!`);
        setApprovals(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handlePayment = async (id) => {
    setIsPaying(true);
    const tId = toast.loading('Initializing secure payment gateway...');
    
    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        const res = await fetch(`/api/invoices/${id}/pay`, { method: 'PUT' });
        if (res.ok) {
          toast.success('Payment Successful! Thank you.', { id: tId });
          setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
        } else {
          toast.error('Payment failed', { id: tId });
        }
      } catch (err) {
        toast.error('Network Error', { id: tId });
      } finally {
        setIsPaying(false);
      }
    }, 2000); // 2 second mock delay
  };

  const handleDownloadPDF = async () => {
    const tId = toast.loading('Generating White-Label PDF Report...');
    try {
      const element = document.getElementById('report-content');
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0A0F1C' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${clientData.name}_Monthly_Report.pdf`);
      toast.success('Report downloaded successfully!', { id: tId });
    } catch (err) {
      toast.error('Failed to generate PDF', { id: tId });
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center text-white">Loading your dashboard...</div>;
  }

  if (!clientData) return null;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-4 md:p-8 font-['Inter']">
      <div className="max-w-6xl mx-auto space-y-8" id="report-content">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/50 p-6 rounded-3xl border border-slate-800" data-html2canvas-ignore>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Welcome back, {clientData.name}
            </h1>
            <p className="text-slate-400 mt-1">Here's your active campaign progress with Tech Digi.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors text-sm font-medium border border-indigo-500"
            >
              <Download size={16} /> Download Report
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-sm font-medium border border-slate-700"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 rounded-3xl border border-indigo-500/30 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px]"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-indigo-500/20 rounded-xl"><Target className="text-indigo-400" /></div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Project Status</p>
                <p className="text-xl font-bold text-white">{clientData.project_status}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl"><TrendingUp className="text-emerald-400" /></div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Traffic Growth</p>
                <p className="text-xl font-bold text-white">{clientData.project_details?.trafficGrowth || '+0%'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/20 rounded-xl"><BarChart2 className="text-pink-400" /></div>
              <div>
                <p className="text-slate-400 text-sm font-medium">SEO Health Score</p>
                <p className="text-xl font-bold text-white">{clientData.project_details?.seoScore || '0'}/100</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-[#1E293B] p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-indigo-400" /> Web Traffic Overview
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="traffic" stroke="#818cf8" strokeWidth={3} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Updates */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#1E293B] p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">Recent Updates</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1"><CheckCircle2 className="text-emerald-400" size={20}/></div>
                <div>
                  <h4 className="font-bold text-slate-200">Milestone Reached</h4>
                  <p className="text-sm text-slate-400 mt-1">{clientData.project_details?.recentMilestone || 'Campaign started'}</p>
                </div>
              </div>
              <div className="w-full h-px bg-slate-800"></div>
              <div className="flex gap-4">
                <div className="mt-1"><div className="w-5 h-5 rounded-full border-2 border-indigo-500"></div></div>
                <div>
                  <h4 className="font-bold text-slate-200">Next Steps</h4>
                  <p className="text-sm text-slate-400 mt-1">{clientData.project_details?.nextSteps || 'Reviewing analytics'}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Project Tracker (Kanban) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-[#1E293B] p-6 rounded-3xl border border-slate-800 shadow-xl" data-html2canvas-ignore>
          <h3 className="text-xl font-bold text-white mb-6">Project Progress Tracker</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 'todo', title: 'To Do', color: 'border-slate-700' },
              { id: 'in-progress', title: 'In Progress', color: 'border-blue-500/50' },
              { id: 'review', title: 'In Review', color: 'border-orange-500/50' },
              { id: 'done', title: 'Done', color: 'border-emerald-500/50' }
            ].map(col => (
              <div key={col.id} className={`bg-slate-800/50 rounded-2xl p-4 border ${col.color} min-h-[200px]`}>
                <h4 className="font-bold text-slate-300 text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === col.id).map(task => (
                    <div key={task.id} className="bg-slate-900 p-3 rounded-xl border border-slate-700 shadow-sm">
                      <p className="text-sm font-medium text-white">{task.title}</p>
                    </div>
                  ))}
                  {tasks.filter(t => t.status === col.id).length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-2">No tasks</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Approvals Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#1E293B] p-6 rounded-3xl border border-slate-800 shadow-xl" data-html2canvas-ignore>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Pending Approvals</h3>
            <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
              {approvals.filter(a => a.status === 'pending').length} Actions Required
            </span>
          </div>
          
          {approvals.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No content awaiting approval.</p>
          ) : (
            <div className="space-y-4">
              {approvals.map(app => (
                <div key={app.id} className="bg-slate-900 border border-slate-700 p-5 rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold">
                          {app.content_type}
                        </span>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold
                          ${app.status === 'pending' ? 'bg-orange-500/20 text-orange-400' : 
                            app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 
                            'bg-red-500/20 text-red-400'}`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-white">{app.title}</h4>
                    </div>
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprovalAction(app.id, 'approved')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleApprovalAction(app.id, 'changes_requested')}
                          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-700"
                        >
                          Request Changes
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-[#0A0F1C] p-4 rounded-xl text-sm text-slate-300 border border-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {(() => {
                      try {
                        const parsed = JSON.parse(app.content_details);
                        if (typeof parsed === 'object') return JSON.stringify(parsed, null, 2);
                        return parsed;
                      } catch {
                        return app.content_details;
                      }
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Invoices Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#1E293B] p-6 rounded-3xl border border-slate-800 shadow-xl" data-html2canvas-ignore>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Invoices & Billing</h3>
          </div>
          
          {invoices.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No invoices found.</p>
          ) : (
            <div className="space-y-4">
              {invoices.map(inv => (
                <div key={inv.id} className="bg-slate-900 border border-slate-700 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-white text-lg">${inv.amount} <span className="text-sm font-normal text-slate-400">for {inv.service_details}</span></h4>
                    <p className="text-sm text-slate-400 mt-1">Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {inv.status}
                    </span>
                    {inv.status !== 'Paid' && (
                      <button 
                        onClick={() => handlePayment(inv.id)}
                        disabled={isPaying}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                      >
                        {isPaying ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Password Vault Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <ClientVault clientId={clientData.id} />
        </motion.div>

        {/* Content Calendar Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <ClientCalendar clientId={clientData.id} />
        </motion.div>

      </div>
    </div>
  );
}
