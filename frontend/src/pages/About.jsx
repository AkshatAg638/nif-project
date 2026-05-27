import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Eye, ShieldCheck, Heart } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

export const About = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get('/api/team');
        if (res.data.success) {
          setTeam(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching team:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const coreValues = [
    { title: 'Transparency', desc: 'Ensuring that every rupee donated goes directly to social project channels with full audit logs.', icon: ShieldCheck },
    { title: 'Compassion', desc: 'Placing empathy and human dignity at the core of all healthcare and relief operations.', icon: Heart },
    { title: 'Sustainability', desc: 'Developing programs that encourage community self-reliance and environmental harmony.', icon: Target },
  ];

  const timelineEvents = [
    { year: '2020', title: 'Foundation setup', desc: 'Incorporated during the pandemic, immediately initiating medical relief camps.' },
    { year: '2022', title: 'Education Launch', desc: 'Supported our first 1,000 children with school supply kits and reading facilities.' },
    { year: '2024', title: 'Clean Water Project', desc: 'Drilled 50 community tube wells across rural areas, providing clean drinking water.' },
    { year: '2026', title: 'International expansion', desc: 'Expanding outreach resources to surrounding global regions.' },
  ];

  return (
    <div className="space-y-24 py-12 pb-20">


      {/* Intro Header */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Our Foundation Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
          Empowering Communities, Transforming Lives
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
          Namokriti International Foundation was established with a singular vision: to pave sustainable pathways for growth across underserved communities. Through grassroots partnerships and completely transparent processes, we deploy education, healthcare, and infrastructure resources where they are needed most.
        </p>
      </div>

      {/* Vision, Mission, Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg flex gap-6">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Eye size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Our Vision</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              A world where every individual, regardless of their socioeconomic origin, has direct access to high-quality education, basic health diagnosis, clean environment, and sustainable opportunities to thrive.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg flex gap-6">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Target size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Our Mission</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              To design, fund, and coordinate community-led projects that address immediate humanitarian problems and establish long-term educational, healthcare, and economic stability.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-slate-100 dark:bg-slate-800/40 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Our Compass
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
              Core Values We Uphold
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/40 dark:border-slate-700/50 shadow-sm space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">{val.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Board & Team Members */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            People Behind Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Board & Leadership Team
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 skeleton"></div>
            ))}
          </div>
        ) : team.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Show static fallback cards */}
            {[
              { name: 'Dr. Vivek Sharma', role: 'Chairman / Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200' },
              { name: 'Smt. Priya Nair', role: 'Executive Trustee', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200' },
              { name: 'Mr. Johnathan Smith', role: 'Director - International Outreach', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200' },
            ].map((member, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border text-center space-y-4 shadow-sm">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-emerald-500/10"
                />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base">{member.name}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border text-center space-y-4 shadow-sm">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-emerald-500/10"
                />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base leading-tight">{member.name}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Road Travelled
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Key Historical Milestones
          </h2>
        </div>

        <div className="relative border-l border-slate-200 dark:border-slate-700 max-w-3xl mx-auto space-y-8 pl-6">
          {timelineEvents.map((event, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow"></span>
              <div className="space-y-1">
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  {event.year}
                </span>
                <h4 className="font-bold text-slate-850 dark:text-white text-base">
                  {event.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {event.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
