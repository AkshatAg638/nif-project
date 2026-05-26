import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Settings, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const CmsSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields Structure
  const [orgName, setOrgName] = useState('');
  const [orgTagline, setOrgTagline] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgAddress, setOrgAddress] = useState('');

  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');

  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutContent, setAboutContent] = useState('');

  const [fb, setFb] = useState('');
  const [tw, setTw] = useState('');
  const [inst, setInst] = useState('');
  const [ln, setLn] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success && res.data.data) {
          const s = res.data.data;
          setOrgName(s.organization?.name || '');
          setOrgTagline(s.organization?.tagline || '');
          setOrgEmail(s.organization?.email || '');
          setOrgPhone(s.organization?.phone || '');
          setOrgAddress(s.organization?.address || '');

          setHeroTitle(s.hero?.title || '');
          setHeroSubtitle(s.hero?.subtitle || '');
          setHeroBgImage(s.hero?.backgroundImage || '');

          setAboutTitle(s.aboutBrief?.title || '');
          setAboutContent(s.aboutBrief?.content || '');

          setFb(s.socialLinks?.facebook || '');
          setTw(s.socialLinks?.twitter || '');
          setInst(s.socialLinks?.instagram || '');
          setLn(s.socialLinks?.linkedin || '');
        }
      } catch (err) {
        console.error('Error fetching admin settings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      organization: {
        name: orgName,
        tagline: orgTagline,
        email: orgEmail,
        phone: orgPhone,
        address: orgAddress,
      },
      hero: {
        title: heroTitle,
        subtitle: heroSubtitle,
        backgroundImage: heroBgImage,
      },
      aboutBrief: {
        title: aboutTitle,
        content: aboutContent,
      },
      socialLinks: {
        facebook: fb,
        twitter: tw,
        instagram: inst,
        linkedin: ln,
      },
    };

    try {
      const res = await axios.put('/api/settings', payload);
      if (res.data.success) {
        showToast('Website CMS settings saved successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-44 skeleton"></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in pb-12 text-xs font-semibold">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">CMS Settings</h2>
          <p className="text-xs text-slate-400">Configure corporate profiles, Hero headlines, and social links instantly.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all btn-premium"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Organization Info */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-850 dark:text-white border-b pb-2">Organization Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-450 block">NGO Legal Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-450 block">Tagline</label>
            <input
              type="text"
              value={orgTagline}
              onChange={(e) => setOrgTagline(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-450 block">Corporate Email</label>
            <input
              type="email"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-450 block">Phone Contact</label>
            <input
              type="text"
              value={orgPhone}
              onChange={(e) => setOrgPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-slate-450 block">Physical Address</label>
          <input
            type="text"
            value={orgAddress}
            onChange={(e) => setOrgAddress(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Hero Section settings */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-850 dark:text-white border-b pb-2">Homepage Hero Layout</h3>
        
        <div className="space-y-1">
          <label className="text-slate-450 block">Hero Title</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-450 block">Hero Subtitle</label>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-850 dark:text-white focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-450 block">Background Image URL</label>
          <input
            type="text"
            value={heroBgImage}
            onChange={(e) => setHeroBgImage(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* About brief */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-850 dark:text-white border-b pb-2">About Section Brief</h3>
        
        <div className="space-y-1">
          <label className="text-slate-450 block">Section Title</label>
          <input
            type="text"
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-450 block">Brief narrative Content</label>
          <textarea
            rows={3}
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-850 dark:text-white focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-850 dark:text-white border-b pb-2">Social Networking URLs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-400 block">Facebook Link</label>
            <input
              type="text"
              value={fb}
              onChange={(e) => setFb(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 block">Twitter Link</label>
            <input
              type="text"
              value={tw}
              onChange={(e) => setTw(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-400 block">Instagram Link</label>
            <input
              type="text"
              value={inst}
              onChange={(e) => setInst(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 block">LinkedIn Link</label>
            <input
              type="text"
              value={ln}
              onChange={(e) => setLn(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

    </form>
  );
};

export default CmsSettings;
