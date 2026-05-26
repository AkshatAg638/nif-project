import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, Search, Clock, ArrowRight } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Field Reports', 'Announcements', 'Events Coverage', 'CSR Success'];

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/blogs', {
        params: {
          search,
          category,
          page,
          limit: 6,
        },
      });
      if (res.data.success) {
        setBlogs(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-12">
      <Meta
        title="Field Blog"
        description="Read latest reports, announcements, and coverage of our charity projects from the field."
      />

      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Stories & Logs
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
          Our NGO Blog
        </h1>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button type="submit" className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
            Search
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
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            All News
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
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 skeleton"></div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border rounded-3xl bg-white dark:bg-slate-800">
          No blog posts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <img src={blog.image} alt={blog.title} className="w-full h-44 object-cover" />
              <div className="p-6 flex flex-col grow justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span className="uppercase">{blog.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{blog.readTime}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    <span>{blog.author}</span>
                  </span>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-0.5"
                  >
                    <span>Read More</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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

export default Blog;
