import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Milestone, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageProjects = () => {
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal control states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState(null);

  // Form states (Projects)
  const [title, setTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Education');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Form states (Updates)
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/projects?limit=50'); // Pull all for dashboard management
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setGoalAmount('');
    setLocation('');
    setCategory('Education');
    setDescription('');
    setStartDate('');
    setImageFile(null);
    setShowFormModal(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setGoalAmount(proj.goalAmount.toString());
    setLocation(proj.location);
    setCategory(proj.category);
    setDescription(proj.description);
    setStartDate(new Date(proj.startDate).toISOString().substring(0, 10));
    setImageFile(null);
    setShowFormModal(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!editingProject && !imageFile) {
      return showToast('Please select a cover image file', 'error');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('goalAmount', Number(goalAmount));
    formData.append('location', location);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('startDate', startDate);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject._id}`, formData);
        showToast('Campaign details updated successfully!', 'success');
      } else {
        await axios.post('/api/projects', formData);
        showToast('New campaign created successfully!', 'success');
      }
      setShowFormModal(false);
      fetchProjects();
    } catch (error) {
      showToast(error.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const res = await axios.delete(`/api/projects/${id}`);
      if (res.data.success) {
        showToast('Campaign deleted successfully', 'success');
        fetchProjects();
      }
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/projects/${targetProjectId}/updates`, {
        title: updateTitle,
        content: updateContent,
      });
      if (res.data.success) {
        showToast('Field update posted successfully!', 'success');
        setUpdateTitle('');
        setUpdateContent('');
        setShowUpdateModal(false);
        fetchProjects();
      }
    } catch (error) {
      showToast('Failed to post update', 'error');
    }
  };

  const handleGalleryUpload = async (projectId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    showToast('Uploading gallery photo...', 'info');
    try {
      const res = await axios.post(`/api/projects/${projectId}/gallery`, formData);
      if (res.data.success) {
        showToast('Gallery image appended successfully!', 'success');
        fetchProjects();
      }
    } catch (error) {
      showToast('Upload failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Fundraising Campaigns</h2>
          <p className="text-xs text-slate-400">Launch and moderate charity goals.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Plus size={16} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Listing */}
      {loading ? (
        <div className="h-44 skeleton"></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          No campaigns found. Launch your first project!
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b dark:border-slate-800">
                  <th className="p-4">Cover</th>
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Goal Target</th>
                  <th className="p-4">Funding Progress</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-850">
                {projects.map((proj) => {
                  const pct = Math.min(100, Math.round((proj.currentFunding / proj.goalAmount) * 100));
                  return (
                    <tr key={proj._id} className="hover:bg-slate-55 hover:bg-slate-50/50">
                      <td className="p-4 shrink-0">
                        <img src={proj.image} alt="cover" className="h-9 w-14 rounded-lg object-cover border" />
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-white max-w-xs truncate">
                        {proj.title}
                      </td>
                      <td className="p-4 font-semibold text-slate-500">{proj.category}</td>
                      <td className="p-4 font-bold text-slate-800 dark:text-white">
                        ₹{proj.goalAmount.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-500 w-8">{pct}%</span>
                          <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shrink-0">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Post Update */}
                          <button
                            onClick={() => {
                              setTargetProjectId(proj._id);
                              setUpdateTitle('');
                              setUpdateContent('');
                              setShowUpdateModal(true);
                            }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-emerald-500 transition-colors"
                            title="Add Field Update"
                          >
                            <Milestone size={14} />
                          </button>

                          {/* Upload Gallery */}
                          <label className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-indigo-500 transition-colors cursor-pointer" title="Add Gallery Image">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleGalleryUpload(proj._id, e.target.files[0])}
                            />
                            <ImageIcon size={14} />
                          </label>

                          <button
                            onClick={() => openEditModal(proj)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-blue-500 transition-colors"
                            title="Edit Campaign"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteProject(proj._id)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-red-500 transition-colors"
                            title="Delete Campaign"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaign Create/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-2xl w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-805 dark:text-white text-slate-850">
                {editingProject ? 'Modify Campaign' : 'Create New Campaign'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block">Campaign Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">Goal Target Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block">Target Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-850 dark:text-white"
                  >
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Environment">Environment</option>
                    <option value="Child Welfare">Child Welfare</option>
                    <option value="Rural Development">Rural Development</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Description Story</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none resize-none text-slate-850 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Cover Image File</label>
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
                  {editingProject ? 'Save Changes' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Progress Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Post Field Update</h3>
              <button onClick={() => setShowUpdateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostUpdate} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-400 block">Update Heading</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical team reaches village"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Update Log Detail</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Details of progress made..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none resize-none text-slate-850 dark:text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Post Log Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageProjects;
