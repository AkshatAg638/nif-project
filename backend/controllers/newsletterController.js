import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    let subscriber = await NewsletterSubscriber.findOne({ email });
    if (subscriber) {
      if (subscriber.isActive) {
        return res.status(400).json({ success: false, message: 'This email is already subscribed' });
      }
      subscriber.isActive = true;
      await subscriber.save();
    } else {
      subscriber = await NewsletterSubscriber.create({ email });
    }

    res.status(201).json({ success: true, message: 'Subscribed to newsletter successfully', data: subscriber });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe email
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    const subscriber = await NewsletterSubscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber email not found' });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json({ success: true, message: 'Unsubscribed from newsletter successfully' });
  } catch (error) {
    next(error);
  }
};
