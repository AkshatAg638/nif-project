import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ShieldAlert, KeyRound, Mail, Lock } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

export const Login = () => {
  const { login, login2FA } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2FA pending states
  const [is2faPending, setIs2faPending] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [code, setCode] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.twoFactorRequired) {
        setIs2faPending(true);
        setTempToken(res.tempToken);
        showToast('Two-Factor Authentication is required.', 'info');
      } else {
        showToast('Signed in successfully!', 'success');
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      showToast(err || 'Failed to authenticate.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return showToast('Please enter a 6-digit passcode', 'error');

    setLoading(true);
    try {
      await login2FA(tempToken, code);
      showToast('2FA verification successful. Signed in!', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      showToast(err || '2FA code verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Meta title={is2faPending ? 'Two-Factor Authentication' : 'Login'} />

      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Toggle Form Header based on 2FA validation state */}
        {!is2faPending ? (
          <>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-black text-slate-850 dark:text-white">Admin Login</h2>
              <p className="text-xs text-slate-400">Sign in to coordinate campaigns and moderate content.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
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

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-500">Password</label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-emerald-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all btn-premium"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Security Check</h2>
              <p className="text-xs text-slate-400">Enter the 6-digit code from your authenticator app.</p>
            </div>

            <form onSubmit={handle2FASubmit} className="space-y-4">
              <input
                type="text"
                required
                maxLength={6}
                placeholder="000 000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-lg font-bold text-center tracking-widest focus:outline-none focus:border-emerald-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIs2faPending(false)}
                  className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-2xl text-xs font-bold transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-750 text-white font-bold text-sm rounded-2xl shadow-md transition-all"
                >
                  {loading ? 'Verifying...' : 'Verify & login'}
                </button>
              </div>
            </form>
          </>
        )}

        {!is2faPending && (
          <div className="text-center text-xs text-slate-400 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:underline">
              Register
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
