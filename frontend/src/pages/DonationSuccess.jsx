import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Home, Heart, ArrowRight } from 'lucide-react';
import Meta from '../components/common/Meta.jsx';

export const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('id') || 'Unknown';

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-8">
      <Meta title="Thank You for Your Support" />

      {/* Success Ring */}
      <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 size={44} />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          Donation Successful!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Your payment session has completed. Thank you so much for your generous support of Namokriti Foundation.
        </p>
      </div>

      {/* Invoice receipt details */}
      <div className="bg-white dark:bg-slate-800 border p-6 rounded-2xl shadow-sm text-left space-y-4">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Transaction Details
        </h4>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex justify-between">
            <span>Receipt Reference:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-white">
              REC-{donationId.substring(18).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Exemption Status:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Tax Exempt (Section 80G)
            </span>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-700/50 my-2 pt-2 text-xs text-slate-400 leading-relaxed">
            * We have dispatched a formal PDF copy of this donation receipt directly to your registered email address.
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-sm font-bold transition-all"
        >
          <Home size={16} />
          <span>Go to Home</span>
        </Link>

        <Link
          to="/projects"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-500/10 transition-all"
        >
          <span>Other Campaigns</span>
          <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
};

export default DonationSuccess;
