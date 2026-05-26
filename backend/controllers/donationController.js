import crypto from 'crypto';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import Donation from '../models/Donation.js';
import Project from '../models/Project.js';
import { sendEmail } from '../utils/email.js';
import { generateDonationReceiptPDF as genPDF } from '../utils/receiptGenerator.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_stripe_key');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
});

// Helper: Post-payment processing (email + pdf)
const finalizeDonation = async (donation) => {
  try {
    // Generate PDF receipt
    const pdfBuffer = await genPDF(donation);

    // Send thank you email with PDF attachment
    await sendEmail({
      email: donation.email,
      subject: `Thank you for your donation to Namokriti - Receipt #${donation._id.toString().substring(18).toUpperCase()}`,
      message: `Dear ${donation.name},\n\nThank you so much for your donation of ${donation.currency} ${donation.amount.toFixed(2)} for ${donation.purpose}. Your contribution makes a major difference.\n\nPlease find your official tax receipt attached to this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0d9488; text-align: center;">Thank You, ${donation.name}!</h2>
          <p>Your contribution of <strong>${donation.currency} ${donation.amount.toFixed(2)}</strong> to <strong>Namokriti International Foundation</strong> has been successfully received.</p>
          <p><strong>Purpose:</strong> ${donation.purpose}</p>
          <p><strong>Receipt ID:</strong> REC-${donation._id.toString().substring(18).toUpperCase()}</p>
          <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-left: 4px solid #0d9488; font-size: 14px; color: #475569;">
            All donations are tax-exempt under Section 80G of the Income Tax Act. Your receipt is attached as a PDF.
          </div>
          <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 30px;">
            Namokriti International Foundation &copy; 2026. All rights reserved.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `receipt_REC-${donation._id.toString().substring(18).toUpperCase()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    // Update Project funding progress if purpose maps to project
    const project = await Project.findOne({ title: donation.purpose });
    if (project) {
      project.currentFunding += donation.amount;
      if (project.currentFunding >= project.goalAmount) {
        project.status = 'completed';
      }
      await project.save();
    }
  } catch (error) {
    console.error('Error finalizing donation processing:', error.message);
  }
};

// @desc    Initiate Stripe checkout session
// @route   POST /api/donations/checkout/stripe
// @access  Public
export const checkoutStripe = async (req, res, next) => {
  try {
    const { name, email, phone, amount, purpose, isRecurring } = req.body;

    // Create a pending donation record
    const donation = await Donation.create({
      name,
      email,
      phone,
      amount,
      purpose,
      isRecurring: !!isRecurring,
      paymentGateway: 'stripe',
    });

    // Stripe checkout configuration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Donation: ${purpose}`,
              description: `Namokriti Foundation contribution by ${name}`,
            },
            unit_amount: amount * 100, // Stripe expects cents/paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/donation-success?id=${donation._id}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/donate`,
      customer_email: email,
      metadata: {
        donationId: donation._id.toString(),
      },
    });

    donation.orderId = session.id;
    await donation.save();

    res.status(200).json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate Razorpay Order
// @route   POST /api/donations/checkout/razorpay
// @access  Public
export const checkoutRazorpay = async (req, res, next) => {
  try {
    const { name, email, phone, amount, purpose } = req.body;

    const donation = await Donation.create({
      name,
      email,
      phone,
      amount,
      purpose,
      paymentGateway: 'razorpay',
    });

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${donation._id.toString().substring(18)}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    donation.orderId = order.id;
    await donation.save();

    res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
      amount: order.amount,
      currency: order.currency,
      orderId: order.id,
      donationId: donation._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/donations/verify/razorpay
// @access  Public
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Transaction signature verification failed' });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }

    donation.status = 'completed';
    donation.paymentId = razorpay_payment_id;
    await donation.save();

    // Trigger confirmation receipt dispatch in background
    finalizeDonation(donation);

    res.status(200).json({ success: true, message: 'Payment verified successfully', receiptId: donation._id });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook handler with signature check
// @route   POST /api/donations/webhook/stripe
// @access  Public
export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Construct event using RAW buffer from req.body
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'mock_webhook_secret'
    );
  } catch (err) {
    console.error(`Stripe Webhook Signature Verification Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const donationId = session.metadata.donationId;

    try {
      const donation = await Donation.findById(donationId);
      if (donation && donation.status !== 'completed') {
        donation.status = 'completed';
        donation.paymentId = session.payment_intent;
        await donation.save();

        finalizeDonation(donation);
      }
    } catch (dbErr) {
      console.error('Database update error in Stripe webhook:', dbErr.message);
    }
  }

  res.json({ received: true });
};

// @desc    Razorpay Webhook handler
// @route   POST /api/donations/webhook/razorpay
// @access  Public
export const razorpayWebhook = async (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_webhook_secret';
  const signature = req.headers['x-razorpay-signature'];

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== signature) {
    return res.status(400).send('Invalid signature');
  }

  const paymentEvent = req.body;
  if (paymentEvent.event === 'payment.captured') {
    const orderId = paymentEvent.payload.payment.entity.order_id;
    const paymentId = paymentEvent.payload.payment.entity.id;

    try {
      const donation = await Donation.findOne({ orderId });
      if (donation && donation.status !== 'completed') {
        donation.status = 'completed';
        donation.paymentId = paymentId;
        await donation.save();

        finalizeDonation(donation);
      }
    } catch (err) {
      console.error('Database update error in Razorpay webhook:', err.message);
    }
  }

  res.json({ received: true });
};

// @desc    Get all donations (paginated, filterable)
// @route   GET /api/donations
// @access  Private/Admin
export const getDonations = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { paymentId: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: donations.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export donations as CSV file
// @route   GET /api/donations/export
// @access  Private/Admin
export const exportDonationsCSV = async (req, res, next) => {
  try {
    const donations = await Donation.find({ status: 'completed' }).sort({ createdAt: -1 });

    let csvContent = 'ID,Name,Email,Phone,Amount,Purpose,Gateway,Payment ID,Date\n';

    donations.forEach((d) => {
      csvContent += `"${d._id}","${d.name}","${d.email}","${d.phone}",${d.amount},"${d.purpose}","${d.paymentGateway}","${d.paymentId || ''}","${new Date(d.createdAt).toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=donations_export.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & trends charts
// @route   GET /api/donations/stats
// @access  Private/Admin
export const getStats = async (req, res, next) => {
  try {
    // Total Completed Donations sum
    const totalDonationsArray = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalDonations = totalDonationsArray[0] ? totalDonationsArray[0].total : 0;

    // Monthly Donation Trends
    const donationTrends = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Categories Breakdown
    const categoryBreakdown = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$purpose', count: { $sum: 1 }, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDonations,
        donationTrends,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
