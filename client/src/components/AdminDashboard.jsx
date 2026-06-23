import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import AdminOverview from './AdminOverview';
import AdminServices from './AdminServices';
import AdminTestimonials from './AdminTestimonials';
import AdminLeads from './AdminLeads';
import AdminBlog from './AdminBlog';
import AdminPortfolio from './AdminPortfolio';
import AdminTeam from './AdminTeam';
import AdminPricing from './AdminPricing';
import AdminFAQs from './AdminFAQs';
import AdminNewsletter from './AdminNewsletter';
import AdminBookings from './AdminBookings';
import AdminBulkBlog from './AdminBulkBlog';
import AdminWhatsApp from './AdminWhatsApp';
import AdminImageGen from './AdminImageGen';
import AdminCalendar from './AdminCalendar';
import AdminInvoices from './AdminInvoices';
import AdminCompetitor from './AdminCompetitor';
import AdminDripCampaigns from './AdminDripCampaigns';
import AdminApprovals from './AdminApprovals';
import AdminTasks from './AdminTasks';
import AdminProposals from './AdminProposals';
import AdminVault from './AdminVault';
import AdminPlanner from './AdminPlanner';
import AdminClients from './AdminClients';
import AdminSettings from './AdminSettings';

import {
  LayoutDashboard, Users, Mail, CalendarDays, FileText, Layers,
  MessageCircle, Image, Search, CreditCard, Briefcase, FolderOpen,
  UserRound, DollarSign, HelpCircle, Star, MessageSquare, LogOut,
  ChevronRight, Zap, Menu, X, Sparkles, Calendar, Receipt, FileCheck, UserPlus, Settings, Target, CheckCircle, ShieldCheck
} from 'lucide-react';

// ─── Sidebar Config ───────────────────────────────────────────────
const navGroups = [
  {
    label: null,
    items: [
      { id: 'overview',    label: 'Dashboard',       icon: LayoutDashboard, color: 'indigo' },
    ]
  },
  {
    label: 'MARKETING',
    items: [
      { id: 'leads',       label: 'Leads & CRM',     icon: Users,           color: 'blue' },
      { id: 'newsletter',  label: 'Email Campaigns',  icon: Mail,            color: 'pink' },
      { id: 'drip',        label: 'Drip Sequences',  icon: Sparkles,        color: 'purple' },
    ]
  },
  {
    label: 'CLIENT PORTAL',
    items: [
      { id: 'clients',     label: 'Client Accounts',  icon: UserPlus,        color: 'blue' },
      { id: 'approvals',   label: 'Client Approvals', icon: FileCheck,       color: 'orange' },
      { id: 'bookings',    label: 'Bookings',         icon: Calendar,        color: 'cyan' },
      { id: 'invoices',    label: 'Invoices & Billing', icon: Receipt,       color: 'emerald' },
      { id: 'proposals',   label: 'Proposals & E-Sign', icon: FileCheck,     color: 'purple' },
      { id: 'tasks',       label: 'Project Tasks',    icon: CheckCircle,     color: 'blue' },
      { id: 'planner',     label: 'Content Planner',  icon: Calendar,        color: 'pink' },
      { id: 'vault',       label: 'Password Vault',   icon: ShieldCheck,     color: 'emerald' },
    ]
  },
  {
    label: 'WEBSITE CONTENT',
    items: [
      { id: 'blog',        label: 'Blog Writer',      icon: FileText,        color: 'indigo' },
      { id: 'bulkblog',    label: 'Bulk AI Generator', icon: Layers,         color: 'indigo' },
    ]
  },
  {
    label: 'AI Tools',
    items: [
      { id: 'whatsapp',    label: 'Auto-WhatsApp',    icon: MessageCircle,   color: 'green' },
      { id: 'imagegen',    label: 'Ad Banner Gen',    icon: Image,           color: 'pink' },
      { id: 'calendar',    label: 'Content Calendar', icon: CalendarDays,    color: 'violet' },
      { id: 'competitor',  label: 'Competitor AI',    icon: Search,          color: 'blue' },
    ]
  },
  {
    label: 'Site Content',
    items: [
      { id: 'portfolio',   label: 'Case Studies',     icon: FolderOpen,      color: 'indigo' },
      { id: 'team',        label: 'Team Members',     icon: UserRound,       color: 'indigo' },
      { id: 'services',    label: 'Services',         icon: Briefcase,       color: 'indigo' },
      { id: 'pricing',     label: 'Pricing Plans',    icon: DollarSign,      color: 'indigo' },
      { id: 'faqs',        label: 'FAQs',             icon: HelpCircle,      color: 'indigo' },
      { id: 'testimonials',label: 'Testimonials',     icon: Star,            color: 'indigo' },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'settings',    label: 'Settings',         icon: Settings,        color: 'indigo' },
    ]
  }
];

const colorMap = {
  indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  green:   'bg-green-500/15 text-green-400 border-green-500/30',
  pink:    'bg-pink-500/15 text-pink-400 border-pink-500/30',
  violet:  'bg-violet-500/15 text-violet-400 border-violet-500/30',
  blue:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
  orange:  'bg-orange-500/15 text-orange-400 border-orange-500/30',
  cyan:    'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  purple:  'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

const activeColorMap = {
  indigo: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25',
  emerald: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25',
  green:   'bg-green-600 text-white shadow-lg shadow-green-500/25',
  pink:    'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25',
  violet:  'bg-violet-600 text-white shadow-lg shadow-violet-500/25',
  blue:    'bg-blue-600 text-white shadow-lg shadow-blue-500/25',
  orange:  'bg-orange-600 text-white shadow-lg shadow-orange-500/25',
  cyan:    'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25',
  purple:  'bg-purple-600 text-white shadow-lg shadow-purple-500/25',
};

const pageNames = {};
navGroups.forEach(g => g.items.forEach(i => { pageNames[i.id] = i.label; }));

// ─── Nav Item Component ───────────────────────────────────────────
function NavItem({ item, activeTab, setActiveTab, onSelect }) {
  const isActive = activeTab === item.id;
  const Icon = item.icon;

  return (
    <button
      onClick={() => { setActiveTab(item.id); onSelect?.(); }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
        ${isActive
          ? activeColorMap[item.color] || activeColorMap.indigo
          : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
    >
      <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all
        ${isActive
          ? 'bg-white/20'
          : `${colorMap[item.color] || colorMap.indigo} border group-hover:border-slate-600`
        }`}>
        <Icon size={14} />
      </span>
      <span className="flex-1 text-left leading-tight">{item.label}</span>
      {isActive && <ChevronRight size={14} className="opacity-60 flex-shrink-0" />}
    </button>
  );
}

// ─── Sidebar Content (defined outside to prevent re-mount on tab change) ─────
function SidebarContent({ activeTab, setActiveTab, onSelect }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/25">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight tracking-tight">Tech Digi</p>
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      <nav
        data-lenis-prevent
        className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-5"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 transparent',
          overscrollBehavior: 'contain'
        }}
        onWheel={e => e.stopPropagation()}
      >
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] px-3 mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavItem
                  key={item.id}
                  item={item}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-800/80 space-y-1 flex-shrink-0">
        <a
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-700 group-hover:border-slate-600">
            <LogOut size={14} />
          </span>
          Exit to Website
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────
 export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Socket.io Real-Time Notifications
  useEffect(() => {
    const socket = io(); // Connects to the same host

    socket.on('new_lead', (data) => {
      toast.success(`New Lead Alert: ${data.name} just requested a service!`, {
        icon: '🚨',
        duration: 5000,
        style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
      });
    });

    socket.on('new_chat', (data) => {
      toast('New message from ChatBot user!', {
        icon: '💬',
        duration: 4000,
        style: { background: '#1e293b', color: '#fff', border: '1px solid #8b5cf6' }
      });
    });

    return () => socket.disconnect();
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':     return <AdminOverview setActiveTab={setActiveTab} />;
      case 'leads':        return <AdminLeads />;
      case 'newsletter':   return <AdminNewsletter />;
      case 'drip':         return <AdminDripCampaigns />;
      case 'clients':      return <AdminClients />;
      case 'approvals':    return <AdminApprovals />;
      case 'bookings':     return <AdminBookings />;
      case 'proposals':    return <AdminProposals />;
      case 'invoices':     return <AdminInvoices />;
      case 'tasks':        return <AdminTasks />;
      case 'planner':      return <AdminPlanner />;
      case 'vault':        return <AdminVault />;
      case 'blog':         return <AdminBlog />;
      case 'bulkblog':     return <AdminBulkBlog />;
      case 'whatsapp':     return <AdminWhatsApp />;
      case 'imagegen':     return <AdminImageGen />;
      case 'calendar':     return <AdminCalendar />;
      case 'competitor':   return <AdminCompetitor />;
      case 'portfolio':    return <AdminPortfolio />;
      case 'team':         return <AdminTeam />;
      case 'services':     return <AdminServices />;
      case 'pricing':      return <AdminPricing />;
      case 'faqs':         return <AdminFAQs />;
      case 'testimonials': return <AdminTestimonials />;
      case 'settings':     return <AdminSettings />;
      default:             return null;
    }
  };

  // ─── Main Dashboard ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Admin CMS | Tech Digi</title></Helmet>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 bg-[#111827]/90 border-r border-slate-800/80 fixed top-0 left-0 h-screen z-30 backdrop-blur-xl overflow-hidden">
        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed top-0 left-0 h-screen w-60 bg-[#111827] border-r border-slate-800/80 z-50 md:hidden"
            >
              <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} onSelect={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Area ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* ── Top Header ── */}
        <header className="sticky top-0 z-20 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <nav className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-500 text-xs hidden sm:block">Tech Digi</span>
              <ChevronRight size={12} className="text-slate-600 hidden sm:block" />
              <span className="text-white font-semibold text-sm truncate">
                {pageNames[activeTab] || 'Dashboard'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">Live</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
              A
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
