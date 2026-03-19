const licenseReminderTemplate = (name, product, daysLeft) => {
  return `
    <h2>License Expiry Reminder ⏰</h2>
    <p>Hello ${name},</p>
    <p>Your license for <b>${product}</b> will expire in <b>${daysLeft} days</b>.</p>
    <p>Please submit renewal request to avoid interruption.</p>
    <br/>
    <p>– StockMind Team</p>
  `;
};

module.exports = licenseReminderTemplate;