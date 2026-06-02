import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve path to the Namokriti Foundation logo (seal)
const LOGO_PATH = path.resolve(__dirname, '../assets/logo.jpeg');

// Brand colours
const FOREST = '#2D6A4F';
const TERRA = '#C1694F';
const DARK = '#1a2e22';
const MUTED = '#4a6355';
const LIGHT_MUTED = '#6b8c7a';
const IVORY = '#FAF7F0';
const BORDER = '#d4ddd8';

/**
 * Draws a horizontal rule across the page.
 */
function hr(doc, y, color = BORDER, width = 0.8) {
  doc.strokeColor(color).lineWidth(width).moveTo(50, y).lineTo(545, y).stroke();
}

/**
 * Generates a professional donation receipt PDF with the Namokriti Foundation seal.
 * @param {Object} donation  Donation document from MongoDB
 * @returns {Promise<Buffer>} Resolves with PDF file buffer
 */
export const generateDonationReceiptPDF = (donation) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const receiptId = donation.receiptNumber || `REC-${donation._id.toString().substring(18).toUpperCase()}`;
      const donationDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // ─── HEADER: Logo + Foundation Name ───────────────────────────
      const logoExists = fs.existsSync(LOGO_PATH);
      const headerY = 45;

      if (logoExists) {
        doc.image(LOGO_PATH, 50, headerY, { width: 60, height: 60 });
      }

      const textX = logoExists ? 120 : 50;

      doc
        .fillColor(FOREST)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('Namokriti International Foundation', textX, headerY + 5, { width: 420 });

      doc
        .fillColor(MUTED)
        .fontSize(7.5)
        .font('Helvetica')
        .text(
          'Regd. Office: Mathura, Uttar Pradesh, India  |  contact@namokriti.org  |  www.namokriti.org',
          textX,
          headerY + 28,
          { width: 420 }
        );

      // ─── Top border accent ────────────────────────────────────────
      doc.save();
      doc
        .rect(50, headerY + 48, 495, 3)
        .fill(FOREST);
      doc.restore();

      let currentY = headerY + 64;

      // ─── RECEIPT TITLE ────────────────────────────────────────────
      doc
        .fillColor(DARK)
        .fontSize(15)
        .font('Helvetica-Bold')
        .text('DONATION RECEIPT', 50, currentY, { align: 'center', width: 495 });

      currentY += 22;

      doc
        .fillColor(LIGHT_MUTED)
        .fontSize(8)
        .font('Helvetica')
        .text(`Receipt No: ${receiptId}  •  Date: ${donationDate}`, 50, currentY, {
          align: 'center',
          width: 495,
        });

      currentY += 22;
      hr(doc, currentY);
      currentY += 16;

      // ─── DONOR DETAILS TABLE ──────────────────────────────────────
      doc
        .fillColor(FOREST)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Donor Information', 50, currentY);
      currentY += 18;

      const labelX = 55;
      const valueX = 180;
      const rightLabelX = 320;
      const rightValueX = 430;

      // Row 1
      doc.font('Helvetica').fontSize(9).fillColor(LIGHT_MUTED).text('Donor Name:', labelX, currentY);
      doc.font('Helvetica-Bold').fillColor(DARK).text(donation.name, valueX, currentY);

      doc.font('Helvetica').fillColor(LIGHT_MUTED).text('Receipt No:', rightLabelX, currentY);
      doc.font('Helvetica-Bold').fillColor(DARK).text(receiptId, rightValueX, currentY);
      currentY += 18;

      // Row 2
      doc.font('Helvetica').fillColor(LIGHT_MUTED).text('Email:', labelX, currentY);
      doc.font('Helvetica-Bold').fillColor(DARK).text(donation.email, valueX, currentY);

      doc.font('Helvetica').fillColor(LIGHT_MUTED).text('Date:', rightLabelX, currentY);
      doc.font('Helvetica-Bold').fillColor(DARK).text(donationDate, rightValueX, currentY);
      currentY += 18;

      // Row 3
      doc.font('Helvetica').fillColor(LIGHT_MUTED).text('Phone:', labelX, currentY);
      doc.font('Helvetica-Bold').fillColor(DARK).text(donation.phone || 'N/A', valueX, currentY);

      doc.font('Helvetica').fillColor(LIGHT_MUTED).text('Payment Mode:', rightLabelX, currentY);
      doc
        .font('Helvetica-Bold')
        .fillColor(DARK)
        .text((donation.paymentGateway || 'N/A').toUpperCase(), rightValueX, currentY);
      currentY += 18;

      // Row 4
      doc.font('Helvetica').fillColor(LIGHT_MUTED).text('Transaction ID:', labelX, currentY);
      doc
        .font('Helvetica-Bold')
        .fillColor(DARK)
        .text(donation.paymentId || 'Pending', valueX, currentY, { width: 350 });
      currentY += 24;

      hr(doc, currentY);
      currentY += 16;

      // ─── DONATION BREAKDOWN TABLE ─────────────────────────────────
      doc
        .fillColor(FOREST)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Donation Details', 50, currentY);
      currentY += 20;

      // Table header
      doc.save();
      doc.rect(50, currentY, 495, 22).fill('#e8f0ec');
      doc.restore();

      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor(FOREST)
        .text('PURPOSE / CAMPAIGN', 60, currentY + 6)
        .text('CURRENCY', 360, currentY + 6)
        .text('AMOUNT', 460, currentY + 6, { width: 75, align: 'right' });

      currentY += 28;

      // Table row
      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor(DARK)
        .text(donation.purpose || 'General Contribution', 60, currentY);

      doc.text(donation.currency || 'INR', 360, currentY);

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(`₹${donation.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 460, currentY, {
          width: 75,
          align: 'right',
        });

      currentY += 22;
      hr(doc, currentY, BORDER, 0.5);
      currentY += 12;

      // Total row
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(FOREST)
        .text('Total Received:', 340, currentY);

      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(DARK)
        .text(
          `₹${donation.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          460,
          currentY - 1,
          { width: 75, align: 'right' }
        );

      currentY += 30;
      hr(doc, currentY);
      currentY += 18;

      // ─── TAX EXEMPTION NOTICE ─────────────────────────────────────
      // Green tinted box
      doc.save();
      doc.roundedRect(50, currentY, 495, 52, 4).fill('#f0f9f4');
      doc
        .rect(50, currentY, 4, 52)
        .fill(FOREST);
      doc.restore();

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(FOREST)
        .text('TAX EXEMPTION NOTICE', 64, currentY + 8);

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(MUTED)
        .text(
          'All contributions made to Namokriti International Foundation are eligible for tax deduction under Section 80G of the Income Tax Act, 1961 (or applicable international treaties). Please retain this receipt for your tax filing records. This is a computer-generated receipt and does not require a physical signature.',
          64,
          currentY + 22,
          { width: 470, lineGap: 2 }
        );

      currentY += 68;

      // ─── WATERMARK SEAL (logo as translucent seal in center) ──────
      if (logoExists) {
        doc.save();
        doc.opacity(0.06);
        doc.image(LOGO_PATH, 175, 280, { width: 250, height: 250 });
        doc.restore();
      }

      // ─── SIGNATURE BLOCK ──────────────────────────────────────────
      currentY += 20;

      // Thank you message
      doc
        .font('Helvetica-Oblique')
        .fontSize(10)
        .fillColor(DARK)
        .text('Thank you for your generous support!', 50, currentY, {
          align: 'center',
          width: 495,
        });

      currentY += 35;

      // Signature section with seal
      if (logoExists) {
        doc.image(LOGO_PATH, 400, currentY, { width: 45, height: 45 });
      }

      // Signature line
      hr(doc, currentY + 50, MUTED, 0.6);

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(DARK)
        .text('Authorized Signatory', 380, currentY + 56, { width: 120, align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor(LIGHT_MUTED)
        .text('Namokriti International Foundation', 380, currentY + 68, {
          width: 120,
          align: 'center',
        });

      // ─── FOOTER ───────────────────────────────────────────────────
      const footerY = 760;
      hr(doc, footerY, BORDER, 0.5);

      doc
        .font('Helvetica')
        .fontSize(6.5)
        .fillColor(LIGHT_MUTED)
        .text(
          `Namokriti International Foundation  •  Receipt ${receiptId}  •  Generated on ${new Date().toLocaleDateString('en-IN')}`,
          50,
          footerY + 8,
          { align: 'center', width: 495 }
        );

      doc
        .text(
          'This is a system-generated document. For queries, contact contact@namokriti.org',
          50,
          footerY + 20,
          { align: 'center', width: 495 }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
