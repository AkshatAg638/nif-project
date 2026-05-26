import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Target, Award, Info, FileSpreadsheet } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${slug}`);
        if (res.data.success) {
          setProject(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-500">Error</h2>
        <p className="text-slate-500">{error || 'Campaign not found.'}</p>
        <Link to="/projects" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const fundingPct = Math.min(100, Math.round((project.currentFunding / project.goalAmount) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-12">
      <Meta
        title={project.title}
        description={project.description.substring(0, 150)}
      />

      {/* Main Campaign Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Gallery / Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              {project.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{project.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[400px] object-cover rounded-3xl shadow-md border"
          />

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-b pb-2">
              Campaign Story
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Media Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Photos from the Field
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`gallery_${i}`}
                    className="w-full h-28 object-cover rounded-xl border hover:opacity-95 cursor-pointer shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Field Updates */}
          <div className="space-y-6 pt-4">
            <h3 className="text-2xl font-bold text-slate-850 dark:text-white border-b pb-2">
              Field Updates & Milestones
            </h3>
            {project.updates && project.updates.length > 0 ? (
              <div className="space-y-6">
                {project.updates.map((up) => (
                  <div key={up._id} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border flex gap-4">
                    <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Info size={16} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{up.title}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(up.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {up.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No updates registered for this campaign yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar Funding Tracker / Right Column */}
        <div className="sticky top-28 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Funding Status
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                ₹{project.currentFunding.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">
                raised
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              of ₹{project.goalAmount.toLocaleString()} campaign goal
            </span>
          </div>

          {/* Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${fundingPct}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block text-right">
              {fundingPct}% Completed
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Target size={14} className="text-emerald-500" />
              <span>Tax Benefit Exemption Eligible</span>
            </span>
          </div>

          <Link
            to={`/donate?purpose=${encodeURIComponent(project.title)}`}
            className="block w-full text-center py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 btn-premium"
          >
            Donate to this Campaign
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ProjectDetail;
