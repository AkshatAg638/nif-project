import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ClipboardList,
  Send,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  UserCheck,
  ChevronDown,
  Plus,
  X,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageTasks = () => {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [appreciationMessage, setAppreciationMessage] = useState('');
  const [targetType, setTargetType] = useState('all');
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tasksRes, volRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/volunteers'),
      ]);
      if (tasksRes.data.success) setTasks(tasksRes.data.data);
      if (volRes.data.success) {
        // Only approved volunteers
        setVolunteers(volRes.data.data.filter((v) => v.status === 'approved'));
      }
    } catch (err) {
      console.error('Error loading tasks/volunteers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return showToast('Title and description are required', 'error');
    }
    if ((targetType === 'multiple' || targetType === 'single') && selectedVolunteers.length === 0) {
      return showToast('Please select at least one volunteer', 'error');
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        appreciationMessage: appreciationMessage.trim() || undefined,
        targetType,
        targetUserIds: targetType === 'single' ? selectedVolunteers[0] : selectedVolunteers,
      };
      const res = await axios.post('/api/tasks', payload);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setTitle('');
        setDescription('');
        setAppreciationMessage('');
        setTargetType('all');
        setSelectedVolunteers([]);
        setShowForm(false);
        fetchAll();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/tasks/${id}`);
      showToast('Task deleted', 'success');
      fetchAll();
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  const toggleVolunteer = (userId) => {
    if (targetType === 'single') {
      setSelectedVolunteers([userId]);
    } else {
      setSelectedVolunteers((prev) =>
        prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
      );
    }
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Volunteer Work Assignment</h2>
          <p className="text-xs text-slate-400 mt-0.5">Assign tasks to volunteers individually, in groups, or all at once.</p>
        </div>
        <button
          onClick={() => setShowForm((f) => !f)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Close' : 'Assign New Task'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, color: 'bg-slate-50 border-slate-100 text-slate-700', icon: ClipboardList },
          { label: 'Pending', value: pendingCount, color: 'bg-amber-50 border-amber-100 text-amber-700', icon: Clock },
          { label: 'Completed', value: completedCount, color: 'bg-green-50 border-green-100 text-green-700', icon: CheckCircle2 },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-2xl p-5 flex items-center gap-4`}>
            <stat.icon size={22} />
            <div>
              <span className="text-2xl font-black">{stat.value}</span>
              <p className="text-xs font-semibold opacity-70 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm space-y-6"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Send size={18} className="text-emerald-500" />
            New Task Assignment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Community Outreach Drive"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assign To *</label>
              <select
                value={targetType}
                onChange={(e) => { setTargetType(e.target.value); setSelectedVolunteers([]); }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Approved Volunteers</option>
                <option value="multiple">Select Multiple Volunteers</option>
                <option value="single">Select One Volunteer</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the volunteer needs to do..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Appreciation Message <span className="font-normal text-slate-400">(optional — shown on task completion)</span>
            </label>
            <textarea
              rows={2}
              value={appreciationMessage}
              onChange={(e) => setAppreciationMessage(e.target.value)}
              placeholder="e.g. 🌟 Outstanding work! Thank you for your dedication..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Volunteer selection */}
          {(targetType === 'multiple' || targetType === 'single') && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {targetType === 'single' ? 'Select Volunteer' : 'Select Volunteers'} *
              </label>
              {volunteers.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No approved volunteers available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {volunteers.map((vol) => {
                    const isSelected = selectedVolunteers.includes(vol._id);
                    return (
                      <button
                        key={vol._id}
                        type="button"
                        onClick={() => toggleVolunteer(vol._id)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all text-xs ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`} />
                        <div className="min-w-0">
                          <span className="font-bold block truncate">{vol.name}</span>
                          <span className="text-[10px] opacity-70 truncate block">{vol.city}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Send size={15} />
            {submitting ? 'Assigning...' : 'Assign Task'}
          </button>
        </form>
      )}

      {/* Tasks Table */}
      {loading ? (
        <div className="h-64 skeleton rounded-3xl" />
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          <ClipboardList size={32} className="mx-auto mb-3 text-slate-300" />
          No tasks assigned yet. Click "Assign New Task" to get started.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b dark:border-slate-700">
                  <th className="p-4">Task</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned On</th>
                  <th className="p-4">Completed On</th>
                  <th className="p-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 max-w-xs">
                      <span className="font-bold text-slate-800 dark:text-white block">{task.title}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5">{task.description}</span>
                    </td>
                    <td className="p-4">
                      {task.assignedTo ? (
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 block">{task.assignedTo.name}</span>
                          <span className="text-[10px] text-slate-400">{task.assignedTo.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Deleted user</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {task.status === 'completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(task.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-slate-500">
                      {task.completedAt
                        ? new Date(task.completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                        title="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
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

export default ManageTasks;
