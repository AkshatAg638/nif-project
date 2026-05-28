import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Search, Check, X, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
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

export const Events = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // RSVP Modal states
  const [rsvpEventId, setRsvpEventId] = useState(null);
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/events', {
        params: {
          search,
          category,
          timeFilter,
          page,
          limit: 6,
        },
      });
      if (res.data.success) {
        setEvents(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching events:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, timeFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpEmail) return;

    getRsvpLoading(true);
    try {
      const res = await axios.post(`/api/events/${rsvpEventId}/rsvp`, { email: rsvpEmail });
      if (res.data.success) {
        showToast('RSVP confirmed successfully! We have noted your attendance.', 'success');
        setRsvpEmail('');
        setRsvpEventId(null);
        fetchEvents(); // Refresh event rsvp list size
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'RSVP registration failed', 'error');
    } finally {
      setRsvpLoading(false);
    }
  };

  const getRsvpLoading = (val) => {
    setRsvpLoading(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-16 bg-[#FAF7F0] text-[#1a2e22]">
      <Meta
        title="Gather With Us"
        description="Join our upcoming events, diagnostic camps, educational drives, and community meetups."
      />

      {/* Header — Typographic editorial layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-6 border-b border-[#2D6A4F]/10">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F] block">Public Gatherings</span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1a2e22] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Foundation<br />
            <span className="relative inline-block text-[#C1694F] italic font-normal">
              Events.
              <SvgUnderline color="#C1694F" />
            </span>
          </h1>
        </div>
        <div className="lg:col-span-7 pt-4 lg:pt-8">
          <p className="text-base text-[#4a6355] leading-relaxed max-w-xl">
            Register your attendance for upcoming field operations, town halls, or fundraising dinners. Check details and RSVP directly.
          </p>
        </div>
      </div>

      {/* Filter Menu — Sleek & Decardified */}
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full lg:max-w-sm border-b border-[#2D6A4F]/20 pb-2">
          <Search size={16} className="text-[#4a6355]" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none py-1 text-sm text-[#1a2e22] placeholder-[#4a6355]/40 focus:outline-none focus:ring-0"
          />
          <button type="submit" className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] hover:text-[#1a2e22] cursor-pointer">
            Search
          </button>
        </form>

        {/* Time filters */}
        <div className="flex gap-6 shrink-0">
          <button
            onClick={() => {
              setTimeFilter('upcoming');
              setPage(1);
            }}
            className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all border-b-2 cursor-pointer ${
              timeFilter === 'upcoming' ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-transparent text-[#4a6355] hover:text-[#2D6A4F]'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => {
              setTimeFilter('past');
              setPage(1);
            }}
            className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all border-b-2 cursor-pointer ${
              timeFilter === 'past' ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-transparent text-[#4a6355] hover:text-[#2D6A4F]'
            }`}
          >
            Past Concluded
          </button>
        </div>
      </div>

      {/* Events Grid — Asymmetric Editorial Profile cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 bg-[#2D6A4F]/5 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-[#2D6A4F]/10">
          <p className="text-[#6b8c7a] font-bold text-sm">No events listed here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="group flex flex-col justify-between space-y-6"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden rounded-2xl border border-[#2D6A4F]/10">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#FAF7F0]/95 backdrop-blur-md border border-[#2D6A4F]/10 text-[#2D6A4F] text-[9px] font-bold uppercase tracking-widest rounded-lg">
                  {ev.category}
                </span>
              </div>

              {/* Detail Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#1a2e22] leading-snug line-clamp-1">
                  {ev.title}
                </h3>
                <p className="text-xs text-[#5c7a69] leading-relaxed line-clamp-2">
                  {ev.description}
                </p>

                {/* Event Schedule grid */}
                <div className="pt-4 border-t border-[#2D6A4F]/10 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-[#4a6355]">
                    <Calendar size={13} className="text-[#C1694F]" />
                    <span className="font-semibold">{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#4a6355]">
                    <Clock size={13} className="text-[#2D6A4F]" />
                    <span className="font-semibold">{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#4a6355]">
                    <MapPin size={13} className="text-[#2D6A4F]" />
                    <span className="font-semibold line-clamp-1">{ev.venue}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {timeFilter === 'upcoming' ? (
                  <button
                    onClick={() => setRsvpEventId(ev._id)}
                    className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#C1694F] group-hover:text-[#1a2e22] transition-colors cursor-pointer"
                  >
                    <span>RSVP Attendance</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b8c7a]">
                    Concluded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RSVP Modal overlay — Typographic modal sheets */}
      {rsvpEventId && (
        <div className="fixed inset-0 z-50 bg-[#1a2e22]/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] max-w-md w-full p-8 rounded-2xl border border-[#2D6A4F]/15 space-y-6 relative overflow-hidden shadow-2xl">
            
            <button
              onClick={() => setRsvpEventId(null)}
              className="absolute top-4 right-4 text-[#4a6355] hover:text-[#1a2e22] p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-2 text-left">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#2D6A4F]">Registration</span>
              <h3 className="text-2xl font-black text-[#1a2e22]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Confirm Attendance
              </h3>
              <p className="text-xs text-[#5c7a69] leading-relaxed">
                Provide your email address to receive immediate coordinates, entry passes, and direct updates from the field organizers.
              </p>
            </div>

            <form onSubmit={handleRSVPSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={rsvpEmail}
                onChange={(e) => setRsvpEmail(e.target.value)}
                style={{
                  background: '#FAF7F0',
                  border: '1px solid rgba(45,106,79,0.15)',
                }}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRsvpEventId(null)}
                  className="px-5 py-2.5 bg-transparent text-[#4a6355] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={rsvpLoading}
                  className="btn-terracotta text-xs py-2.5 px-6 font-bold cursor-pointer"
                >
                  {rsvpLoading ? 'Registering...' : 'Confirm RSVP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Events;
