import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Heart, Users, FolderHeart, Calendar, FileText, Mail } from 'lucide-react';

export const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // General summaries count states
  const [volunteersCount, setVolunteersCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    const fetchStatsAndCounts = async () => {
      try {
        const [statsRes, volRes, projRes, evRes, blogRes, msgRes] = await Promise.all([
          axios.get('/api/donations/stats').catch(() => ({ data: { data: null } })),
          axios.get('/api/volunteers').catch(() => ({ data: { data: [] } })),
          axios.get('/api/projects').catch(() => ({ data: { data: [] } })),
          axios.get('/api/events').catch(() => ({ data: { data: [] } })),
          axios.get('/api/blogs').catch(() => ({ data: { data: [] } })),
          axios.get('/api/contact').catch(() => ({ data: { data: [] } })),
        ]);

        setStats(statsRes.data.data);
        setVolunteersCount(volRes.data.data?.length || 0);
        setProjectsCount(projRes.data.data?.length || 0);
        setEventsCount(evRes.data.data?.length || 0);
        setBlogsCount(blogRes.data.data?.length || 0);
        setMessagesCount(msgRes.data.data?.length || 0);
      } catch (err) {
        console.error('Error fetching dashboard analytics:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatsAndCounts();
  }, []);

  const totalDonationsAmount = stats?.totalDonations || 450000; // Mock default

  // Fallback / Default Chart Data
  const trendData = stats?.donationTrends?.length > 0
    ? stats.donationTrends.map((t) => ({ name: t._id, Amount: t.total }))
    : [
        { name: 'Jan', Amount: 40000 },
        { name: 'Feb', Amount: 65000 },
        { name: 'Mar', Amount: 50000 },
        { name: 'Apr', Amount: 95000 },
        { name: 'May', Amount: 80000 },
      ];

  const pieData = stats?.categoryBreakdown?.length > 0
    ? stats.categoryBreakdown.map((c) => ({ name: c._id, value: c.total }))
    : [
        { name: 'Education', value: 180000 },
        { name: 'Healthcare', value: 120000 },
        { name: 'Environment', value: 70000 },
        { name: 'General Support', value: 80000 },
      ];

  const COLORS = ['#0d9488', '#0f766e', '#f59e0b', '#10b981', '#6366f1'];

  const cardItems = [
    { label: 'Total Donations', value: `₹${totalDonationsAmount.toLocaleString()}`, icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
    { label: 'Volunteers Applied', value: volunteersCount, icon: Users, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Active Projects', value: projectsCount, icon: FolderHeart, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Outreach Events', value: eventsCount, icon: Calendar, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { label: 'News Articles', value: blogsCount, icon: FileText, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/20' },
    { label: 'Inquiries Received', value: messagesCount, icon: Mail, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-28 skeleton"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Analytics Overview</h2>
        <p className="text-xs text-slate-400">Review foundation performance, donations trends, and social registrations.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
        {cardItems.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</span>
                <span className={`p-2 rounded-xl shrink-0 ${c.color}`}>
                  <Icon size={16} />
                </span>
              </div>
              <span className="block text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mt-2">
                {c.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white tracking-wide uppercase">
            Donation Trends (Monthly)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="Amount" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white tracking-wide uppercase">
            Fund Distribution
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
