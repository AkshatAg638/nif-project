import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Camera, Play, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageGallery = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [category, setCategory] = useState('Education');
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/gallery');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin gallery:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFile) return showToast('Please select a file to upload', 'error');

    setUploading(true);
    const formData = new FormData();
    formData.append('category', category);
    formData.append('caption', caption);
    formData.append('image', mediaFile); // mapped to 'image' field in upload.single

    try {
      const res = await axios.post('/api/gallery', formData);
      if (res.data.success) {
        showToast('Media file uploaded successfully!', 'success');
        setShowAddModal(false);
        setCaption('');
        setMediaFile(null);
        fetchGallery();
      }
    } catch (error) {
      showToast('Media upload failed. File size limit exceeded or bad type.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;
    try {
      await axios.delete(`/api/gallery/${id}`);
      showToast('Media item deleted successfully', 'success');
      fetchGallery();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Media Library</h2>
          <p className="text-xs text-slate-400">Manage photos and video folders used across public sections.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Plus size={16} />
          <span>Upload Media</span>
        </button>
      </div>

      {loading ? (
        <div className="h-44 skeleton"></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          No media registered. Upload files to load your gallery!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="group relative h-40 bg-white dark:bg-slate-800 border rounded-2xl overflow-hidden hover:shadow-md transition-all"
            >
              <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />

              {item.mediaType === 'video' && (
                <span className="absolute top-2 left-2 p-1 bg-black/50 text-white rounded-lg">
                  <Play size={12} fill="currentColor" />
                </span>
              )}

              {/* Hover Delete Action */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-3 transition-opacity duration-300">
                <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded bg-emerald-600 self-start">
                  {item.category}
                </span>

                <div className="flex items-center justify-between w-full">
                  <p className="text-[10px] text-white truncate max-w-[120px] font-medium">
                    {item.caption || 'Field Photo'}
                  </p>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 bg-red-650 bg-red-600 hover:bg-red-750 text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Media upload modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Upload Media File</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-400 block">Category Folder</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                >
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Women Empowerment">Women Empowerment</option>
                  <option value="Environment">Environment</option>
                  <option value="Events">Events</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Media Caption</label>
                <input
                  type="text"
                  placeholder="Caption describing image..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Select File (Image/Video max 5MB)</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setMediaFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
