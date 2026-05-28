import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { user, logout, isAuthenticated, isAdmin, isEditor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Accessibility Font Zoom State
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('font-size-scale') || '100';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize = fontSize === '100' ? '' : `${fontSize}%`;
    localStorage.setItem('font-size-scale', fontSize);
  }, [fontSize]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Section IDs for scroll-spy
  const sectionIds = ['home', 'about', 'programs', 'projects', 'events'];

  const navLinks = [
    { path: '/#home', label: 'Home', sectionId: 'home' },
    { path: '/#about', label: 'About Us', sectionId: 'about' },
    { path: '/#programs', label: 'Programs', sectionId: 'programs' },
    { path: '/#projects', label: 'Projects', sectionId: 'projects' },
    { path: '/#events', label: 'Events', sectionId: 'events' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  // Intersection Observer for scroll-spy active section highlighting
  useEffect(() => {
    // Only run on the home page
    if (location.pathname !== '/') return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // Reset active section when navigating away from home
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
    } else {
      setActiveSection('home');
    }
  }, [location.pathname]);

  // Smooth scroll handler
  const handleSectionClick = useCallback((e, sectionId) => {
    e.preventDefault();

    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for the page to render, then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    setIsOpen(false);
  }, [location.pathname, navigate]);

  // Check if a section link is active
  const isSectionActive = (sectionId) => {
    return location.pathname === '/' && activeSection === sectionId;
  };

  return (
    <nav className="sticky top-0 z-50 glass transition-all duration-300" style={{ boxShadow: '0 1px 0 rgba(45,106,79,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.jpeg" alt="Namokriti Logo" className="h-11 w-auto object-contain rounded-full shadow-sm" />
            <div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.15rem', color: '#1a2e22', letterSpacing: '-0.01em', display: 'block', lineHeight: 1.1 }}>
                Namokriti
              </span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#6b8c7a', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginTop: 2 }}>
                International
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.sectionId ? (
                <button
                  key={link.path}
                  onClick={(e) => handleSectionClick(e, link.sectionId)}
                  className="relative pb-1"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: isSectionActive(link.sectionId) ? 700 : 500,
                    color: isSectionActive(link.sectionId) ? '#2D6A4F' : '#4a6355',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2D6A4F'}
                  onMouseLeave={e => { if (!isSectionActive(link.sectionId)) e.currentTarget.style.color = '#4a6355'; }}
                >
                  {link.label}
                  <span
                    style={{
                      position: 'absolute', left: 0, bottom: 0,
                      height: 2, borderRadius: 99,
                      background: 'linear-gradient(90deg, #74C69D, #2D6A4F)',
                      transition: 'width 0.3s ease',
                      width: isSectionActive(link.sectionId) ? '100%' : '0%',
                    }}
                  />
                </button>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  style={({ isActive }) => ({
                    position: 'relative',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#2D6A4F' : '#4a6355',
                    textDecoration: 'none',
                    paddingBottom: 4,
                    transition: 'color 0.2s',
                    fontFamily: "'DM Sans', sans-serif",
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        style={{
                          position: 'absolute', left: 0, bottom: 0,
                          height: 2, borderRadius: 99,
                          background: 'linear-gradient(90deg, #74C69D, #2D6A4F)',
                          transition: 'width 0.3s ease',
                          width: isActive ? '100%' : '0%',
                        }}
                      />
                    </>
                  )}
                </NavLink>
              )
            ))}
          </div>

          {/* User widgets & Actions */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Font Size Accessibility Widget */}
            <div className="flex items-center gap-0.5 border border-[#2D6A4F]/10 rounded-lg p-0.5 bg-slate-50/50">
              <button
                onClick={() => setFontSize('90')}
                style={{
                  background: fontSize === '90' ? '#2D6A4F' : 'transparent',
                  color: fontSize === '90' ? '#FAF7F0' : '#4a6355',
                }}
                className="w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-md hover:bg-[#2D6A4F]/5 transition-all cursor-pointer"
                aria-label="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('100')}
                style={{
                  background: fontSize === '100' ? '#2D6A4F' : 'transparent',
                  color: fontSize === '100' ? '#FAF7F0' : '#4a6355',
                }}
                className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-md hover:bg-[#2D6A4F]/5 transition-all cursor-pointer"
                aria-label="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('110')}
                style={{
                  background: fontSize === '110' ? '#2D6A4F' : 'transparent',
                  color: fontSize === '110' ? '#FAF7F0' : '#4a6355',
                }}
                className="w-7 h-7 flex items-center justify-center text-[13px] font-bold rounded-md hover:bg-[#2D6A4F]/5 transition-all cursor-pointer"
                aria-label="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative group flex items-center gap-2 cursor-pointer">
                <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(45,106,79,0.08)', color: '#2D6A4F', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(45,106,79,0.12)' }}>
                  <User size={14} />
                  <span>{user.name.split(' ')[0]}</span>
                </div>
                
                {/* Dropdown */}
                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                  <div style={{ background: '#FAF7F0', borderRadius: 14, boxShadow: '0 8px 32px rgba(45,106,79,0.12)', border: '1px solid rgba(45,106,79,0.1)', padding: 6 }}>
                    {(isAdmin || isEditor) && (
                      <Link
                        to="/admin"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: '0.85rem', color: '#2D6A4F', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}
                        className="hover:bg-green-50 transition-colors"
                      >
                        <LayoutDashboard size={14} />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: '0.85rem', color: '#4a6355', borderRadius: 8, textDecoration: 'none' }}
                      className="hover:bg-green-50 transition-colors"
                    >
                      <User size={14} />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: '0.85rem', color: '#C1694F', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left' }}
                      className="hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                style={{ fontSize: '0.88rem', fontWeight: 600, color: '#4a6355', textDecoration: 'none' }}
                className="hover:text-forest transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Donate CTA — Terracotta brand colour */}
            <Link
              to="/donate"
              className="btn-terracotta"
              style={{ padding: '10px 22px', fontSize: '0.85rem' }}
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Font Size Accessibility Widget */}
            <div className="flex items-center gap-0.5 border border-[#2D6A4F]/10 rounded-lg p-0.5 bg-slate-50/50">
              <button
                onClick={() => setFontSize('90')}
                style={{
                  background: fontSize === '90' ? '#2D6A4F' : 'transparent',
                  color: fontSize === '90' ? '#FAF7F0' : '#4a6355',
                }}
                className="w-6 h-6 flex items-center justify-center text-[9px] font-bold rounded-md cursor-pointer"
                aria-label="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('100')}
                style={{
                  background: fontSize === '100' ? '#2D6A4F' : 'transparent',
                  color: fontSize === '100' ? '#FAF7F0' : '#4a6355',
                }}
                className="w-6 h-6 flex items-center justify-center text-[11px] font-bold rounded-md cursor-pointer"
                aria-label="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('110')}
                style={{
                  background: fontSize === '110' ? '#2D6A4F' : 'transparent',
                  color: fontSize === '110' ? '#FAF7F0' : '#4a6355',
                }}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-md cursor-pointer"
                aria-label="Increase Font Size"
              >
                A+
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: '#2D6A4F' }}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden" style={{ borderTop: '1px solid rgba(45,106,79,0.1)', background: 'rgba(250,247,240,0.97)', backdropFilter: 'blur(20px)' }}>
          <div className="px-4 pt-3 pb-5" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navLinks.map((link) => (
              link.sectionId ? (
                <button
                  key={link.path}
                  onClick={(e) => handleSectionClick(e, link.sectionId)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '10px 12px', borderRadius: 10,
                    fontSize: '0.9rem', fontWeight: isSectionActive(link.sectionId) ? 700 : 500,
                    color: isSectionActive(link.sectionId) ? '#2D6A4F' : '#4a6355',
                    background: isSectionActive(link.sectionId) ? 'rgba(45,106,79,0.08)' : 'none',
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{ display: 'block', padding: '10px 12px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 500, color: '#4a6355', textDecoration: 'none', transition: 'all 0.2s' }}
                >
                  {link.label}
                </Link>
              )
            ))}
            
            <div style={{ borderTop: '1px solid rgba(45,106,79,0.1)', margin: '8px 0' }} />
            
            {isAuthenticated ? (
              <>
                {(isAdmin || isEditor) && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, color: '#2D6A4F', textDecoration: 'none' }}
                  >
                    <LayoutDashboard size={16} />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 500, color: '#4a6355', textDecoration: 'none' }}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, color: '#C1694F', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                style={{ display: 'block', padding: '10px 12px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 500, color: '#4a6355', textDecoration: 'none' }}
              >
                Sign In
              </Link>
            )}

            <div style={{ paddingTop: 8 }}>
              <Link
                to="/donate"
                onClick={() => setIsOpen(false)}
                className="btn-terracotta"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
