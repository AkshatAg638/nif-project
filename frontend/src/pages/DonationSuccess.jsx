import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Home, Heart, ArrowRight, FileDown, MessageSquare, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Meta from '../components/common/Meta.jsx';

export const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('id') || '';
  
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      if (!donationId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`/api/donations/${donationId}`);
        if (res.data.success) {
          setDonation(res.data.data);
        } else {
          setError(res.data.message || 'Failed to retrieve donation details');
        }
      } catch (err) {
        console.error('Error fetching donation:', err);
        setError(err.response?.data?.message || 'Error loading transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  const handleWhatsAppShare = () => {
    if (!donation) return;
    const backendUrl = window.location.origin;
    const downloadUrl = `${backendUrl}${donation.receiptUrl}`;
    const whatsappMessage = `Dear ${donation.name},\n\nThank you so much for your donation of ${donation.currency} ${donation.amount.toFixed(2)} to Namokriti International Foundation.\n\nYou can view and download your official tax-exempt receipt (${donation.receiptNumber}) here:\n${downloadUrl}\n\nThank you for making a difference!`;
    const formattedPhone = donation.phone.replace(/[^0-9+]/g, '');
    const cleanPhone = formattedPhone.startsWith('+') ? formattedPhone.substring(1) : formattedPhone;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      <Meta title="Thank You for Your Support | Namokriti" />

      {/* Success Animation Header */}
      <div className="relative group inline-block">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
        <div className="relative h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg transform transition duration-500 hover:scale-110">
          <CheckCircle2 size={52} className="animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
          Donation Successful!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Your payment has been verified. Thank you so much for your generous support of Namokriti Foundation. Your contribution makes a lasting impact.
        </p>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700/60 p-12 rounded-3xl shadow-md flex flex-col items-center justify-center space-y-4">
          <Loader className="animate-spin text-emerald-500" size={32} />
          <p className="text-sm text-slate-500 dark:text-slate-400">Retrieving official receipt details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-6 rounded-3xl text-left flex items-start space-x-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div className="space-y-1">
            <h4 className="font-bold text-red-800 dark:text-red-300 text-sm">Verification Notice</h4>
            <p className="text-xs text-red-700 dark:text-red-400">
              {error}. Although payment was successful, we had trouble displaying the interactive invoice block. Please check your email for the receipt or contact support if the issue persists.
            </p>
          </div>
        </div>
      ) : donation ? (
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-sm text-left space-y-6 transform transition-all hover:shadow-md duration-300">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Official Tax Receipt
            </h4>
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold font-mono">
              {donation.receiptNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">Donor Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{donation.name}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">Amount Contributed</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {donation.currency} {donation.amount.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs text-slate-400 block">Supported Program / Purpose</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{donation.purpose}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">Email Address</span>
              <span className="text-slate-800 dark:text-slate-100 break-all">{donation.email}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">Tax Exemption Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Section 80G Compliant (50% Exemption)
              </span>
            </div>
          </div>

          {/* Interactive Receipts Actions Grid */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {donation.receiptUrl && (
              <a
                href={donation.receiptUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl text-sm font-bold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-250 cursor-pointer"
              >
                <FileDown size={18} />
                <span>Download Receipt PDF</span>
              </a>
            )}

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-50 hover:bg-teal-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 rounded-2xl text-sm font-bold border border-teal-100/50 dark:border-slate-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-250 cursor-pointer"
            >
              <MessageSquare size={18} />
              <span>Get Receipt on WhatsApp</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500 text-center leading-relaxed">
            * A copy of this tax invoice has also been sent directly to your registered email address.
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-6 rounded-3xl text-left flex items-start space-x-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm">Receipt Processing</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Your transaction is verified, but we couldn't load the interactive card because no reference ID was found. Please verify your email for the tax receipt document.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Options */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Home size={16} />
          <span>Go to Home</span>
        </Link>

        <Link
          to="/projects"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/65 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Heart size={16} />
          <span>Explore Campaigns</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default DonationSuccess;
