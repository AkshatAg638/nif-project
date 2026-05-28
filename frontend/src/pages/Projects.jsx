import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Tag, Calendar, ArrowRight } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

// Svg Helpers
const SvgUnderline = ({ color = '#C1694F' }) => (
  <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="w-full h-2 absolute left-0 bottom-[-4px]" aria-hidden="true">
    <path
      d="M2,6 C20,2 40,7 55,4 C70,1 85,6 98,3"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'Education',
    'Healthcare',
    'Women Empowerment',
    'Environment',
    'Child Welfare',
    'Rural Development',
    'Disaster Relief',
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/projects', {
        params: {
          search,
          category,
          page,
          limit: 6,
        },
      });
      if (res.data.success) {
        setProjects(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-16 bg-[#FAF7F0] text-[#1a2e22]">
      <Meta
        title="Active Campaigns"
        description="Support our direct, community-managed campaigns in education, healthcare, infrastructure, and disaster relief."
      />

      {/* Header — Typographic editorial layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-6 border-b border-[#2D6A4F]/10">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F] block">Funding Clusters</span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1a2e22] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Active<br />
            <span className="relative inline-block text-[#C1694F] italic font-normal">
              Campaigns.
              <SvgUnderline color="#C1694F" />
            </span>
          </h1>
        </div>
        <div className="lg:col-span-7 pt-4 lg:pt-8">
          <p className="text-base text-[#4a6355] leading-relaxed max-w-xl">
            Choose a named project. Check its audit log, map your capital directly to its goals, and track the progress verified directly on the ground.
          </p>
        </div>
      </div>

      {/* Search & Category Filter — Sleek and Minimal (Decardified) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full lg:max-w-sm border-b border-[#2D6A4F]/20 pb-2">
          <Search size={16} className="text-[#4a6355]" />
          <input
            type="text"
            placeholder="Search active campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none py-1 text-sm text-[#1a2e22] placeholder-[#4a6355]/40 focus:outline-none focus:ring-0"
          />
          <button type="submit" className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] hover:text-[#1a2e22] cursor-pointer">
            Search
          </button>
        </form>

        {/* Categories scroll tracker */}
        <div className="flex gap-4 overflow-x-auto w-full lg:w-auto pb-2 scrollbar-thin">
          <button
            onClick={() => {
              setCategory('');
              setPage(1);
            }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
            }}
            className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all border-b-2 cursor-pointer ${
              category === '' ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-transparent text-[#4a6355] hover:text-[#2D6A4F]'
            }`}
          >
            All Clusters
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
              className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all border-b-2 shrink-0 cursor-pointer ${
                category === cat ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-transparent text-[#4a6355] hover:text-[#2D6A4F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects — Decardified & Asymmetrical Editorial layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 bg-[#2D6A4F]/5 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-[#2D6A4F]/10">
          <p className="text-[#6b8c7a] font-bold text-sm">No campaigns found in this cluster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {projects.map((project) => {
            const fundingPct = Math.min(100, Math.round((project.currentFunding / project.goalAmount) * 100));
            return (
              <div
                key={project._id}
                className="group flex flex-col justify-between space-y-6"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-2xl border border-[#2D6A4F]/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#FAF7F0]/95 backdrop-blur-md border border-[#2D6A4F]/10 text-[#2D6A4F] text-[9px] font-bold uppercase tracking-widest rounded-lg">
                    {project.category}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#6b8c7a] uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#C1694F]" />
                      {project.location}
                    </span>
                    <span className="text-[#2D6A4F]">[ {project.status} ]</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1a2e22] leading-snug line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#5c7a69] leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Typographic Funding Bar */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-end justify-between text-xs">
                      <span className="font-bold text-[#1a2e22]">{fundingPct}% funded</span>
                      <span className="text-[10px] font-bold text-[#5c7a69]">
                        ₹{project.currentFunding.toLocaleString('en-IN')} / ₹{project.goalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full h-[3px] rounded-full bg-[#2D6A4F]/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#74C69D] to-[#2D6A4F] rounded-full"
                        style={{ width: `${fundingPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#C1694F] group-hover:text-[#1a2e22] transition-colors"
                  >
                    <span>Support Campaign</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination control */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-8 border-t border-[#2D6A4F]/10">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-transparent text-[#2D6A4F] border border-[#2D6A4F]/20 rounded-xl text-xs font-bold hover:bg-[#2D6A4F]/5 disabled:opacity-30 transition-all cursor-pointer"
          >
            Prev
          </button>
          <span className="text-xs text-[#5c7a69] font-bold tracking-wide">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="px-4 py-2 bg-transparent text-[#2D6A4F] border border-[#2D6A4F]/20 rounded-xl text-xs font-bold hover:bg-[#2D6A4F]/5 disabled:opacity-30 transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default Projects;
