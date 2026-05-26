const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required' });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }
  next();
};

export const validateDonation = (req, res, next) => {
  const { name, email, phone, amount, paymentGateway, purpose } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Donor name is required' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid donor email is required' });
  }
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Donor phone number is required' });
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Donation amount must be a positive number' });
  }
  if (!paymentGateway || !['stripe', 'razorpay'].includes(paymentGateway)) {
    return res.status(400).json({ success: false, message: 'Payment gateway must be stripe or razorpay' });
  }
  if (!purpose) {
    return res.status(400).json({ success: false, message: 'Donation purpose is required' });
  }
  next();
};

export const validateVolunteer = (req, res, next) => {
  const { name, email, phone, skills, city, availability } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Volunteer name is required' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required' });
  }
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one skill is required' });
  }
  if (!city) {
    return res.status(400).json({ success: false, message: 'City is required' });
  }
  if (!availability || !['weekdays', 'weekends', 'flexible'].includes(availability)) {
    return res.status(400).json({ success: false, message: 'Availability must be weekdays, weekends, or flexible' });
  }
  next();
};

export const validateContactMessage = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required' });
  }
  if (!subject || subject.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Subject is required' });
  }
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Message content is required' });
  }
  next();
};
