import React from 'react';
import Meta from '../../components/common/Meta.jsx';

export const DonationPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20 space-y-6">
      <Meta title="Donation Policy" />
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Donation Policy</h1>
      <p className="text-xs text-slate-400">Last updated: May 26, 2026</p>
      
      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-4">
        <p>
          We are committed to managing every donation with integrity and transparency. All donations received by Namokriti International Foundation are utilized strictly to finance core programmatic operations and emergency relief efforts.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">1. Utilization of Funds</h3>
        <p>
          Donors can specify a specific project or select "General Support". In the event a project achieves its target budget, surplus funds are allocated to adjacent projects in the same sector.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">2. Anonymous Contributions</h3>
        <p>
          We support anonymous donations. If selected, your name is hidden from any public donor walls, though transaction details are retained in administrative logs for tax compliance.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">3. CSR Partnerships</h3>
        <p>
          Corporate contributions seeking CSR certificates should coordinate directly with our outreach team to establish compliance invoices.
        </p>
      </div>
    </div>
  );
};

export default DonationPolicy;
