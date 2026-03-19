const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (paymentData) => {
  const doc = new PDFDocument();

  const filePath = path.join(
    __dirname,
    `../invoices/invoice_${paymentData.paymentId}.pdf`
  );

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(22).text("StockMind Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice ID: ${paymentData.paymentId}`);
  doc.text(`Employer ID: ${paymentData.employerId}`);
  doc.text(`License ID: ${paymentData.licenseId}`);
  doc.text(`Amount Paid: ₹${paymentData.amount}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.end();

  return filePath;
};

module.exports = generateInvoice;