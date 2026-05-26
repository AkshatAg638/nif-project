import React from 'react';
import Meta from '../../components/common/Meta.jsx';

export const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20 space-y-6">
      <Meta title="Cookie Policy" />
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Cookie Policy</h1>
      <p className="text-xs text-slate-400">Last updated: May 26, 2026</p>
      
      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-4">
        <p>
          This Cookie Policy explains how Namokriti International Foundation uses cookies and similar tracking technologies to recognize you when you visit our website at namokriti.org.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">1. What are Cookies?</h3>
        <p>
          Cookies are small text data files saved in your local browser when you access a webpage. They help store sessions, language, and analytics configurations.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">2. Cookies We Deploy</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Essential Session Cookies:</strong> Required to preserve administrative login authorization.</li>
          <li><strong>Analytics Cookies:</strong> Combined with Google Analytics to monitor page popularity and visitors count.</li>
        </ul>
      </div>
    </div>
  );
};

export default CookiePolicy;
