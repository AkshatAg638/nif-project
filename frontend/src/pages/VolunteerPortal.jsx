import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ClipboardList,
  CheckCircle,
  Clock,
  KeyRound,
  Copy,
  ShieldAlert,
  Sparkles,
  Smile,
  Award,
  Check,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Meta from '../components/common/Meta.jsx';

export const VolunteerPortal = () => {
  const { user, checkUserSession } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('work'); // 'work' | 'profile'
  const [tasks, setTasks] = useState([]);
  const [volunteerDetails, setVolunteerDetails] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState(null);

  // 2FA states
  const [setupMode, setSetupMode] = useState(false);
  const [disableMode, setDisableMode] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [otpUrl, setOtpUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading2FA, setLoading2FA] = useState(false);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await axios.get('/api/tasks/my');
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message);
      showToast('Failed to load assigned tasks', 'error');
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchVolunteerDetails = async () => {
    setLoadingDetails(true);
    try {
      const res = await axios.get('/api/volunteers/me');
      if (res.data.success) {
        setVolunteerDetails(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch volunteer details:', err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchVolunteerDetails();
  }, []);

  const handleCompleteTask = async (taskId) => {
    setCompletingTaskId(taskId);
    try {
      const res = await axios.put(`/api/tasks/${taskId}/complete`);
      if (res.data.success) {
        showToast('Task marked as completed! Excellent work!', 'success');
        // Refresh task list
        fetchTasks();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete task', 'error');
    } finally {
      setCompletingTaskId(null);
    }
  };

  // 2FA logic
  const handleSetup2FA = async () => {
    setLoading2FA(true);
    try {
      const res = await axios.post('/api/auth/setup-2fa');
      if (res.data.success) {
        setTotpSecret(res.data.secret);
        setOtpUrl(res.data.otpAuthUrl);
        setSetupMode(true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to initiate 2FA setup', 'error');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return showToast('Enter 6-digit code', 'error');

    setLoading2FA(true);
    try {
      const res = await axios.post('/api/auth/confirm-2fa', { code });
      if (res.data.success) {
        showToast('2FA enabled successfully!', 'success');
        setSetupMode(false);
        setCode('');
        checkUserSession(); // update auth context session state
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification failed. Try again.', 'error');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return showToast('Enter 6-digit code', 'error');

    setLoading2FA(true);
    try {
      const res = await axios.post('/api/auth/disable-2fa', { code });
      if (res.data.success) {
        showToast('2FA disabled successfully!', 'success');
        setDisableMode(false);
        setCode('');
        checkUserSession();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification failed. Could not disable.', 'error');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    showToast('Secret key copied to clipboard!', 'info');
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 pb-20">
      <Meta title="Volunteer Portal | Namokriti" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest to-emerald-800 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(116,198,157,0.15),transparent)] pointer-events-none" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-sage mb-3">
              <Award size={13} className="animate-pulse" />
              <span>Namokriti Volunteer Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-none">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-emerald-100/80 text-sm mt-2 max-w-xl">
              Thank you for sharing your time and talents. Your contribution is making a meaningful impact in our community.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/5 flex flex-col min-w-[100px]">
              <span className="text-xs text-emerald-200/80 font-bold">Pending</span>
              <span className="text-2xl font-black mt-0.5">{pendingTasks.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/5 flex flex-col min-w-[100px]">
              <span className="text-xs text-emerald-200/80 font-bold">Completed</span>
              <span className="text-2xl font-black mt-0.5">{completedTasks.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        
        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 max-w-md mb-8">
          <button
            onClick={() => setActiveTab('work')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'work'
                ? 'bg-forest text-white shadow-sm shadow-forest/10'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <ClipboardList size={14} />
            <span>My Tasks & Assigned Work</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-forest text-white shadow-sm shadow-forest/10'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <User size={14} />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* Tab Panel Context */}
        <AnimatePresence mode="wait">
          {activeTab === 'work' ? (
            <motion.div
              key="work-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Metrics Detail Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    title: 'Total Tasks Assigned',
                    value: tasks.length,
                    icon: ClipboardList,
                    color: 'text-slate-700 dark:text-slate-355',
                    bg: 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800',
                    desc: 'Tasks allocated by administrators.'
                  },
                  {
                    title: 'Tasks Pending Attention',
                    value: pendingTasks.length,
                    icon: Clock,
                    color: 'text-amber-600 dark:text-amber-400',
                    bg: 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800',
                    desc: 'Work currently awaiting action.'
                  },
                  {
                    title: 'Completed Achievements',
                    value: completedTasks.length,
                    icon: Award,
                    color: 'text-emerald-600 dark:text-emerald-400',
                    bg: 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800',
                    desc: 'Tasks successfully marked as done.'
                  }
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-3xl border ${stat.bg} shadow-sm flex items-start gap-4`}>
                    <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 ${stat.color}`}>
                      <stat.icon size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{stat.title}</span>
                      <span className="text-3xl font-black text-slate-800 dark:text-white mt-1 block">{stat.value}</span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid of Work Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                
                {/* Pending Tasks - Left 3 cols */}
                <div className="lg:col-span-3 space-y-5">
                  <div className="flex items-center justify-between border-b pb-3 dark:border-slate-850">
                    <h3 className="font-serif font-black text-xl text-slate-800 dark:text-white flex items-center gap-2">
                      <Clock className="text-amber-500" size={20} />
                      <span>Pending Tasks</span>
                    </h3>
                    <span className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-full font-bold text-xs">
                      {pendingTasks.length} Active
                    </span>
                  </div>

                  {loadingTasks ? (
                    <div className="space-y-4">
                      {[1, 2].map((n) => (
                        <div key={n} className="h-32 skeleton rounded-3xl border border-slate-150" />
                      ))}
                    </div>
                  ) : pendingTasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 text-center text-slate-400 dark:text-slate-500 shadow-sm"
                    >
                      <Smile size={36} className="mx-auto text-emerald-500 mb-3" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">All caught up!</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">There are no pending tasks assigned to you at the moment.</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {pendingTasks.map((task) => (
                        <motion.div
                          key={task._id}
                          variants={itemVariants}
                          className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                          {/* Accent left border */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />

                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="space-y-2 max-w-lg">
                              <h4 className="font-bold text-slate-800 dark:text-white text-base">
                                {task.title}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {task.description}
                              </p>
                              
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-4">
                                <Calendar size={12} />
                                <span>Assigned on: {new Date(task.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              </div>
                            </div>

                            <div className="sm:self-center shrink-0">
                              <button
                                onClick={() => handleCompleteTask(task._id)}
                                disabled={completingTaskId !== null}
                                className="w-full sm:w-auto px-5 py-2.5 bg-forest hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md shadow-forest/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
                              >
                                {completingTaskId === task._id ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check size={14} />
                                )}
                                <span>Mark as Done</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Completed Tasks & Appreciation - Right 2 cols */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="flex items-center justify-between border-b pb-3 dark:border-slate-850">
                    <h3 className="font-serif font-black text-xl text-slate-800 dark:text-white flex items-center gap-2">
                      <CheckCircle className="text-emerald-500" size={20} />
                      <span>Completed Tasks</span>
                    </h3>
                    <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 rounded-full font-bold text-xs">
                      {completedTasks.length} Finished
                    </span>
                  </div>

                  {loadingTasks ? (
                    <div className="space-y-4">
                      <div className="h-44 skeleton rounded-3xl border border-slate-150" />
                    </div>
                  ) : completedTasks.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-850/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-850 p-8 text-center text-slate-400 dark:text-slate-500">
                      <Award size={30} className="mx-auto opacity-40 mb-2" />
                      <p className="text-xs font-semibold">No tasks completed yet</p>
                      <p className="text-[10px] mt-0.5">Your achievements and appreciation letters will appear here.</p>
                    </div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4 max-h-[500px] overflow-y-auto pr-1"
                    >
                      {completedTasks.map((task) => (
                        <motion.div
                          key={task._id}
                          variants={itemVariants}
                          className="bg-white dark:bg-slate-800 rounded-3xl border border-emerald-100 dark:border-emerald-950/30 p-5 shadow-sm space-y-3 relative overflow-hidden"
                        >
                          {/* Mini Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-slate-850 dark:text-white text-xs block leading-tight">
                                {task.title}
                              </h4>
                              <span className="text-[9px] text-slate-400 mt-0.5 block">
                                Finished on: {new Date(task.completedAt || task.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                            <span className="p-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-full shrink-0">
                              <CheckCircle size={14} />
                            </span>
                          </div>

                          {/* Appreciation Box */}
                          <div className="bg-gradient-to-br from-emerald-50/40 to-teal-50/20 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-100/50 dark:border-emerald-900/20 p-3 rounded-2xl relative">
                            <div className="absolute top-2 right-2 text-emerald-500 opacity-20">
                              <Sparkles size={16} />
                            </div>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 block mb-1">
                              Appreciation Message
                            </span>
                            <p className="text-[11px] font-sans font-medium text-slate-650 dark:text-slate-300 italic leading-relaxed">
                              "{task.appreciationMessage}"
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              {/* Profile card left column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                  
                  {/* Photo details container */}
                  <div className="text-center space-y-3">
                    <div className="h-20 w-20 bg-forest/5 text-forest rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                      <User size={36} />
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-lg text-slate-800 dark:text-white">
                        {user.name}
                      </h3>
                      <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-full font-bold text-[10px] uppercase tracking-wider">
                        <Check size={10} />
                        <span>Active Volunteer</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t dark:border-slate-700 pt-5 space-y-4 text-xs">
                    {/* Information fields */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                        <Mail size={14} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Email Address</span>
                        <span className="font-bold text-slate-700 dark:text-slate-350 truncate block select-all font-mono mt-0.5">{user.email}</span>
                      </div>
                    </div>

                    {volunteerDetails?.phone && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                          <Phone size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Phone Number</span>
                          <span className="font-bold text-slate-700 dark:text-slate-350 block mt-0.5">{volunteerDetails.phone}</span>
                        </div>
                      </div>
                    )}

                    {volunteerDetails?.city && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                          <MapPin size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">City</span>
                          <span className="font-bold text-slate-700 dark:text-slate-350 block mt-0.5">{volunteerDetails.city}</span>
                        </div>
                      </div>
                    )}

                    {volunteerDetails?.availability && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Availability</span>
                          <span className="font-bold text-slate-700 dark:text-slate-350 block capitalize mt-0.5">{volunteerDetails.availability}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Skills tags */}
                  {volunteerDetails?.skills && volunteerDetails.skills.length > 0 && (
                    <div className="border-t dark:border-slate-700 pt-5 space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Skills & Expertises</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {volunteerDetails.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-100/30 rounded-lg text-[10px] font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border border-dashed rounded-2xl flex items-start gap-2.5 text-[10px] text-slate-500 leading-normal">
                    <AlertCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>To request changes to your skills, availability, or registration info, please message your project administrator.</span>
                  </div>

                </div>
              </div>

              {/* 2FA security controls right column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
                  
                  <div className="flex items-center gap-3">
                    <KeyRound size={22} className="text-forest" />
                    <h3 className="text-lg font-bold text-slate-850 dark:text-white">Account Safety & Two-Factor</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Two-factor authentication adds an extra layer of protection to your volunteer account. When enabled, you must provide a passcode generated in your mobile authenticator app upon logging in.
                  </p>

                  {/* Setup 2FA Form Container */}
                  {setupMode && (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl space-y-4 animate-slide-up">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">Configure Authenticator App</h4>
                      
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          1. Copy the secret key below, or configure it on your mobile device (e.g. Google Authenticator, Authy).
                        </p>

                        {/* Code box */}
                        <div className="flex gap-2 items-center bg-white dark:bg-slate-800 border p-2.5 rounded-xl justify-between">
                          <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 break-all pr-2">
                            {totpSecret}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopySecret}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-650 transition-colors shrink-0"
                            title="Copy key"
                          >
                            <Copy size={14} />
                          </button>
                        </div>

                        <div className="border-t border-dashed my-4 dark:border-slate-700" />

                        <p className="text-xs text-slate-500 leading-relaxed">
                          2. Input the 6-digit confirmation passcode from your app below to enable.
                        </p>

                        <form onSubmit={handleConfirm2FA} className="flex gap-2">
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center font-bold tracking-widest text-sm focus:outline-none focus:border-forest grow"
                          />
                          <button
                            type="submit"
                            disabled={loading2FA}
                            className="px-5 py-2.5 bg-forest hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors"
                          >
                            {loading2FA ? 'Confirming...' : 'Enable 2FA'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Disable 2FA Form Container */}
                  {disableMode && (
                    <form onSubmit={handleDisable2FA} className="p-6 bg-red-50/40 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30 rounded-2xl space-y-4 animate-slide-up">
                      <h4 className="font-bold text-red-650 dark:text-red-400 text-sm flex items-center gap-1.5">
                        <ShieldAlert size={16} />
                        <span>Disable Authentication Security</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Please input the current 6-digit passcode to confirm disabling 2FA.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="000000"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center font-bold tracking-widest text-sm focus:outline-none focus:border-forest grow"
                        />
                        <button
                          type="submit"
                          disabled={loading2FA}
                          className="px-5 py-2.5 bg-red-650 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors"
                        >
                          {loading2FA ? 'Disabling...' : 'Confirm Disable'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Status Toggle Block */}
                  {!setupMode && !disableMode && (
                    <div className="flex items-center justify-between border-t dark:border-slate-700 pt-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${user.twoFactorEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-650'}`} />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-350">
                          Status: {user.twoFactorEnabled ? 'Active (Secured)' : 'Inactive'}
                        </span>
                      </div>

                      {user.twoFactorEnabled ? (
                        <button
                          type="button"
                          onClick={() => setDisableMode(true)}
                          className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-xs font-bold transition-all"
                        >
                          Disable 2FA
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSetup2FA}
                          disabled={loading2FA}
                          className="px-5 py-2.5 bg-forest hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-forest/10 hover:shadow-lg transition-all"
                        >
                          Setup Authenticator App
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default VolunteerPortal;
