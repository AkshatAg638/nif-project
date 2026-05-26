import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Shield, Heart, Info, DollarSign } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Meta from '../components/common/Meta.jsx';

export const Donate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [paymentGateway, setPaymentGateway] = useState('stripe');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch campaigns for Purpose selector
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('/api/projects');
        if (res.data.success) {
          setProjects(res.data.data);
          
          // Preselect purpose if provided in query param
          const purposeParam = searchParams.get('purpose');
          if (purposeParam) {
            setPurpose(purposeParam);
          } else if (res.data.data.length > 0) {
            setPurpose(res.data.data[0].title);
          } else {
            setPurpose('General Contribution');
          }
        }
      } catch (err) {
        console.error('Error loading campaigns:', err.message);
        setPurpose('General Contribution');
      } finally {
        setCampaignsLoading(false);
      }
    };
    fetchCampaigns();
  }, [searchParams]);

  const handleQuickAmount = (val) => {
    setAmount(val.toString());
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return showToast('Please enter a valid donation amount', 'error');
    }

    setLoading(true);

    const payload = {
      name: isAnonymous ? 'Anonymous' : name,
      email,
      phone,
      amount: Number(amount),
      purpose,
      paymentGateway,
      isRecurring,
    };

    try {
      if (paymentGateway === 'stripe') {
        const res = await axios.post('/api/donations/checkout/stripe', payload);
        if (res.data.success && res.data.url) {
          // Redirect to Stripe checkout
          window.location.href = res.data.url;
        }
      } else if (paymentGateway === 'razorpay') {
        const res = await axios.post('/api/donations/checkout/razorpay', payload);
        if (res.data.success) {
          const options = {
            key: res.data.keyId,
            amount: res.data.amount,
            currency: res.data.currency,
            name: 'Namokriti Foundation',
            description: `Contribution for ${purpose}`,
            image: 'https://res.cloudinary.com/demo/image/upload/v1612461204/logo.png',
            order_id: res.data.orderId,
            handler: async (response) => {
              try {
                const verifyRes = await axios.post('/api/donations/verify/razorpay', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  donationId: res.data.donationId,
                });
                if (verifyRes.data.success) {
                  showToast('Donation processed successfully. Thank you!', 'success');
                  navigate(`/donation-success?id=${verifyRes.data.receiptId}`);
                }
              } catch (verifyErr) {
                showToast(verifyErr.response?.data?.message || 'Payment verification failed', 'error');
              }
            },
            prefill: {
              name: isAnonymous ? 'Anonymous' : name,
              email: email,
              contact: phone,
            },
            notes: {
              purpose: purpose,
            },
            theme: {
              color: '#0d9488',
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Donation initialization failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
      <Meta
        title="Donate Now"
        description="Help us make a difference. Contribute to child education, rural development, and disaster relief programs."
      />

      {/* Intro Form Description */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Make a Difference
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight">
            Support Our Initiatives
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Every contribution you make helps us distribute educational supplies, mobilize diagnostic vehicles, and establish water treatment systems in vulnerable sectors.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border space-y-4">
          <div className="flex gap-4">
            <Shield className="text-emerald-500 shrink-0" size={20} />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Secure Checkout</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All transaction sessions are encrypted natively via Stripe/Razorpay protocols.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Heart className="text-emerald-500 shrink-0" size={20} />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Tax Deductions (80G)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All donations qualify for tax deductions. Formal receipt generated instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <form
        onSubmit={handleDonationSubmit}
        className="lg:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6"
      >
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">Donation Amount</h2>
        
        {/* Quick select amounts */}
        <div className="grid grid-cols-4 gap-3">
          {[500, 1000, 2000, 5000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleQuickAmount(val)}
              className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                amount === val.toString()
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              ₹{val}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="relative">
          <div className="absolute left-4 top-3 text-slate-400 font-bold">₹</div>
          <input
            type="number"
            required
            placeholder="Other custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-bold"
          />
        </div>

        {/* Dynamic selector of campaign targets */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Campaign Purpose
          </label>
          {campaignsLoading ? (
            <div className="h-10 skeleton"></div>
          ) : (
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="General Contribution">General Support Relief</option>
              {projects.map((proj) => (
                <option key={proj._id} value={proj.title}>
                  Campaign: {proj.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Donor Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Full Name</label>
              <input
                type="text"
                disabled={isAnonymous}
                required={!isAnonymous}
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Phone Contact</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 9988776655"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. rahul@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Options: anonymous or recurring */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-350 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Donate anonymously (donor wall hides name)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-slate-350 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Make this monthly recurring support
              </span>
            </label>
          </div>
        </div>

        {/* Gateway select buttons */}
        <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Select Payment Gateway
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentGateway('stripe')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                paymentGateway === 'stripe'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <CreditCard size={20} />
              <span className="text-xs">Stripe Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentGateway('razorpay')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                paymentGateway === 'razorpay'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <DollarSign size={20} />
              <span className="text-xs">Razorpay / UPI</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all"
        >
          {loading ? 'Initializing payment session...' : `Proceed with Donation (₹${amount || '0'})`}
        </button>

      </form>
    </div>
  );
};

export default Donate;
