import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import Meta from '../components/common/Meta.jsx';

export const ForgotPassword = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/forgotpassword', { email });
      if (res.data.success) {
        showToast('Password reset link has been dispatched to your email.', 'success');
        setEmail('');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to dispatch reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Meta title="Forgot Password" />

      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
        
        <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-600">
          <ArrowLeft size={14} />
          <span>Back to Login</span>
        </Link>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-850 dark:text-white">Recover Password</h2>
          <p className="text-xs text-slate-400">Enter your email and we will send a password reset URL.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="email"
                required
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all"
          >
            {loading ? 'Sending link...' : 'Send Recovery Email'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;
