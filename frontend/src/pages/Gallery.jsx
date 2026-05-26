import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Play } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

export const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  
  // Lightbox overlay states
  const [activeMedia, setActiveMedia] = useState(null);

  const categories = [
    'Education',
    'Healthcare',
    'Women Empowerment',
    'Environment',
    'Events',
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/gallery', {
          params: { category },
        });
        if (res.data.success) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [category]);

  const defaultMockMedia = [
    { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600', mediaType: 'image', category: 'Education', caption: 'Donation of books and supplies.' },
    { url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600', mediaType: 'image', category: 'Women Empowerment', caption: 'Sewing workshop for ladies.' },
    { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600', mediaType: 'image', category: 'Healthcare', caption: 'Mobile health checkup camp.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-12">
      <Meta
        title="Media Gallery"
        description="Browse photo and video archives of our field campaigns, donation drives, and success stories."
      />

      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Our Records
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
          Visual Archives
        </h1>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none py-1 border-b pb-4">
        <button
          onClick={() => setCategory('')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            category === ''
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
          }`}
        >
          All Photos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              category === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 skeleton"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(items.length === 0 ? defaultMockMedia : items).map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveMedia(item)}
              className="group relative h-48 rounded-2xl overflow-hidden border cursor-pointer hover:shadow-lg shadow-sm transition-all"
            >
              <img
                src={item.url}
                alt={item.caption || 'gallery'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Play button indicator overlay for videos */}
              {item.mediaType === 'video' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                  <span className="p-3 rounded-full bg-emerald-600 text-white shadow-md">
                    <Play size={18} fill="currentColor" />
                  </span>
                </div>
              )}

              {/* Hover Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  {item.category}
                </span>
                <p className="text-[11px] font-medium line-clamp-1 mt-0.5">{item.caption || 'Field Archive'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox full-screen overlay */}
      {activeMedia && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setActiveMedia(null)}
            className="absolute top-5 right-5 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
            {activeMedia.mediaType === 'video' ? (
              <video src={activeMedia.url} controls autoPlay className="max-h-[85vh] rounded-xl shadow-2xl" />
            ) : (
              <img src={activeMedia.url} alt={activeMedia.caption} className="max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            )}
          </div>
          
          {activeMedia.caption && (
            <div className="max-w-xl text-center text-slate-300 text-sm mt-4 leading-relaxed font-semibold">
              {activeMedia.caption}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Gallery;
