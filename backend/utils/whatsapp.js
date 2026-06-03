import dotenv from 'dotenv';

dotenv.config();

/**
 * Dispatch a WhatsApp notification using a configured gateway.
 * Currently supports Twilio.
 * @param {Object} options Options containing target phone and message content
 * @param {String} options.to Donor's phone number
 * @param {String} options.message Text message to be sent
 */
export const sendWhatsApp = async ({ to, message }) => {
  const provider = process.env.WHATSAPP_PROVIDER || 'none';

  if (!to) {
    console.warn('⚠️  [WHATSAPP SERVICE] Recipient phone number is missing.');
    return { success: false, error: 'Recipient phone missing' };
  }

  if (provider === 'none' || provider === '') {
    console.log(`ℹ️  [WHATSAPP SERVICE] Provider is 'none'. Notification would be sent to: ${to}`);
    console.log(`   Message content: "${message}"`);
    return { success: true, message: 'Skipped send (provider: none)' };
  }

  if (provider === 'twilio') {
    const accountSid = process.env.WHATSAPP_ACCOUNT_SID;
    const authToken = process.env.WHATSAPP_AUTH_TOKEN;
    const fromNumber = process.env.WHATSAPP_FROM_NUMBER; // e.g., +14155238886 (Twilio sandbox)

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('⚠️  [WHATSAPP SERVICE] Twilio configuration is missing in backend/.env.');
      return { success: false, error: 'Configuration missing' };
    }

    try {
      // Clean target phone number: keep only digits and leading '+'
      let formattedTo = to.replace(/[^0-9+]/g, '');
      if (!formattedTo.startsWith('+')) {
        if (formattedTo.length === 10) {
          formattedTo = `+91${formattedTo}`;
        } else if (formattedTo.length === 12 && formattedTo.startsWith('91')) {
          formattedTo = `+${formattedTo}`;
        }
      }

      // Clean sender phone number
      let formattedFrom = fromNumber.replace(/[^0-9+]/g, '');
      if (!formattedFrom.startsWith('+')) {
        if (formattedFrom.length === 10) {
          formattedFrom = `+91${formattedFrom}`;
        } else if (formattedFrom.length === 12 && formattedFrom.startsWith('91')) {
          formattedFrom = `+${formattedFrom}`;
        }
      }

      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
          To: `whatsapp:${formattedTo}`,
          From: `whatsapp:${formattedFrom}`,
          Body: message,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Twilio HTTP error ${response.status}`);
      }

      console.log(`✅  [WHATSAPP SERVICE] Message sent successfully to ${formattedTo}. SID: ${data.sid}`);
      return { success: true, sid: data.sid };
    } catch (error) {
      console.error(`❌  [WHATSAPP SERVICE] Twilio sending error:`, error.message);
      return { success: false, error: error.message };
    }
  }

  console.warn(`⚠️  [WHATSAPP SERVICE] Unsupported provider: '${provider}'`);
  return { success: false, error: `Unsupported provider: ${provider}` };
};

export default sendWhatsApp;
