import crypto from 'crypto';

// Base32 Alphabet
const b32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Decodes a base32 string to a Buffer
const base32Decode = (str) => {
  const cleanStr = str.replace(/=+$/, '').toUpperCase();
  let bin = '';
  for (let i = 0; i < cleanStr.length; i++) {
    const val = b32chars.indexOf(cleanStr[i]);
    if (val === -1) throw new Error('Invalid base32 character');
    bin += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i < bin.length; i += 8) {
    if (i + 8 <= bin.length) {
      bytes.push(parseInt(bin.substring(i, i + 8), 2));
    }
  }
  return Buffer.from(bytes);
};

// Generates a random base32 secret
export const generateSecret = (length = 20) => {
  const bytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < bytes.length; i++) {
    secret += b32chars[bytes[i] % 32];
  }
  return secret;
};

// Validates a TOTP code against a secret
export const verifyTOTP = (token, secret, window = 1) => {
  try {
    const key = base32Decode(secret);
    const epoch = Math.round(Date.now() / 1000);
    const currentCounter = Math.floor(epoch / 30);

    for (let i = -window; i <= window; i++) {
      const counter = currentCounter + i;
      // Convert counter to 8-byte buffer
      const buffer = Buffer.alloc(8);
      let tmp = counter;
      for (let j = 7; j >= 0; j--) {
        buffer[j] = tmp & 0xff;
        tmp >>= 8;
      }

      // Generate HMAC-SHA1
      const hmac = crypto.createHmac('sha1', key);
      hmac.update(buffer);
      const hmacResult = hmac.digest();

      // Dynamic Truncation
      const offset = hmacResult[hmacResult.length - 1] & 0xf;
      const code =
        ((hmacResult[offset] & 0x7f) << 24) |
        ((hmacResult[offset + 1] & 0xff) << 16) |
        ((hmacResult[offset + 2] & 0xff) << 8) |
        (hmacResult[offset + 3] & 0xff);

      const calculatedToken = (code % 1000000).toString().padStart(6, '0');
      if (calculatedToken === token) {
        return true;
      }
    }
  } catch (error) {
    console.error('TOTP verification error:', error.message);
  }
  return false;
};
