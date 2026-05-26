import React from 'react';
import Meta from '../../components/common/Meta.jsx';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20 space-y-6">
      <Meta title="Privacy Policy" />
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last updated: May 26, 2026</p>
      
      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-4">
        <p>
          At Namokriti International Foundation, accessible from namokriti.org, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Namokriti International Foundation and how we use it.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">1. Personal Information We Collect</h3>
        <p>
          When you make a donation, apply to volunteer, or contact us directly, we collect personal details such as your name, email address, telephone contact, billing details, and skills list. This data is collected to verify transactions, manage applications, and dispatch email receipts.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">2. Cookies and Logs</h3>
        <p>
          We use HTTP cookies to maintain login states (admin sessions) and load analytics. You can choose to disable cookies through your individual browser options.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">3. Data Security</h3>
        <p>
          All transaction data is processed over secure SSL connections. We enforce strict role-based access restrictions to prevent leaks or unauthorized editing of donor lists.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
