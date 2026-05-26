import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageVolunteers = () => {
  const { showToast } = useToast();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/volunteers');
      if (res.data.success) {
        setVolunteers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin volunteers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.put(`/api/volunteers/${id}`, { status });
      if (res.data.success) {
        showToast(`Application status updated to ${status}!`, 'success');
        fetchVolunteers();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate record?')) return;
    try {
      await axios.delete(`/api/volunteers/${id}`);
      showToast('Volunteer application deleted', 'success');
      fetchVolunteers();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Volunteer Applications</h2>
        <p className="text-xs text-slate-400">Review and approve social volunteer applications.</p>
      </div>

      {loading ? (
        <div className="h-44 skeleton"></div>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          No volunteer applications received yet.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b dark:border-slate-800">
                  <th className="p-4">Candidate Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">City Location</th>
                  <th className="p-4">Skills</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-850">
                {volunteers.map((vol) => (
                  <tr key={vol._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-855 dark:text-white">{vol.name}</td>
                    <td className="p-4 text-slate-500">
                      <span className="block font-semibold">{vol.email}</span>
                      <span className="block text-[10px] text-slate-450 mt-0.5">{vol.phone}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-405">{vol.city}</td>
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {vol.skills?.map((sk, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-[10px] rounded font-semibold text-slate-600 dark:text-slate-350">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 uppercase text-[10px] font-bold text-slate-400">{vol.availability}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                          vol.status === 'approved'
                            ? 'bg-green-105 bg-green-100 text-green-700'
                            : vol.status === 'rejected'
                            ? 'bg-red-100 text-red-750 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {vol.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {vol.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(vol._id, 'approved')}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg transition-all"
                              title="Approve Candidate"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(vol._id, 'rejected')}
                              className="p-1.5 bg-red-50 hover:bg-red-650 text-red-650 hover:text-white rounded-lg transition-all"
                              title="Reject Candidate"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(vol._id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-red-500 transition-all"
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
    </div>
  );
};

export default ManageVolunteers;
