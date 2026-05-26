import nodemailer from 'nodemailer';

/**
 * Dispatch an email using SMTP transport configurations.
 * @param {Object} options email configurations (email, subject, message, html, attachments)
 */
export const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
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
