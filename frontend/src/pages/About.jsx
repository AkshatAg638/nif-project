import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Eye, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
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
    { title: 'Transparency First', desc: 'Every rupee donated goes directly to social project channels, with fully documented beneficiary logs and open audits.', number: '01' },
    { title: 'Dignified Compassion', desc: 'Empathy and respect are the baseline of our medical camps, clean water campaigns, and outreach.', number: '02' },
    { title: 'Permanent Self-Reliance', desc: 'We build vocational toolkits and bridge-learning facilities that encourage community-led development.', number: '03' },
  ];

  const timelineEvents = [
    { year: '2020', title: 'Grassroots Assembly', desc: 'Founded during the global pandemic, distributing critical medical resources directly to remote tribal villages.' },
    { year: '2022', title: 'Bridge-Learning Centers', desc: 'Launched educational kits and bridge-school structures, bringing literacy to over 1,000 children.' },
    { year: '2024', title: 'Clean Water Systems', desc: 'Drilled 50 community wells, establishing sustainable filtration centers managed directly by villages.' },
    { year: '2026', title: 'Global Alignment', desc: 'Expanding resource operations to surrounding global communities under direct local management.' },
  ];

  return (
    <div className="py-16 sm:py-24 space-y-24 bg-[#FAF7F0] text-[#1a2e22]">
      <Meta
        title="Our Story"
        description="Learn about the values, vision, leadership, and historical milestones of Namokriti International Foundation."
      />

      {/* Intro Header — Typographic Asymmetric Layout */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-3">
          <div className="section-label">Our Intentions</div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight text-[#1a2e22]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Direct Action.<br />
            <span className="relative inline-block text-[#C1694F] italic font-normal">
              Sacred Outcomes.
              <SvgUnderline color="#C1694F" />
            </span>
          </h1>
        </div>
        <div className="lg:col-span-7 pt-4 lg:pt-8">
          <p className="text-lg text-[#4a6355] leading-relaxed font-medium">
            Namokriti was established to bridge the massive void between charitable resources and local village outcomes. We are not a corporate NGO working from skyscrapers. We assemble directly inside tribal clusters, mapping every single rupee to a named school classroom, a clean water pipeline, or a woman's tailoring startup.
          </p>
        </div>
      </div>

      {/* Vision & Mission — Typographic, Offset Layout (No standard cards) */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 border-t border-[#2D6A4F]/10 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-[#C1694F] uppercase">Scope of Work</span>
          <h2 className="text-3xl font-black text-[#1a2e22]" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Blueprint
          </h2>
          <p className="text-sm text-[#4a6355] leading-relaxed">
            How we guide our decisions, map resources, and ensure that every grassroots campaign generates immediate results and permanent self-sufficiency.
          </p>
        </div>

        <div className="lg:col-span-8 space-y-12">
          {/* Vision block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <span className="md:col-span-3 text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F] pt-1 block">
              [ 01 · Vision ]
            </span>
            <div className="md:col-span-9 space-y-2">
              <h3 className="text-2xl font-bold text-[#1a2e22] leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                A World of Equal Realities
              </h3>
              <p className="text-sm sm:text-base text-[#4a6355] leading-relaxed">
                We envision a society where sustainable opportunities are not determined by geographic or economic birth. Every family, regardless of remoteness, must have access to functional education, diagnostic medicine, and independent economic toolkits.
              </p>
            </div>
          </div>

          <div className="border-t border-[#2D6A4F]/10 w-full" />

          {/* Mission block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <span className="md:col-span-3 text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F] pt-1 block">
              [ 02 · Mission ]
            </span>
            <div className="md:col-span-9 space-y-2">
              <h3 className="text-2xl font-bold text-[#1a2e22] leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                Mobilizing Community-Led Assets
              </h3>
              <p className="text-sm sm:text-base text-[#4a6355] leading-relaxed">
                To design, fund, and coordinate local initiatives managed directly by elected village councils. By eliminating middle administration and corporate overhead, we guarantee maximum resource delivery to the ground level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values — High-End Journal-Style Columns */}
      <div className="bg-[#FAF7F0] border-t border-b border-[#2D6A4F]/10 py-20 grain">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
          <div className="max-w-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F]">Core Compass</span>
            <h2 className="text-3xl font-black text-[#1a2e22]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Values we refuse to compromise.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {coreValues.map((val, i) => (
              <div key={i} className="flex flex-col justify-between py-6 border-t border-[#2D6A4F]/20 space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-[#C1694F]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem' }}>
                    {val.number}.
                  </span>
                  <h3 className="font-extrabold text-[#1a2e22] text-lg tracking-tight">{val.title}</h3>
                  <p className="text-sm text-[#4a6355] leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Board & Team Members — Elegant Profile Catalogue */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-16">
        <div className="max-w-xl space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1694F]">Guiding Voices</span>
          <h2 className="text-3xl font-black text-[#1a2e22]" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Leadership Council
          </h2>
          <p className="text-sm text-[#4a6355]">
            A dedicated group of educators, rural health practitioners, and financial auditors guiding Namokriti's direct operations.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-[#2D6A4F]/5 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {(team.length === 0 ? [
              { name: 'Shri Karan Jain(Nitin)', role: 'Founder', image: '/images/founder2.png' },
              { name: 'Shri Dharamveer Singh', role: 'Founder', image: '/images/founder1.png' },

            ] : team).map((member, i) => (
              <div key={i} className="group space-y-4">
                {/* Image Wrap with Offset Borders */}
                <div className="relative overflow-hidden rounded-2xl border border-[#2D6A4F]/10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e22]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a2e22] text-lg leading-snug">{member.name}</h4>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6b8c7a] block mt-0.5">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Section — Offset Graphic Timeline */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 border-t border-[#2D6A4F]/10 pt-20 space-y-16">
        <div className="max-w-xl space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F]">Milestones</span>
          <h2 className="text-3xl font-black text-[#1a2e22]" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Road Travelled
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {timelineEvents.map((event, i) => (
            <div key={i} className="space-y-4 relative pt-6 border-t border-[#2D6A4F]/20">
              {/* Year Marker */}
              <span className="text-2xl font-black text-[#C1694F] block" style={{ fontFamily: "'Playfair Display', serif" }}>
                {event.year}
              </span>
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1a2e22] text-base leading-snug">
                  {event.title}
                </h4>
                <p className="text-xs text-[#5c7a69] leading-relaxed">
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
