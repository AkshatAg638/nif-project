/**
 * Quick test: Generate a sample donation receipt PDF to verify the seal/logo renders.
 * Run: node scripts/test-receipt.js
 * Output: scripts/test-receipt.pdf
 */

import { generateDonationReceiptPDF } from '../utils/receiptGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDonation = {
  _id: '6840abcdef1234567890abcd',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 9876543210',
  amount: 5000,
  currency: 'INR',
  purpose: 'Flood Relief Distribution — Koila Wala Gaon, Mathura',
  paymentGateway: 'razorpay',
  paymentId: 'pay_NxR4567abcXYZ',
  receiptNumber: 'NIF-0001',
  status: 'completed',
  createdAt: new Date(),
};

async function test() {
  try {
    console.log('Generating test receipt PDF...');
    const pdfBuffer = await generateDonationReceiptPDF(mockDonation);

    const outputPath = path.join(__dirname, 'test-receipt.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅  Receipt PDF generated successfully!`);
    console.log(`   Receipt Number: ${mockDonation.receiptNumber}`);
    console.log(`   File: ${outputPath}`);
    console.log(`   Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
    console.log('\nOpen it to verify the Namokriti seal is embedded.');
  } catch (error) {
    console.error('❌  Failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

test();
