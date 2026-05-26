import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Gift, Users, Award, Heart, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Meta from '../components/common/Meta.jsx';

export const Home = () => {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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

  // Carousel timer for testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  // Fallback defaults
  const heroData = settings?.hero || {
    title: 'Empowering Communities, Transforming Lives',
    subtitle: 'Join us in our mission to support education, healthcare, and sustainable growth for the underserved.',
    backgroundImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1400',
    donateButtonText: 'Donate Now',
    volunteerButtonText: 'Become Volunteer',
  };

  const aboutBriefData = settings?.aboutBrief || {
    title: 'Who We Are',
    content: 'Namokriti International Foundation is a non-profit organization dedicated to fostering positive growth across underserved areas through healthcare drives, environmental conservation, and educational resources.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800',
  };

  const impactSectors = [
    { title: 'Education Support', desc: 'Providing school kits, scholarships, and running bridge-learning centers.' },
    { title: 'Healthcare Access', desc: 'Conducting diagnosis camps and distributing life-saving medicines.' },
    { title: 'Women Empowerment', desc: 'Offering vocational training and self-help group startup kits.' },
    { title: 'Environmental Care', desc: 'Tree planting, sanitation drives, and solar power installations.' },
    { title: 'Child Welfare', desc: 'Ensuring balanced nutrition and protection for vulnerable kids.' },
    { title: 'Rural Development', desc: 'Upgrading water supply channels and paving primary streets.' },
  ];

  return (
    <div className="space-y-24 pb-20">
      <Meta
        title="Namokriti International Foundation | NGO"
        description="Empowering underserved communities globally via education drives, healthcare camps, and environmental relief programs."
      />

      {/* Hero Section */}
      <div
        className="relative min-h-[85vh] flex items-center bg-cover bg-center text-white"
        style={{ backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.85), rgba(15,23,42,0.4)), url(${heroData.backgroundImage})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-2xl space-y-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
              Namokriti International Foundation
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {heroData.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              {heroData.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/donate"
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {heroData.donateButtonText}
              </Link>
              <Link
                to="/volunteer"
                className="px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {heroData.volunteerButtonText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
          {[
            { value: '50K+', label: 'Beneficiaries' },
            { value: '120+', label: 'Projects Completed' },
            { value: '1.2K+', label: 'Volunteers Registered' },
            { value: '₹15M+', label: 'Funds Mobilized' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {stat.value}
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* About Foundation brief */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            About the Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
            {aboutBriefData.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {aboutBriefData.content}
          </p>
          <div className="space-y-3 pt-2">
            {[
              'Direct aid reaching the grassroots level',
              'Completely transparent financial reports & logs',
              'Driven by dedicated local coordinators globally',
            ].map((pt, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pt}</span>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
            >
              <span>Learn More Story</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-3xl transform rotate-2 scale-95 opacity-10"></div>
          <img
            src={aboutBriefData.image}
            alt="NGO kids education"
            className="relative w-full h-[380px] object-cover rounded-3xl shadow-xl"
          />
        </div>
      </div>

      {/* Our Impact / Programmatic Sectors */}
      <div className="bg-slate-100 dark:bg-slate-800/40 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Areas of Operation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
              Where We Make an Impact
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We implement holistic outreach designs covering multiple essential pillars of community growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactSectors.map((sector, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/40 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Heart size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{sector.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects / Campaigns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Active Campaigns
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
              Featured Support Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:underline"
          >
            <span>View All Campaigns</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 skeleton"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border">
            No active donation campaigns registered.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const fundingPct = Math.min(100, Math.round((project.currentFunding / project.goalAmount) * 100));
              return (
                <div
                  key={project._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 flex flex-col grow justify-between">
                    <div className="space-y-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-6 space-y-4">
                      {/* Funding Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span>{fundingPct}% Funded</span>
                          <span>₹{project.currentFunding.toLocaleString()} of ₹{project.goalAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${fundingPct}%` }}
                          ></div>
                        </div>
                      </div>

                      <Link
                        to={`/projects/${project.slug}`}
                        className="block w-full text-center py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-sm transition-colors duration-200"
                      >
                        Donate to Campaign
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Success Stories Testimonial Carousel */}
      {testimonials.length > 0 && (
        <div className="bg-emerald-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800 via-emerald-950 to-slate-950 opacity-90"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 text-center space-y-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Success Stories
            </span>
            
            <div className="space-y-6 min-h-[180px] flex flex-col justify-center">
              <p className="text-lg sm:text-2xl font-medium leading-relaxed italic text-emerald-100">
                "{testimonials[testimonialIndex].content}"
              </p>
              <div>
                <span className="block font-bold text-base text-white">
                  {testimonials[testimonialIndex].name}
                </span>
                <span className="block text-xs text-emerald-400">
                  {testimonials[testimonialIndex].role}
                </span>
              </div>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === testimonialIndex ? 'w-6 bg-emerald-400' : 'w-2 bg-emerald-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Latest Blogs / News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Latest News
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
            From the Field Blogs
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 skeleton"></div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border">
            No news articles posted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-6 flex flex-col grow justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span>{blog.category}</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white line-clamp-2">
                      {blog.title}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Read Full Post</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Partners & Sponsors Carousel */}
      <div className="bg-slate-50 dark:bg-slate-850 py-16 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
            Corporates Supporting Us
          </span>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center opacity-50 grayscale hover:opacity-80 transition-all duration-300">
            {/* Display static mock placeholders or loaded settings.sponsors */}
            {[
              'https://res.cloudinary.com/demo/image/upload/v1612461204/logo1.png',
              'https://res.cloudinary.com/demo/image/upload/v1612461204/logo2.png',
              'https://res.cloudinary.com/demo/image/upload/v1612461204/logo3.png',
              'https://res.cloudinary.com/demo/image/upload/v1612461204/logo4.png',
              'https://res.cloudinary.com/demo/image/upload/v1612461204/logo5.png',
              'https://res.cloudinary.com/demo/image/upload/v1612461204/logo6.png',
            ].map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="corporate partner logo"
                className="h-10 mx-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'; // hide broken mock logs quietly
                }}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
