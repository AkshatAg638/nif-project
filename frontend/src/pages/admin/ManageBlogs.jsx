import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageBlogs = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Field Reports');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [imageFile, setImageFile] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Pull all logs for management (public/private drafts)
      const res = await axios.get('/api/blogs?limit=50');
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error('Error loading admin blogs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setTitle('');
    setCategory('Field Reports');
    setTags('');
    setContent('');
    setStatus('draft');
    setImageFile(null);
    setShowFormModal(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategory(blog.category);
    setTags(blog.tags?.join(', ') || '');
    setContent(blog.content);
    setStatus(blog.status);
    setImageFile(null);
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingBlog && !imageFile) {
      return showToast('Please select a featured image file', 'error');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('content', content);
    formData.append('status', status);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingBlog) {
        await axios.put(`/api/blogs/${editingBlog._id}`, formData);
        showToast('Blog post updated successfully!', 'success');
      } else {
        await axios.post('/api/blogs', formData);
        showToast('Blog post published successfully!', 'success');
      }
      setShowFormModal(false);
      fetchBlogs();
    } catch (error) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`/api/blogs/${id}`);
      showToast('Blog post deleted successfully', 'success');
      fetchBlogs();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">NGO News Blog</h2>
          <p className="text-xs text-slate-400">Publish field updates, CSR success records, and press announcements.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Plus size={16} />
          <span>New Post</span>
        </button>
      </div>

      {loading ? (
        <div className="h-44 skeleton"></div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          No articles written yet. Publish your first story!
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b dark:border-slate-800">
                  <th className="p-4">Cover</th>
                  <th className="p-4">Article Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-850">
                {blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-55 hover:bg-slate-50/50">
                    <td className="p-4">
                      <img src={b.image} alt="cover" className="h-9 w-14 rounded-lg object-cover border" />
                    </td>
                    <td className="p-4 font-bold text-slate-850 dark:text-white max-w-xs truncate">{b.title}</td>
                    <td className="p-4 font-semibold text-slate-500">{b.category}</td>
                    <td className="p-4 font-semibold text-slate-650 dark:text-slate-400">{b.author}</td>
                    <td className="p-4 text-slate-400 font-semibold">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                          b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
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

      {/* Blog form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-3xl w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-850 dark:text-white">
                {editingBlog ? 'Modify Article' : 'Publish Story'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 block">Article Title</label>
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
                    <option value="Field Reports">Field Reports</option>
                    <option value="Announcements">Announcements</option>
                    <option value="Events Coverage">Events Coverage</option>
                    <option value="CSR Success">CSR Success</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. education, health, delhi, csr"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-850 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Article Body (Supports HTML formatting)</label>
                <textarea
                  required
                  rows={8}
                  placeholder="<p>Write your story body here...</p>"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none resize-none text-slate-850 dark:text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Featured Image File</label>
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
                  {editingBlog ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
