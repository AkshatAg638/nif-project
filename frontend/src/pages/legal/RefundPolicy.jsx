import React from 'react';
import Meta from '../../components/common/Meta.jsx';

export const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20 space-y-6">
      <Meta title="Refund Policy" />
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Refund Policy</h1>
      <p className="text-xs text-slate-400">Last updated: May 26, 2026</p>
      
      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-4">
        <p>
          At Namokriti International Foundation, we appreciate your generosity and contribution to our projects. Because contributions are instantly mapped to social budgets, we generally enforce a no-refund policy for donations.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">1. Erroneous / Double Transactions</h3>
        <p>
          In event of a technical discrepancy where a donor has been charged twice or entered an incorrect amount, please contact us at <a href="mailto:contact@namokriti.org" className="underline text-emerald-600">contact@namokriti.org</a> within 7 business days of the transaction.
        </p>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pt-4">2. Verification Requirements</h3>
        <p>
          Refund requests must contain the Transaction ID, order number, and billing receipt from Stripe or Razorpay. Approved adjustments will be remitted to the original payment channel.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
