import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Search, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Meta from '../components/common/Meta.jsx';

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

    setRsvpLoading(true);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-12">
      <Meta
        title="NGO Events"
        description="Join our awareness campaigns, fundraising webinars, and local community service drives."
      />

      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Gather With Us
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
          Our Foundation Events
        </h1>
      </div>

      {/* Filter Menu */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button type="submit" className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
            Find
          </button>
        </form>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              setTimeFilter('upcoming');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timeFilter === 'upcoming'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => {
              setTimeFilter('past');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timeFilter === 'past'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 skeleton"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border rounded-3xl bg-white dark:bg-slate-800">
          No events registered in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <img src={ev.image} alt={ev.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col grow justify-between">
                <div className="space-y-4">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    {ev.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">{ev.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={14} />
                    <span>{new Date(ev.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{ev.venue}</span>
                  </div>

                  {timeFilter === 'upcoming' ? (
                    <button
                      onClick={() => setRsvpEventId(ev._id)}
                      className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      RSVP Attendance
                    </button>
                  ) : (
                    <div className="w-full mt-2 py-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-center font-bold text-xs rounded-xl">
                      Event Concluded
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RSVP Modal overlay */}
      {rsvpEventId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 animate-slide-up">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-slate-850 dark:text-white">RSVP for Event</h3>
              <p className="text-xs text-slate-400">
                Register your attendance and we will send notifications and calendar invites.
              </p>
            </div>

            <form onSubmit={handleRSVPSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={rsvpEmail}
                onChange={(e) => setRsvpEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRsvpEventId(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rsvpLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
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
