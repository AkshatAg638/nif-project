import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Send, Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/newsletter/subscribe', { email });
      if (res.data.success) {
        showToast('Subscribed to newsletter successfully!', 'success');
        setEmail('');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Subscription failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                N
              </span>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Namokriti Foundation
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering communities and transforming lives through dedicated social, educational, and healthcare development across underserved areas.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-emerald-400 transition-colors">Our Programs</Link></li>
              <li><Link to="/projects" className="hover:text-emerald-400 transition-colors">Campaigns & Projects</Link></li>
              <li><Link to="/events" className="hover:text-emerald-400 transition-colors">Upcoming Events</Link></li>
              <li><Link to="/volunteer" className="hover:text-emerald-400 transition-colors">Join as Volunteer</Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-emerald-400 transition-colors">Refund Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
              <li><Link to="/donation-policy" className="hover:text-emerald-400 transition-colors">Donation Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter / Subscription */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Newsletter
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Subscribe to receive updates on our campaigns, success stories, and upcoming events.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 grow"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white rounded-xl transition-all"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Namokriti International Foundation. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for community development.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
