import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Shield, Heart, Info, DollarSign, ArrowRight, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Meta from '../components/common/Meta.jsx';

// Svg Helpers
const OrgBlob = ({ color = '#74C69D', opacity = 0.08, className = '' }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
    <path
      fill={color}
      fillOpacity={opacity}
      d="M44.7,-62.3C56.6,-53.4,63.6,-37.6,67.2,-21.5C70.8,-5.4,70.9,11,64.4,24.3C57.8,37.7,44.5,47.9,30.2,56.2C15.8,64.6,0.4,71,-15.4,70.1C-31.2,69.3,-47.4,61.2,-58.2,48.5C-69,35.8,-74.4,18.5,-72.4,2.9C-70.5,-12.7,-61.1,-26.6,-50.3,-36.1C-39.5,-45.6,-27.2,-50.8,-14.2,-57.8C-1.2,-64.8,12.6,-73.7,26.7,-73.1C40.8,-72.4,55.1,-62.3,44.7,-62.3Z"
      transform="translate(100 100)"
    />
  </svg>
);

const SvgUnderline = ({ color = '#C1694F' }) => (
  <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="w-full h-2 absolute left-0 bottom-[-4px]" aria-hidden="true">
    <path
      d="M2,6 C20,2 40,7 55,4 C70,1 85,6 98,3"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

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
  const [paymentGateway, setPaymentGateway] = useState('razorpay');
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
    <div className="relative min-h-screen grain py-16 sm:py-24" style={{ background: '#FAF7F0' }}>
      <Meta
        title="Donate Now"
        description="Help us make a difference. Contribute to child education, rural development, and disaster relief programs."
      />
      {/* Background blobs for organic textures */}
      <OrgBlob color="#74C69D" opacity={0.06} className="absolute top-20 left-10 w-72 h-72 pointer-events-none" />
      <OrgBlob color="#C1694F" opacity={0.04} className="absolute bottom-20 right-10 w-96 h-96 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: Editorial Introduction & trust guarantees */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <div className="section-label section-label-terra">Direct Support</div>
              <h1 className="text-4xl sm:text-5xl font-black text-[#1a2e22] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                True Empowerment.<br />
                <span className="relative inline-block text-[#C1694F]">
                  Sacred Action.
                  <SvgUnderline color="#C1694F" />
                </span>
              </h1>
            </div>
            
            <p className="text-base text-[#4a6355] leading-relaxed max-w-lg">
              Namokriti means sacred action. We don't fund administration or abstract layers. Every contribution you make directly enables field operations: delivering school kits, establishing solar grids, and running mobile medical vans in rural villages.
            </p>

            <div className="border-t border-[#2D6A4F]/10 pt-8 space-y-6">
              {[
                {
                  title: '100% Direct Allocation',
                  desc: 'Every rupee goes directly into field operations, and every action is fully documented and reported back to you.',
                  icon: Heart,
                  color: '#2D6A4F'
                },
                {
                  title: 'Secure Gateway Processing',
                  desc: 'All payments are encrypted natively via Stripe and Razorpay protocols. No card data is ever stored on our servers.',
                  icon: Shield,
                  color: '#C1694F'
                },
                {
                  title: 'Tax Exemption under 80G',
                  desc: 'All contributions qualify for maximum tax benefits. A formal tax receipt is generated and emailed to you instantly.',
                  icon: Info,
                  color: '#E9C46A'
                }
              ].map((item, i) => {
                const IconComp = item.icon;
                return (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="p-2.5 rounded-xl shrink-0" style={{ background: `${item.color}15`, color: item.color }}>
                      <IconComp size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#1a2e22] text-sm">{item.title}</h4>
                      <p className="text-xs text-[#5c7a69] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Elegant, decardified form flow */}
          <form onSubmit={handleDonationSubmit} className="lg:col-span-7 space-y-10">
            
            {/* Step 1: Donation Amount */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F]">01</span>
                <h3 className="text-lg font-bold text-[#1a2e22]">Donation Amount</h3>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {[500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: amount === val.toString() ? '#2D6A4F' : '#FAF7F0',
                      color: amount === val.toString() ? '#FAF7F0' : '#4a6355',
                      borderColor: amount === val.toString() ? '#2D6A4F' : 'rgba(45,106,79,0.15)',
                    }}
                    className="py-3.5 rounded-xl border text-sm font-bold transition-all hover:scale-[1.02] active:scale-100 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Custom Input Block */}
              <div className="relative group">
                <div className="absolute left-0 bottom-4 text-2xl font-bold text-[#2D6A4F] pointer-events-none">₹</div>
                <input
                  type="number"
                  required
                  placeholder="Other custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    borderBottom: '2px solid rgba(45, 106, 79, 0.15)',
                  }}
                  className="w-full bg-transparent border-t-0 border-l-0 border-r-0 pl-7 pr-4 py-3.5 text-3xl font-black text-[#1a2e22] placeholder-[#4a6355]/40 focus:outline-none focus:border-[#2D6A4F] transition-all"
                />
              </div>
            </div>

            {/* Step 2: Purpose selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F]">02</span>
                <h3 className="text-lg font-bold text-[#1a2e22]">Campaign Purpose</h3>
              </div>

              <div className="relative">
                {campaignsLoading ? (
                  <div className="h-12 bg-[#2D6A4F]/5 animate-pulse rounded-xl"></div>
                ) : (
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    style={{
                      background: '#FAF7F0',
                      border: '1px solid rgba(45,106,79,0.15)',
                      color: '#1a2e22',
                    }}
                    className="w-full rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] cursor-pointer"
                  >
                    <option value="General Contribution">General Support Relief (Greatest Need)</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj.title}>
                        Campaign: {proj.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Step 3: Donor details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F]">03</span>
                <h3 className="text-lg font-bold text-[#1a2e22]">Donor Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4a6355] uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    required={!isAnonymous}
                    placeholder={isAnonymous ? 'Anonymous Donor' : 'e.g. Rahul Sharma'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      background: isAnonymous ? 'rgba(45,106,79,0.03)' : '#FAF7F0',
                      border: '1px solid rgba(45,106,79,0.15)',
                    }}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4a6355] uppercase tracking-wider block">Phone Contact</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9988776655"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      background: '#FAF7F0',
                      border: '1px solid rgba(45,106,79,0.15)',
                    }}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4a6355] uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: '#FAF7F0',
                    border: '1px solid rgba(45,106,79,0.15)',
                  }}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between pt-3 border-t border-[#2D6A4F]/10">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${isAnonymous ? 'bg-[#2D6A4F] border-[#2D6A4F]' : 'border-slate-350 bg-[#FAF7F0]'}`}>
                      {isAnonymous && <Check size={12} className="text-[#FAF7F0] stroke-[3]" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#4a6355]">
                    Donate anonymously (donor wall hides name)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${isRecurring ? 'bg-[#2D6A4F] border-[#2D6A4F]' : 'border-slate-350 bg-[#FAF7F0]'}`}>
                      {isRecurring && <Check size={12} className="text-[#FAF7F0] stroke-[3]" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#4a6355]">
                    Make this monthly recurring support
                  </span>
                </label>
              </div>
            </div>

            {/* Step 4: Payment gateway */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F]">04</span>
                <h3 className="text-lg font-bold text-[#1a2e22]">Secure Gateway</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">

                <button
                  type="button"
                  onClick={() => setPaymentGateway('razorpay')}
                  style={{
                    background: '#FAF7F0',
                    borderColor: paymentGateway === 'razorpay' ? '#2D6A4F' : 'rgba(45,106,79,0.15)',
                    borderWidth: paymentGateway === 'razorpay' ? '2px' : '1px',
                  }}
                  className="p-5 rounded-2xl border flex flex-col items-center gap-2 transition-all hover:scale-[1.01] hover:shadow-sm cursor-pointer"
                >
                  <DollarSign size={20} className={paymentGateway === 'razorpay' ? 'text-[#2D6A4F]' : 'text-[#4a6355]'} />
                  <span className={`text-xs font-bold ${paymentGateway === 'razorpay' ? 'text-[#2D6A4F]' : 'text-[#4a6355]'}`}>Razorpay / UPI</span>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-terracotta justify-center py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md active:translate-y-0 cursor-pointer"
              >
                {loading ? 'Initializing secure payment session...' : `Proceed with Contribution (₹${amount ? Number(amount).toLocaleString('en-IN') : '0'})`}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Donate;
