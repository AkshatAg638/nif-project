import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { User, KeyRound, ShieldAlert, Check, Copy } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';
import VolunteerPortal from './VolunteerPortal.jsx';

export const Profile = () => {
  const { user, checkUserSession } = useAuth();
  const { showToast } = useToast();

  const [setupMode, setSetupMode] = useState(false);
  const [disableMode, setDisableMode] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [otpUrl, setOtpUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [volunteerData, setVolunteerData] = useState(null);
  const [volunteerLoading, setVolunteerLoading] = useState(false);

  React.useEffect(() => {
    if (user && user.role === 'user') {
      const fetchVolunteerProfile = async () => {
        setVolunteerLoading(true);
        try {
          const res = await axios.get('/api/volunteers/me');
          if (res.data.success) {
            setVolunteerData(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load volunteer profile:', err.message);
        } finally {
          setVolunteerLoading(false);
        }
      };
      fetchVolunteerProfile();
    }
  }, [user]);

  const handleSetup2FA = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return showToast('Enter 6-digit code', 'error');

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/confirm-2fa', { code });
      if (res.data.success) {
        showToast('2FA enabled successfully!', 'success');
        setSetupMode(false);
        setCode('');
        checkUserSession(); // update state
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return showToast('Enter 6-digit code', 'error');

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/disable-2fa', { code });
      if (res.data.success) {
        showToast('2FA disabled successfully!', 'success');
        setDisableMode(false);
        setCode('');
        checkUserSession(); // update state
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification failed. Could not disable.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    showToast('Secret key copied to clipboard!', 'info');
  };

  if (!user) return null;

  if (user.role === 'user') {
    return <VolunteerPortal user={user} />;
  }
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20 space-y-10">
      <Meta title="My Profile" />

      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <User size={32} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{user.name}</h3>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mt-0.5">
              {user.role}
            </span>
          </div>
          <div className="border-t pt-4 text-left text-xs space-y-1.5 text-slate-500">
            <span className="block font-semibold">Email:</span>
            <span className="block text-slate-700 dark:text-slate-350 select-all font-mono break-all">
              {user.email}
            </span>
          </div>
        </div>

        {/* Security / 2FA Setup */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <KeyRound size={22} className="text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Two-Factor Authentication</h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Two-factor authentication adds an extra layer of protection to your administrative account. Once enabled, you must supply an authenticator passcode upon credential login.
          </p>

          {/* Setup 2FA Mode */}
          {setupMode && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl space-y-4 animate-slide-up">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Configure Authenticator</h4>
              
              <div className="space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  1. Scan this QR code or enter the secret key manually into Google Authenticator or Duo Mobile.
                </p>

                {/* Secret copy */}
                <div className="flex gap-2 items-center bg-white dark:bg-slate-800 border p-2.5 rounded-xl justify-between">
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 break-all pr-2">
                    {totpSecret}
                  </span>
                  <button
                    onClick={handleCopySecret}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>

                <div className="border border-dashed my-4"></div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  2. Enter the 6-digit confirmation passcode from your authenticator app below to enable.
                </p>

                <form onSubmit={handleConfirm2FA} className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center font-bold tracking-widest text-sm focus:outline-none focus:border-emerald-500 grow"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold text-xs rounded-xl"
                  >
                    {loading ? 'Enabling...' : 'Confirm'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Disable 2FA Mode */}
          {disableMode && (
            <form onSubmit={handleDisable2FA} className="p-6 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/40 rounded-2xl space-y-4 animate-slide-up">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-sm flex items-center gap-1.5">
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
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center font-bold tracking-widest text-sm focus:outline-none focus:border-emerald-500 grow"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-750 text-white font-bold text-xs rounded-xl"
                >
                  {loading ? 'Disabling...' : 'Disable'}
                </button>
              </div>
            </form>
          )}

          {/* Default Switch Display */}
          {!setupMode && !disableMode && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${user.twoFactorEnabled ? 'bg-green-500' : 'bg-slate-350'}`}></span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Status: {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {user.twoFactorEnabled ? (
                <button
                  onClick={() => setDisableMode(true)}
                  className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-xs font-bold transition-all"
                >
                  Disable 2FA
                </button>
              ) : (
                <button
                  onClick={handleSetup2FA}
                  disabled={loading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 transition-all btn-premium"
                >
                  Configure 2FA
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profile;
