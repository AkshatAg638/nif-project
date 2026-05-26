import React, { useState } from 'react';
import axios from 'axios';
import { Heart, Smile, Users, BookOpen } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Meta from '../components/common/Meta.jsx';

export const Volunteer = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('flexible');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skills) return showToast('Please add at least one skill', 'error');

    setLoading(true);

    // Format skills to array
    const skillsArray = skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

    try {
      const res = await axios.post('/api/volunteers', {
        name,
        email,
        phone,
        city,
        skills: skillsArray,
        availability,
      });

      if (res.data.success) {
        showToast('Application submitted successfully! We will contact you soon.', 'success');
        setName('');
        setEmail('');
        setPhone('');
        setCity('');
        setSkills('');
        setAvailability('flexible');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
      <Meta
        title="Become Volunteer"
        description="Join Namokriti International Foundation as a volunteer to support child welfare, rural growth, and healthcare."
      />

      {/* Info Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Join Our Family
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight">
            Become a Volunteer
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Our projects are driven by the energy and skills of volunteers. Whether you are a healthcare professional, an educator, a developer, or a content creator, we have a place for you.
        </p>

        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
          <div className="flex gap-4">
            <Smile className="text-emerald-500 shrink-0" size={20} />
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Make Real Friendships</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect with community coordinators and volunteers globally.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <BookOpen className="text-emerald-500 shrink-0" size={20} />
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Develop Real Skills</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gain hands-on leadership experience coordinates field operations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6"
      >
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">Application Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Your Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Aditi Roy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Phone Contact</label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. aditi@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Current City</label>
            <input
              type="text"
              required
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Skills (comma-separated list)
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Teaching, Nursing, Photography, Social Media"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Availability Schedule
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="flexible">Flexible / Any day</option>
            <option value="weekends">Weekends only</option>
            <option value="weekdays">Weekdays only</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all"
        >
          {loading ? 'Submitting Application...' : 'Submit Application'}
        </button>

      </form>
    </div>
  );
};

export default Volunteer;
