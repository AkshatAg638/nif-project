import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Users, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageEvents = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [activeRsvpList, setActiveRsvpList] = useState([]);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fundraiser');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/events?limit=50');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin events:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    setCategory('Fundraiser');
    setVenue('');
    setDate('');
    setTime('');
    setDescription('');
    setImageFile(null);
    setShowFormModal(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setCategory(ev.category);
    setVenue(ev.venue);
    setDate(new Date(ev.date).toISOString().substring(0, 10));
    setTime(ev.time);
    setDescription(ev.description);
    setImageFile(null);
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent && !imageFile) {
      return showToast('Please select a cover image file', 'error');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('venue', venue);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingEvent) {
        await axios.put(`/api/events/${editingEvent._id}`, formData);
        showToast('Event details updated successfully!', 'success');
      } else {
        await axios.post('/api/events', formData);
        showToast('Event created successfully!', 'success');
      }
      setShowFormModal(false);
      fetchEvents();
    } catch (error) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/api/events/${id}`);
      showToast('Event deleted successfully', 'success');
      fetchEvents();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">NGO Outreach Events</h2>
          <p className="text-xs text-slate-400">Launch and organize community gathers.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Plus size={16} />
          <span>Create Event</span>
        </button>
      </div>

      {loading ? (
        <div className="h-44 skeleton"></div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          No events found. Organize your first event!
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b dark:border-slate-800">
                  <th className="p-4">Cover</th>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date / Time</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">RSVPs</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-850">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <img src={ev.image} alt="cover" className="h-9 w-14 rounded-lg object-cover border" />
                    </td>
                    <td className="p-4 font-bold text-slate-850 dark:text-white max-w-xs truncate">{ev.title}</td>
                    <td className="p-4 font-semibold text-slate-500">{ev.category}</td>
                    <td className="p-4 text-slate-500">
                      <span className="block font-semibold">{new Date(ev.date).toLocaleDateString()}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{ev.time}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-650 dark:text-slate-400 max-w-xs truncate">{ev.venue}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-white">{ev.rsvpList?.length || 0} RSVPs</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setActiveRsvpList(ev.rsvpList || []);
                            setShowRsvpModal(true);
                          }}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-emerald-500 transition-colors"
                          title="View RSVP List"
                        >
                          <Users size={14} />
                        </button>
                        <button
                          onClick={() => openEditModal(ev)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(ev._id)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Event Add/Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-2xl w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-850 dark:text-white">
                {editingEvent ? 'Modify Event' : 'Organize Event'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                  >
                    <option value="Fundraiser">Fundraiser</option>
                    <option value="Awareness">Awareness</option>
                    <option value="Volunteer Drive">Volunteer Drive</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block">Venue</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-850 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM - 2:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Event Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-850 dark:text-white focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Banner image File</label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RSVP Attendees List Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-855 dark:text-white text-slate-850">RSVP Registrations</h3>
              <button onClick={() => setShowRsvpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {activeRsvpList.length === 0 ? (
              <p className="text-center text-xs text-slate-400 italic py-6">No registrations received yet.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {activeRsvpList.map((email, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-mono font-bold text-slate-600 dark:text-slate-350">
                    {email}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
