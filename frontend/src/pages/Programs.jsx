import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, BookOpen, Activity, Heart, Shield, Landmark, AlertTriangle } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

export const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get('/api/programs');
        if (res.data.success) {
          setPrograms(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching programs:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // Custom icon map
  const getIcon = (category) => {
    switch (category) {
      case 'Education': return BookOpen;
      case 'Healthcare': return Activity;
      case 'Women Empowerment': return Heart;
      case 'Environment': return Shield;
      case 'Child Welfare': return Landmark;
      case 'Disaster Relief': return AlertTriangle;
      default: return Heart;
    }
  };

  const defaultPrograms = [
    {
      category: 'Education Support',
      title: 'Ignite Minds Bridge Learning',
      description: 'Bringing learning resources and school-building infrastructure to marginalized tribal children.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600',
      impactMetrics: [
        { label: 'Children Enrolled', value: '12,500+' },
        { label: 'Schools Supported', value: '85' },
      ],
    },
    {
      category: 'Healthcare Access',
      title: 'Arogya Rural Healthcare Camps',
      description: 'Running mobile medical vans and primary treatment centers to distribute critical medicines.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600',
      impactMetrics: [
        { label: 'Patients Treated', value: '35,000+' },
        { label: 'Free Camps Held', value: '140+' },
      ],
    },
    {
      category: 'Women Empowerment',
      title: 'Udyami Sewing Skill Centers',
      description: 'Instructing women in textile, tailoring, and crafting designs to encourage home businesses.',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600',
      impactMetrics: [
        { label: 'Women Trained', value: '4,200+' },
        { label: 'Businesses Started', value: '850' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-16">
      <Meta
        title="Our Programs"
        description="Explore the key programmatic sectors operated by Namokriti International Foundation, including education, health, and disaster relief."
      />

      <div className="text-center max-w-xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Core Focus Sectors
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
          Our Operational Programs
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Through strategic operations, we address grassroots challenges and build resilient communities.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 skeleton"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {(programs.length === 0 ? defaultPrograms : programs).map((prog, index) => {
            const Icon = getIcon(prog.category);
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-8 flex flex-col grow justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                        <Icon size={20} />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white text-base">
                        {prog.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-850 dark:text-white">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                      Impact Metrics Recorded
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {prog.impactMetrics?.map((met, i) => (
                        <div key={i} className="space-y-0.5">
                          <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {met.value}
                          </span>
                          <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                            {met.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Programs;
