import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Send, Heart, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
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
    <footer
      style={{
        background: 'linear-gradient(160deg, #0f1e16 0%, #1a2e22 60%, #0f1814 100%)',
        color: '#b8cfc3',
        paddingTop: '5rem',
        paddingBottom: '2rem',
        borderTop: '1px solid rgba(116,198,157,0.10)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blob top-right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 380,
          height: 380,
          background: 'radial-gradient(ellipse at top right, rgba(45,106,79,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Decorative blob bottom-left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 280,
          height: 280,
          background: 'radial-gradient(ellipse at bottom left, rgba(193,105,79,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* ── Brand Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <img
                src="/logo.jpeg"
                alt="Namokriti International Foundation Logo"
                style={{
                  height: 52,
                  width: 52,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(116,198,157,0.25)',
                  boxShadow: '0 4px 16px rgba(45,106,79,0.3)',
                }}
              />
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: '#FAF7F0',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Namokriti
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: '#74C69D',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginTop: 2,
                  }}
                >
                  International
                </span>
              </div>
            </Link>

            <p style={{ fontSize: '0.85rem', color: '#8aaa97', lineHeight: 1.8 }}>
              Empowering communities through direct, documented action — education, healthcare,
              and clean water inside 40+ underserved villages.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {[
                { icon: Facebook,  href: '#', label: 'Facebook' },
                { icon: Twitter,   href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin,  href: '#', label: 'LinkedIn' },
                { icon: Youtube,   href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: 'rgba(116,198,157,0.08)',
                    border: '1px solid rgba(116,198,157,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#74C69D',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(116,198,157,0.18)';
                    e.currentTarget.style.borderColor = 'rgba(116,198,157,0.4)';
                    e.currentTarget.style.color = '#FAF7F0';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(116,198,157,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(116,198,157,0.14)';
                    e.currentTarget.style.color = '#74C69D';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#74C69D',
                marginBottom: '1.25rem',
              }}
            >
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { to: '/about',     label: 'About Us' },
                { to: '/programs',  label: 'Our Programs' },
                { to: '/projects',  label: 'Campaigns & Projects' },
                { to: '/events',    label: 'Upcoming Events' },
                { to: '/volunteer', label: 'Join as Volunteer' },
                { to: '/gallery',   label: 'Gallery' },
                { to: '/blog',      label: 'Field Notes' },
                { to: '/contact',   label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ fontSize: '0.88rem', color: '#8aaa97', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#74C69D'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8aaa97'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ── */}
          <div>
            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#74C69D',
                marginBottom: '1.25rem',
              }}
            >
              Legal
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { to: '/privacy-policy',  label: 'Privacy Policy' },
                { to: '/terms-conditions',label: 'Terms & Conditions' },
                { to: '/refund-policy',   label: 'Refund Policy' },
                { to: '/cookie-policy',   label: 'Cookie Policy' },
                { to: '/donation-policy', label: 'Donation Policy' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ fontSize: '0.88rem', color: '#8aaa97', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#74C69D'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8aaa97'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter ── */}
          <div>
            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#74C69D',
                marginBottom: '1.25rem',
              }}
            >
              Stay Updated
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8aaa97', lineHeight: 1.75, marginBottom: '1rem' }}>
              Get campaign updates, success stories & event alerts — straight to your inbox.
            </p>
            <form
              onSubmit={handleSubscribe}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(116,198,157,0.18)',
                  color: '#FAF7F0',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(116,198,157,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(116,198,157,0.18)'}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 14px',
                  background: loading ? 'rgba(116,198,157,0.15)' : '#2D6A4F',
                  border: 'none',
                  borderRadius: 10,
                  color: '#FAF7F0',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1f4d38'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2D6A4F'; }}
              >
                <Send size={16} />
              </button>
            </form>

            {/* Donate CTA */}
            <div style={{ marginTop: '1.5rem' }}>
              <Link
                to="/donate"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 22px',
                  background: '#C1694F',
                  color: '#FAF7F0',
                  borderRadius: 10,
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(193,105,79,0.3)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#a8573f';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#C1694F';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Heart size={15} />
                Donate Now
              </Link>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: '1px solid rgba(116,198,157,0.10)', paddingTop: '2rem' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            {/* Left Side: Logo + Made with */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="/brajwasi-coders-logo.jpg"
                alt="Brajwasi's Coders"
                style={{
                  height: 38,
                  width: 38,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(116,198,157,0.25)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              />
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.83rem',
                  color: '#6b8c7a',
                  fontFamily: "'DM Sans', sans-serif",
                  margin: 0,
                }}
              >
                Made with{' '}
                <Heart
                  size={13}
                  style={{ fill: '#C1694F', color: '#C1694F', flexShrink: 0 }}
                />{' '}
                by{' '}
                <span style={{ fontWeight: 700, color: '#74C69D' }}>Brajwasi's Coders</span>
              </p>
            </div>

            {/* Right Side: Copyright */}
            <p style={{ fontSize: '0.78rem', color: '#4a6355', margin: 0 }}>
              © {new Date().getFullYear()} Namokriti International Foundation. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
