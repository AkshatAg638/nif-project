import React from 'react';
import Meta from '../../components/common/Meta.jsx';

export const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20 space-y-6">
      <Meta title="Terms & Conditions" />
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Terms & Conditions</h1>
      <p className="text-xs text-slate-400">Last updated: May 26, 2026</p>
      
      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-4">
        <p>
          Welcome to Namokriti International Foundation. These terms and conditions outline the rules and regulations for the use of Namokriti International Foundation's Website, located at namokriti.org.
        </p>
        <p>
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use Namokriti International Foundation's website if you do not agree to take all of the terms and conditions stated on this page.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">1. License & Copyrights</h3>
        <p>
          Unless otherwise stated, Namokriti International Foundation owns the intellectual property rights for all material on Namokriti. All intellectual property rights are reserved. You must not republish, sell, rent, sub-license, or reproduce content without written consent.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">2. Volunteer and Donor Conduct</h3>
        <p>
          User accounts and applications submitted must represent truthful information. We reserve the right to suspend accounts or reject applications that violate social policies or engage in fraudulent activities.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
