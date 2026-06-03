import nodemailer from 'nodemailer';

/**
 * Dispatch an email using SMTP transport configurations.
 * @param {Object} options email configurations (email, subject, message, html, attachments)
 */
export const sendEmail = async (options) => {
  // Check if SMTP is configured
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  
  if (!smtpUser || smtpUser === 'your_smtp_user' || !smtpPass || smtpPass === 'your_smtp_password') {
    console.warn(`⚠️  [EMAIL SERVICE] SMTP credentials are not configured in backend/.env. Skipping email dispatch to ${options.email}.`);
    return { success: false, message: 'SMTP credentials not configured' };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME || 'Namokriti International Foundation'} <${process.env.FROM_EMAIL || 'no-reply@namokriti.org'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    attachments: options.attachments || [],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent: %s', info.messageId);
};

export default sendEmail;
