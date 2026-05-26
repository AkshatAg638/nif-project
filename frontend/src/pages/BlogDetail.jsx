import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, Clock, ChevronLeft } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

export const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${slug}`);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch article details');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-500">Error</h2>
        <p className="text-slate-500">{error || 'Article not found.'}</p>
        <Link to="/blog" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20 space-y-8">
      <Meta
        title={blog.title}
        description={blog.content.substring(0, 150)}
      />

      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to Blog Catalog</span>
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          {blog.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight">
          {blog.title}
        </h1>
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-6 text-xs text-slate-400 font-semibold border-y py-3 border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            <span>By {blog.author}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>Published: {new Date(blog.createdAt).toLocaleDateString()}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{blog.readTime}</span>
          </span>
        </div>
      </div>

      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-80 sm:h-[420px] object-cover rounded-3xl border shadow-sm"
      />

      {/* Content Body */}
      <article
        className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-350 text-sm sm:text-base leading-relaxed space-y-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags section */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex items-center gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((t, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogDetail;
