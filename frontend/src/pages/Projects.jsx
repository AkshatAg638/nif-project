import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Tag, Calendar } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-12">
      <Meta
        title="Donation Projects"
        description="Support our fundraising projects and donation campaigns targeting healthcare drives and child education."
      />

      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Support Our Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
          Active Campaigns
        </h1>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-md">
          <div className="relative grow">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all"
          >
            Find
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          <button
            onClick={() => {
              setCategory('');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              category === ''
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            All Sectors
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 skeleton"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border rounded-3xl bg-white dark:bg-slate-800">
          No campaigns found matching your query.
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
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        {project.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin size={14} />
                      <span>{project.location}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>{fundingPct}% Funded</span>
                        <span>₹{project.currentFunding.toLocaleString()} / ₹{project.goalAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${fundingPct}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      to={`/projects/${project.slug}`}
                      className="block w-full text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
                    >
                      View Details & Donate
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination control */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            Prev
          </button>
          <span className="text-xs text-slate-500 font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default Projects;
