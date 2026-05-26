import PDFDocument from 'pdfkit';

/**
 * Generates a donation receipt PDF buffer.
 * @param {Object} donation Donation document from MongoDB
 * @returns {Promise<Buffer>} Resolves with PDF file buffer
 */
export const generateDonationReceiptPDF = (donation) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Branding Header
      doc.fillColor('#0d9488').fontSize(22).text('Namokriti International Foundation', { align: 'center' });
      doc.fillColor('#475569').fontSize(10).text('Empowering Communities, Transforming Lives', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(9).text('Regd. Office: 12, Peace Plaza, New Delhi, India | Contact: contact@namokriti.org', { align: 'center' });
      
      // Divider
      doc.moveDown(1);
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1.5);

      // Receipt Title
      doc.fillColor('#0f172a').fontSize(16).text('DONATION RECEIPT', { align: 'center', underline: true });
      doc.moveDown(1.5);

      // Metadata Table
      const leftColX = 50;
      const rightColX = 320;
      const startY = doc.y;

      doc.fontSize(10).fillColor('#64748b').text('Receipt Number:', leftColX);
      doc.fillColor('#0f172a').text(`REC-${donation._id.toString().substring(18).toUpperCase()}`, leftColX + 90, startY);

      doc.fillColor('#64748b').text('Date:', rightColX);
      doc.fillColor('#0f172a').text(new Date(donation.createdAt).toLocaleDateString(), rightColX + 60, startY);

      doc.moveDown(0.8);
      const nextY = doc.y;

      doc.fillColor('#64748b').text('Donor Name:', leftColX);
      doc.fillColor('#0f172a').text(donation.name, leftColX + 90, nextY);

      doc.fillColor('#64748b').text('Payment Mode:', rightColX);
      doc.fillColor('#0f172a').text(donation.paymentGateway.toUpperCase(), rightColX + 80, nextY);

      doc.moveDown(0.8);
      const thirdY = doc.y;

      doc.fillColor('#64748b').text('Donor Email:', leftColX);
      doc.fillColor('#0f172a').text(donation.email, leftColX + 90, thirdY);

      doc.fillColor('#64748b').text('Transaction ID:', rightColX);
      doc.fillColor('#0f172a').text(donation.paymentId || 'Pending/N/A', rightColX + 80, thirdY);

      doc.moveDown(1.5);
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1.5);

      // Donation Breakdown Table
      doc.fontSize(11).fillColor('#0d9488').text('Donation Details', { underline: true });
      doc.moveDown(0.8);

      const tableTop = doc.y;
      doc.fontSize(10).fillColor('#475569');
      doc.text('Purpose / Campaign', leftColX);
      doc.text('Amount', rightColX + 150, tableTop, { width: 80, align: 'right' });

      doc.moveDown(0.5);
      doc.strokeColor('#f1f5f9').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);

      const itemY = doc.y;
      doc.fillColor('#0f172a');
      doc.text(donation.purpose, leftColX);
      doc.text(`${donation.currency || 'INR'} ${donation.amount.toFixed(2)}`, rightColX + 150, itemY, { width: 80, align: 'right' });

      doc.moveDown(1.5);
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1.5);

      // Total Section
      const totalY = doc.y;
      doc.fontSize(12).fillColor('#0d9488').text('Total Received:', rightColX + 40, totalY);
      doc.fillColor('#0f172a').text(`${donation.currency || 'INR'} ${donation.amount.toFixed(2)}`, rightColX + 150, totalY, { width: 80, align: 'right' });

      doc.moveDown(2);

      // Tax Exemption Disclaimer
      doc.fillColor('#475569').fontSize(9).text('Tax Exemption: All contributions made to Namokriti International Foundation are tax-exempt under Section 80G of the Income Tax Act (or matching international treaties). Please keep this receipt for tax reporting purposes.', { align: 'justify', lineGap: 3 });

      doc.moveDown(2);

      // Signature / Thank you
      doc.fontSize(10).fillColor('#0f172a').text('Thank you for your generous support!', { align: 'center', oblique: true });
      
      doc.moveDown(1.5);
      const sigY = doc.y;
      doc.text('Authorized Signatory', rightColX + 100, sigY, { align: 'center' });
      doc.fontSize(8).fillColor('#64748b').text('Namokriti International Foundation', rightColX + 100, sigY + 12, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
