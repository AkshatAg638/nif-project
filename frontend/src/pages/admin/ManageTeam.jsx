import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageTeam = () => {
  const { showToast } = useToast();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [order, setOrder] = useState('0');
  const [imageFile, setImageFile] = useState(null);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team');
      if (res.data.success) {
        setTeam(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin team directory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setRole('');
    setOrder('0');
    setImageFile(null);
    setShowFormModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setOrder(member.order?.toString() || '0');
    setImageFile(null);
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingMember && !imageFile) {
      return showToast('Please select a profile image file', 'error');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('order', Number(order));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingMember) {
        await axios.put(`/api/team/${editingMember._id}`, formData);
        showToast('Member profile updated successfully!', 'success');
      } else {
        await axios.post('/api/team', formData);
        showToast('Member profile added successfully!', 'success');
      }
      setShowFormModal(false);
      fetchTeam();
    } catch (error) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this member profile?')) return;
    try {
      await axios.delete(`/api/team/${id}`);
      showToast('Profile deleted successfully', 'success');
      fetchTeam();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Leadership Team Directory</h2>
          <p className="text-xs text-slate-400">Manage profiles for board members and core foundation staff.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Plus size={16} />
          <span>Add Member</span>
        </button>
      </div>

      {loading ? (
        <div className="h-44 skeleton"></div>
      ) : team.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          No team members registered yet.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b dark:border-slate-800">
                  <th className="p-4">Avatar</th>
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Role / Position</th>
                  <th className="p-4">Sort Order</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-850">
                {team.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <img src={member.image} alt="avatar" className="h-9 w-9 rounded-full object-cover border" />
                    </td>
                    <td className="p-4 font-bold text-slate-850 dark:text-white">{member.name}</td>
                    <td className="p-4 font-semibold text-slate-500">{member.role}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-white">{member.order}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
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

      {/* Team form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-855 dark:text-white text-slate-850">
                {editingMember ? 'Modify Team Profile' : 'Add Team Member'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-400 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Vivek Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Role / Position</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chairman / Executive Trustee"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Sorting Order Index</label>
                <input
                  type="number"
                  required
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Avatar profile File</label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeam;
