import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Meta from '../components/common/Meta.jsx';

export const Contact = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post('/api/contact', {
        name,
        email,
        subject,
        message,
      });

      if (res.data.success) {
        showToast('Your message has been submitted. Thank you!', 'success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-16">
      <Meta
        title="Contact Us"
        description="Get in touch with Namokriti International Foundation. Contact us for sponsorships, volunteering, or media queries."
      />

      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
          Contact the Foundation
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Support channels cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 border p-6 rounded-3xl flex gap-4 items-center">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Support Email</span>
              <a href="mailto:contact@namokriti.org" className="text-sm font-bold text-slate-800 dark:text-white hover:underline">
                contact@namokriti.org
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border p-6 rounded-3xl flex gap-4 items-center">
            <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Phone contact</span>
              <a href="tel:+917417295599" className="text-sm font-bold text-slate-800 dark:text-white hover:underline">
                +91 74172 95599
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border p-6 rounded-3xl flex gap-4 items-center">
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Head Office</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                Mayur Jewellers<br></br>
                Chowk Bazar, Mathura(281001),<br></br>
                Uttar Pradesh, India
              </span>
            </div>
          </div>

          {/* Dynamic maps frame */}
          <div className="rounded-3xl overflow-hidden border shadow-sm h-64 bg-slate-100">
            <iframe
              title="Namokriti Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13994.165479167912!2d77.70476631625866!3d27.481213944393668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747689f46e369f%3A0x5f1a6f40a856b40b!2sShree%20Chowk%20Bazar!5e0!3m2!1sen!2sin!4v1748687212412!5m2!1sen!2sin"
              className="w-full h-full border-0 grayscale opacity-80"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-5"
        >
          <h3 className="text-xl font-bold text-slate-850 dark:text-white">Send Inquiry Message</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Your Name</label>
              <input
                type="text"
                required
                placeholder="Rahul Sen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Your Email</label>
              <input
                type="email"
                required
                placeholder="rahul@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Volunteer opportunities, CSR Sponsorships"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Your Message</label>
            <textarea
              required
              rows={5}
              placeholder="Write your messages details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Send size={16} />
            <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default Contact;
