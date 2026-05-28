import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, BookOpen, Activity, Heart, Shield, Landmark, AlertTriangle } from 'lucide-react';
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

  const defaultPrograms = [
    {
      category: 'Education Support',
      title: 'Ignite Minds Bridge Learning',
      description: 'Establishing grassroots learning clusters, distributing customized school kits, and funding classrooms directly managed by local tribal village councils.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format',
      impactMetrics: [
        { label: 'Children Reached', value: '12,500+' },
        { label: 'School Clusters', value: '85' },
      ],
    },
    {
      category: 'Healthcare Access',
      title: 'Arogya Rural Diagnosis Camps',
      description: 'Deploying mobile medical vans, funding direct village medicine centers, and conducting regular specialist diagnosis camps in remote sectors.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format',
      impactMetrics: [
        { label: 'Patients Treated', value: '35,000+' },
        { label: 'Free Mobile Vans', value: '140+' },
      ],
    },
    {
      category: 'Women Empowerment',
      title: 'Udyami Craft & Tailoring Centers',
      description: 'Equipping women with textile design knowledge, providing sewing starters, and guiding self-help groups to build independent local businesses.',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format',
      impactMetrics: [
        { label: 'Women Equipped', value: '4,200+' },
        { label: 'Micro-Businesses', value: '850' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-20 bg-[#FAF7F0] text-[#1a2e22]">
      <Meta
        title="Our Focus Sectors"
        description="Explore the educational, medical, and community empowerment initiatives coordinates directly by Namokriti Foundation."
      />

      {/* Header — Typographic editorial layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-6 border-b border-[#2D6A4F]/10">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F] block">Sectors of Action</span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1a2e22] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Operational<br />
            <span className="relative inline-block text-[#C1694F] italic font-normal">
              Programs.
              <SvgUnderline color="#C1694F" />
            </span>
          </h1>
        </div>
        <div className="lg:col-span-7 pt-4 lg:pt-8">
          <p className="text-base text-[#4a6355] leading-relaxed max-w-xl">
            We do not deploy vague or abstract programs. Namokriti maps capital directly to immediate community demands. Each focus sector delivers documented, audit-ready support under the direct oversight of local village leadership.
          </p>
        </div>
      </div>

      {/* Programs List — Typographic Asymmetric Journal style */}
      {loading ? (
        <div className="space-y-12">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 bg-[#2D6A4F]/5 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-20 sm:space-y-28">
          {(programs.length === 0 ? defaultPrograms : programs).map((prog, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                {/* Image Section — Alternating layout */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative group overflow-hidden rounded-2xl border border-[#2D6A4F]/10 shadow-sm">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#2D6A4F]/5 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0" />
                  </div>
                </div>

                {/* Content Section */}
                <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C1694F]">
                      [ {prog.category} ]
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#1a2e22] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {prog.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-[#4a6355] leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Impact metrics: sleek typography rows instead of card blocks */}
                  <div className="pt-6 border-t border-[#2D6A4F]/10 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-[#2D6A4F] tracking-widest">
                      Documented Ground Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-6 pt-2">
                      {prog.impactMetrics?.map((met, i) => (
                        <div key={i} className="space-y-1">
                          <span className="block text-3xl font-black text-[#C1694F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {met.value}
                          </span>
                          <span className="block text-[11px] font-bold text-[#4a6355] uppercase tracking-wider leading-snug">
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
