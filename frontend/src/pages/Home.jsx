import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Tilt from 'react-parallax-tilt';
import {
  ArrowRight, BookOpen, Droplets, GraduationCap, Heart,
  Leaf, Users, Home as HomeIcon, Star, Quote, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Meta from '../components/common/Meta.jsx';
import About from './About.jsx';
import Programs from './Programs.jsx';
import Projects from './Projects.jsx';
import Events from './Events.jsx';

/* ── Sector cards config ─────────────────────────────────────── */
const sectorConfig = [
  {
    title: 'Education Support',
    desc: 'School kits, scholarships, and bridge-learning centers reaching 12,000+ children.',
    icon: GraduationCap,
    accent: '#2D6A4F',
    bg: '#f0f9f4',
  },
  {
    title: 'Healthcare Access',
    desc: 'Monthly diagnosis camps and medicine across 40 remote villages.',
    icon: Heart,
    accent: '#C1694F',
    bg: '#fdf5f2',
  },
  {
    title: 'Women Empowerment',
    desc: 'Vocational training for 800+ women and self-help group starter kits.',
    icon: Users,
    accent: '#E9C46A',
    bg: '#fdf8ec',
  },
  {
    title: 'Environmental Care',
    desc: 'Tree planting, sanitation drives, and solar installations.',
    icon: Leaf,
    accent: '#74C69D',
    bg: '#f0fbf4',
  },
  {
    title: 'Child Welfare',
    desc: 'Nutrition tracking and protection programs for 3,200 vulnerable children.',
    icon: HomeIcon,
    accent: '#2D6A4F',
    bg: '#f0f9f4',
  },
  {
    title: 'Rural Development',
    desc: 'Water supply, drainage, and paving of primary streets in 18 villages.',
    icon: Droplets,
    accent: '#C1694F',
    bg: '#fdf5f2',
  },
];

/* ── Stats config ────────────────────────────────────────────── */
const statsConfig = [
  { value: '50,000+', label: 'Lives Touched', sub: 'Directly Reached', icon: Heart, color: '#C1694F' },
  { value: '120',     label: 'Projects Done', sub: 'Fully Documented', icon: Star, color: '#E9C46A' },
  { value: '1,200+',  label: 'Volunteers',    sub: 'On The Ground',    icon: Users, color: '#74C69D' },
  { value: '₹1.5Cr+', label: 'Mobilised',    sub: 'Transparently',    icon: BookOpen, color: '#2D6A4F' },
];

/* ── Scroll reveal hook ──────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── SVG organic blob ────────────────────────────────────────── */
const OrgBlob = ({ color = '#74C69D', opacity = 0.12, className = '' }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
    <path
      fill={color}
      fillOpacity={opacity}
      d="M44.7,-62.3C56.6,-53.4,63.6,-37.6,67.2,-21.5C70.8,-5.4,70.9,11,64.4,24.3C57.8,37.7,44.5,47.9,30.2,56.2C15.8,64.6,0.4,71,-15.4,70.1C-31.2,69.3,-47.4,61.2,-58.2,48.5C-69,35.8,-74.4,18.5,-72.4,2.9C-70.5,-12.7,-61.1,-26.6,-50.3,-36.1C-39.5,-45.6,-27.2,-50.8,-14.2,-57.8C-1.2,-64.8,12.6,-73.7,26.7,-73.1C40.8,-72.4,55.1,-62.3,44.7,-62.3Z"
      transform="translate(100 100)"
    />
  </svg>
);

/* ── SVG underline ───────────────────────────────────────────── */
const SvgUnderline = ({ color = '#C1694F' }) => (
  <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M2,6 C20,2 40,7 55,4 C70,1 85,6 98,3"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      style={{ strokeDasharray: 120, strokeDashoffset: 120, animation: 'drawLine 1.1s 0.4s ease-out forwards' }}
    />
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────────────────── */
export const Home = () => {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const heroRef       = useRef(null);
  const statsRef      = useReveal();
  const missionRef    = useReveal();
  const sectorsRef    = useReveal();
  const campaignsRef  = useReveal();
  const testimonialsRef = useReveal();
  const blogRef       = useReveal();

  /* Parallax hero */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const y = window.scrollY;
      hero.style.transform = `translateY(${y * 0.35}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, projectsRes, blogsRes, testimonialsRes] = await Promise.all([
          axios.get('/api/settings').catch(() => ({ data: { data: null } })),
          axios.get('/api/projects?limit=3').catch(() => ({ data: { data: [] } })),
          axios.get('/api/blogs?limit=3').catch(() => ({ data: { data: [] } })),
          axios.get('/api/testimonials').catch(() => ({ data: { data: [] } })),
        ]);
        setSettings(settingsRes.data.data);
        setProjects(projectsRes.data.data || []);
        setBlogs(blogsRes.data.data || []);
        setTestimonials(testimonialsRes.data.data || []);
      } catch (err) {
        console.error('Error fetching home data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [testimonials]);

  const heroData = settings?.hero || {
    title: 'Every Child Deserves a Future',
    subtitle: 'We work inside villages — not from offices. Education for 12,000+ children, healthcare at 40 locations, and clean water for 18 communities.',
    backgroundImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format',
    donateButtonText: 'Donate Now',
    volunteerButtonText: 'Join Us on Ground',
  };

  const aboutBriefData = settings?.aboutBrief || {
    title: 'Sacred Action. Real Change.',
    content: 'Namokriti — from Sanskrit: Sacred Action. We are a registered non-profit that takes direct, documented action inside underserved Indian communities. No middlemen. No abstractions. Every rupee goes to a named village, a named person, a named outcome.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format',
  };

  return (
    <div style={{ background: '#FAF7F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Meta
        title="Namokriti International Foundation | Direct Community Action"
        description="Not charity from a distance. Namokriti funds education, healthcare, clean water, and nutrition programs directly inside 40+ Indian villages."
      />

      <section id="home">

        {/* ══════════════════════════════════════════════════════════
            HERO — Full viewport, parallax, warm editorial
            ══════════════════════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden grain"
          style={{ minHeight: '100svh', display: 'flex', alignItems: 'flex-end' }}
        >
          {/* Parallax background */}
          <div
            ref={heroRef}
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${heroData.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              transform: 'scale(1.1)',
            }}
          />

          {/* Multi-layer warm overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(15,28,20,0.88) 0%, rgba(45,106,79,0.55) 50%, rgba(193,105,79,0.25) 100%)',
            }}
          />
          {/* Bottom fade to ivory */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: '200px', background: 'linear-gradient(to top, #FAF7F0, transparent)' }}
          />


          {/* Floating blob top-right */}
          <OrgBlob
            color="#74C69D"
            opacity={0.08}
            className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          />

          {/* Hero content */}
          <div
            className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"
            style={{ paddingBottom: '7rem', paddingTop: '8rem' }}
          >
            {/* Overline */}
            <div className="anim-fade-up flex items-center gap-3 mb-6">
              <span style={{ width: 32, height: 2, background: '#74C69D', display: 'block', borderRadius: 99 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#74C69D' }}>
                Namokriti International Foundation
              </span>
            </div>

            {/* Main headline */}
            <h1
              className="anim-fade-up-1"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 900,
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                lineHeight: 1.08,
                color: '#FAF7F0',
                maxWidth: '14ch',
                marginBottom: '1.5rem',
              }}
            >
              Every Child<br />
              <span style={{ color: '#E9C46A', fontStyle: 'italic' }}>Deserves</span>{' '}
              a Future.
            </h1>

            <p
              className="anim-fade-up-2"
              style={{
                color: 'rgba(250,247,240,0.8)',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                maxWidth: '52ch',
                marginBottom: '2.5rem',
              }}
            >
              {heroData.subtitle}
            </p>

            <div className="anim-fade-up-3 flex flex-wrap gap-4">
              <Link to="/donate" className="btn-terracotta" aria-label="Donate to Namokriti">
                {heroData.donateButtonText}
                <ArrowRight size={16} />
              </Link>
              <Link to="/volunteer" className="btn-outline-ivory" aria-label="Join Namokriti as a volunteer">
                {heroData.volunteerButtonText}
              </Link>
            </div>

            {/* Quick trust signals */}
            <div
              className="anim-fade-up-4"
              style={{
                marginTop: '4rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(250,247,240,0.12)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2.5rem',
              }}
            >
              {[
                { n: '40+', t: 'Villages' },
                { n: '12,000+', t: 'Children' },
                { n: '100%', t: 'Transparent' },
              ].map((item, i) => (
                <div key={i}>
                  <span style={{ display: 'block', fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: '#FAF7F0' }}>{item.n}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(250,247,240,0.55)', marginTop: 2, letterSpacing: '0.05em' }}>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            STATS CARDS — 3D parallax tilt
            ══════════════════════════════════════════════════════════ */}
        <div ref={statsRef} className="reveal" style={{ background: '#FAF7F0', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
          {/* Background blob */}
          <OrgBlob color="#74C69D" opacity={0.06} className="absolute -top-20 -left-20 w-80 h-80 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div style={{ marginBottom: '3rem' }}>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Our Impact</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1a2e22', maxWidth: '20ch' }}>
                Numbers that mean{' '}
                <span className="highlight-word" style={{ color: '#C1694F' }}>
                  something.
                  <SvgUnderline color="#C1694F" />
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {statsConfig.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Tilt
                    key={i}
                    tiltMaxAngleX={12}
                    tiltMaxAngleY={12}
                    glareEnable={true}
                    glareMaxOpacity={0.06}
                    glareColor="#74C69D"
                    glareBorderRadius="20px"
                    transitionSpeed={600}
                    scale={1.02}
                    style={{ borderRadius: 20 }}
                  >
                    <div
                      className="stats-card anim-float"
                      style={{
                        animationDelay: `${i * 0.4}s`,
                        borderTop: `3px solid ${stat.color}`,
                      }}
                    >
                      {/* Icon */}
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <Icon size={20} color={stat.color} />
                      </div>
                      {/* Value */}
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 900, color: '#1a2e22', lineHeight: 1, marginBottom: '0.4rem' }}>
                        {stat.value}
                      </div>
                      {/* Label */}
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a2e22', marginBottom: '0.15rem' }}>{stat.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b8c7a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.sub}</div>
                    </div>
                  </Tilt>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ORGANIC WAVE DIVIDER
            ══════════════════════════════════════════════════════════ */}
        <div style={{ background: '#FAF7F0', lineHeight: 0, marginBottom: -2 }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#f5f0e8" />
          </svg>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ABOUT / MISSION — Polaroid + editorial text
            ══════════════════════════════════════════════════════════ */}
        <div
          ref={missionRef}
          className="reveal grain"
          style={{ background: '#f5f0e8', padding: '7rem 0', position: 'relative', overflow: 'hidden' }}
        >
          <OrgBlob color="#C1694F" opacity={0.06} className="absolute top-10 right-0 w-80 h-80 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* Image — Polaroid style */}
              <div className="relative flex justify-center lg:justify-start">
                <div className="polaroid" style={{ maxWidth: 460, width: '100%', transform: 'rotate(-1.5deg)' }}>
                  <img
                    src={aboutBriefData.image}
                    alt="Namokriti field team working with children"
                    style={{ width: '100%', height: 340, objectFit: 'cover', borderRadius: 2, display: 'block' }}
                  />
                </div>
                {/* Floating badge */}
                <div
                  className="anim-float absolute -bottom-4 -right-2 lg:-right-8"
                  style={{
                    background: '#2D6A4F',
                    color: '#FAF7F0',
                    borderRadius: 14,
                    padding: '1rem 1.25rem',
                    boxShadow: '0 8px 24px rgba(45,106,79,0.3)',
                    animationDelay: '0.8s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ display: 'block', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 900 }}>40+</span>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginTop: 2, opacity: 0.85, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Village<br/>Locations
                  </span>
                </div>
              </div>

              {/* Text block */}
              <div>
                <div className="section-label section-label-terra" style={{ marginBottom: '1rem' }}>Who We Are</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a2e22', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                  {aboutBriefData.title}
                </h2>
                <p style={{ color: '#4a6355', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '2rem' }}>
                  {aboutBriefData.content}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    'Every action documented to a specific village and family',
                    'Annual audit reports published publicly — zero exceptions',
                    '100% of donations tracked by named beneficiary ID',
                  ].map((pt, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ marginTop: 3, width: 20, height: 20, borderRadius: '50%', background: '#74C69D22', border: '1.5px solid #74C69D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2D6A4F', display: 'block' }} />
                      </span>
                      <span style={{ color: '#3d5546', fontSize: '0.95rem', lineHeight: 1.6 }}>{pt}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/about"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.9rem', color: '#2D6A4F', textDecoration: 'none', transition: 'gap 0.2s' }}
                  className="group"
                >
                  <span>Read the Full Story</span>
                  <ArrowRight size={16} style={{ transition: 'transform 0.2s' }} className="group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider back to ivory */}
        <div style={{ background: '#f5f0e8', lineHeight: 0, marginBottom: -2 }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
            <path d="M0,40 C360,0 720,80 1080,30 C1260,10 1380,50 1440,40 L1440,80 L0,80 Z" fill="#FAF7F0" />
          </svg>
        </div>

        {/* ══════════════════════════════════════════════════════════
            AREAS OF IMPACT — Mosaic grid
            ══════════════════════════════════════════════════════════ */}
        <div
          ref={sectorsRef}
          className="reveal"
          style={{ background: '#FAF7F0', padding: '7rem 0 6rem' }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div style={{ marginBottom: '3.5rem', maxWidth: '42ch' }}>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Areas of Operation</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1a2e22', lineHeight: 1.2 }}>
                Where we work.{' '}
                <span style={{ color: '#C1694F', fontStyle: 'italic' }}>Not where we claim to.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sectorConfig.map((sector, i) => {
                const Icon = sector.icon;
                return (
                  <div
                    key={i}
                    className="card"
                    style={{
                      padding: '1.75rem',
                      animationDelay: `${i * 0.08}s`,
                      cursor: 'default',
                      gridColumn: (i === 0 || i === 5) ? 'span 1' : undefined,
                    }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: sector.bg, border: `1.5px solid ${sector.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                      <Icon size={22} color={sector.accent} />
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a2e22', marginBottom: '0.5rem' }}>{sector.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: '#5a7567', lineHeight: 1.7 }}>{sector.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURED CAMPAIGNS
            ══════════════════════════════════════════════════════════ */}
        <div
          ref={campaignsRef}
          className="reveal grain"
          style={{ background: '#f5f0e8', padding: '7rem 0' }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
              <div>
                <div className="section-label section-label-terra" style={{ marginBottom: '0.75rem' }}>Active Campaigns</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1a2e22' }}>
                  Fund a real project.
                </h2>
              </div>
              <Link
                to="/projects"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', color: '#C1694F', textDecoration: 'none', flexShrink: 0 }}
                className="group"
              >
                <span>All Campaigns</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: 340, borderRadius: 16 }} />)}
              </div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 16, background: '#FAF7F0', border: '1px solid rgba(45,106,79,0.1)' }}>
                <p style={{ color: '#6b8c7a', fontWeight: 500 }}>No active campaigns yet.</p>
                <p style={{ color: '#8aaa97', fontSize: '0.88rem', marginTop: 6 }}>Check back soon or contact us to propose a project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const pct = Math.min(100, Math.round((project.currentFunding / project.goalAmount) * 100));
                  return (
                    <div key={project._id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={project.image}
                          alt={project.title}
                          style={{ width: '100%', height: 200, objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', background: 'rgba(250,247,240,0.92)', color: '#2D6A4F', fontSize: '0.68rem', fontWeight: 700, borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {project.category}
                        </span>
                      </div>
                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontWeight: 700, color: '#1a2e22', fontSize: '1rem', marginBottom: '0.4rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{project.title}</h3>
                        <p style={{ fontSize: '0.83rem', color: '#5a7567', lineHeight: 1.65, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1 }}>{project.description}</p>
                        <div style={{ marginTop: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#6b8c7a', marginBottom: 6 }}>
                            <span>{pct}% funded</span>
                            <span>₹{project.currentFunding?.toLocaleString()} / ₹{project.goalAmount?.toLocaleString()}</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <Link
                          to={`/projects/${project.slug}`}
                          style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: '#2D6A4F', textDecoration: 'none' }}
                          className="group"
                        >
                          <span>Donate to this campaign</span>
                          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TESTIMONIALS — Warm charcoal, editorial
            ══════════════════════════════════════════════════════════ */}
        {testimonials.length > 0 && (
          <div
            ref={testimonialsRef}
            className="reveal"
            style={{ background: '#1a2e22', padding: '7rem 0', position: 'relative', overflow: 'hidden' }}
          >
            {/* Subtle blob */}
            <OrgBlob color="#74C69D" opacity={0.07} className="absolute top-0 right-0 w-96 h-96 pointer-events-none" />

            <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div className="quote-mark" style={{ marginBottom: '-1rem' }}>"</div>

              <div style={{ minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: '#e8f0ec', lineHeight: 1.75, fontStyle: 'italic', fontWeight: 400 }}>
                  {testimonials[testimonialIndex].content}
                </p>
                <div>
                  <span style={{ display: 'block', fontWeight: 700, color: '#FAF7F0', fontSize: '1rem' }}>
                    {testimonials[testimonialIndex].name}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#74C69D', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {testimonials[testimonialIndex].role}
                  </span>
                </div>
              </div>

              {/* Pagination dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2.5rem' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    style={{
                      borderRadius: 999,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: i === testimonialIndex ? 24 : 8,
                      height: 8,
                      background: i === testimonialIndex ? '#74C69D' : 'rgba(116,198,157,0.25)',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            FIELD NOTES / BLOG
            ══════════════════════════════════════════════════════════ */}
        <div
          ref={blogRef}
          className="reveal"
          style={{ background: '#FAF7F0', padding: '7rem 0' }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '0.75rem' }}>Field Notes</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1a2e22' }}>
                  From the ground.
                </h2>
              </div>
              <Link
                to="/blog"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', color: '#2D6A4F', textDecoration: 'none', flexShrink: 0 }}
                className="group"
              >
                <span>All Field Notes</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: 280, borderRadius: 16 }} />)}
              </div>
            ) : blogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 16, background: '#f5f0e8', border: '1px solid rgba(45,106,79,0.1)' }}>
                <p style={{ color: '#6b8c7a', fontWeight: 500 }}>No field notes published yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div key={blog._id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        style={{ width: '100%', height: 180, objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 600, color: '#8aaa97', marginBottom: '0.6rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        <span>{blog.category}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h3 style={{ fontWeight: 700, color: '#1a2e22', fontSize: '1rem', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1 }}>{blog.title}</h3>
                      <Link
                        to={`/blog/${blog.slug}`}
                        style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.83rem', fontWeight: 700, color: '#C1694F', textDecoration: 'none' }}
                        className="group"
                      >
                        <span>Read Note</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CTA BANNER — Terracotta warmth
            ══════════════════════════════════════════════════════════ */}
        <div
          className="grain"
          style={{
            background: 'linear-gradient(135deg, #2D6A4F 0%, #1f4d38 50%, #C1694F22 100%)',
            padding: '5rem 1.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <OrgBlob color="#74C69D" opacity={0.10} className="absolute top-0 right-0 w-80 h-80 pointer-events-none" />
          <OrgBlob color="#E9C46A" opacity={0.07} className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none" />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#74C69D', marginBottom: '1rem' }}>
              Join The Movement
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#FAF7F0', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Be the reason a child smiles today.
            </h2>
            <p style={{ color: 'rgba(250,247,240,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Every rupee is tracked. Every impact is documented. Join 1,200+ volunteers changing real lives.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/donate" className="btn-terracotta" aria-label="Make a donation">
                Make a Donation
                <ArrowRight size={16} />
              </Link>
              <Link to="/volunteer" className="btn-outline-ivory" aria-label="Volunteer with Namokriti">
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>

      </section>

      <section id="about" className="scroll-mt-20">
        <About />
      </section>
      <section id="programs" className="scroll-mt-20">
        <Programs />
      </section>
      <section id="projects" className="scroll-mt-20">
        <Projects />
      </section>
      <section id="events" className="scroll-mt-20">
        <Events />
      </section>
    </div>
  );
};

export default Home;
