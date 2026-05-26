import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Check, Trash2, MailOpen } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageMessages = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/contact');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin messages:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    try {
      const res = await axios.put(`/api/contact/${msg._id}`, { status: nextStatus });
      if (res.data.success) {
        showToast(`Message marked as ${nextStatus}!`, 'success');
        if (selectedMessage?._id === msg._id) {
          setSelectedMessage(res.data.data);
        }
        fetchMessages();
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`/api/contact/${id}`);
      showToast('Message deleted successfully', 'success');
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      
      {/* Messages List - Left Column */}
      <div className="lg:col-span-3 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Visitor Inquiries</h2>
          <p className="text-xs text-slate-400">Review support, sponsorship, and media inquiries from contact forms.</p>
        </div>

        {loading ? (
          <div className="h-44 skeleton"></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
            No inquiries received yet.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y dark:divide-slate-850 max-h-[70vh] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/10 transition-colors ${
                    selectedMessage?._id === msg._id ? 'bg-emerald-50/20 dark:bg-slate-700/20' : ''
                  }`}
                >
                  <div className="min-w-0 pr-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`block text-xs font-bold truncate max-w-[120px] ${msg.status === 'unread' ? 'text-slate-800 dark:text-white' : 'text-slate-500'}`}>
                        {msg.name}
                      </span>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${msg.status === 'unread' ? 'bg-emerald-500' : 'bg-transparent'}`}></span>
                    </div>
                    <span className="block text-[11px] font-semibold text-slate-650 dark:text-slate-350 truncate">{msg.subject}</span>
                    <span className="block text-[9px] text-slate-400 font-semibold">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRead(msg);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        msg.status === 'unread' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg._id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-105 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Reader - Right Column */}
      <div className="lg:col-span-2">
        {selectedMessage ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md space-y-6 animate-fade-in">
            <div className="border-b pb-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Inquiry Content</span>
              <h3 className="font-extrabold text-slate-850 dark:text-white text-base leading-tight">
                {selectedMessage.subject}
              </h3>
              <div className="text-xs text-slate-450 space-y-0.5 mt-2">
                <span className="block">From: <strong className="text-slate-700 dark:text-white">{selectedMessage.name}</strong></span>
                <span className="block font-mono">Email: <a href={`mailto:${selectedMessage.email}`} className="underline text-emerald-600">{selectedMessage.email}</a></span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-dashed whitespace-pre-wrap select-text">
              {selectedMessage.message}
            </p>

            <div className="flex gap-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="grow text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Reply via Email
              </a>
              <button
                onClick={() => handleToggleRead(selectedMessage)}
                className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-500 text-xs font-bold transition-all"
              >
                {selectedMessage.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800/20 border-2 border-dashed py-24 text-center text-slate-400 rounded-3xl font-semibold text-xs">
            Select a message card to view details.
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageMessages;
