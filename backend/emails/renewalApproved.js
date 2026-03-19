const renewalApprovedTemplate = (name, product) => {
  return `
    <h2>Renewal Approved ✅</h2>
    <p>Hello ${name},</p>
    <p>Your renewal for <b>${product}</b> has been approved.</p>
    <p>Thank you for staying with us!</p>
    <br/>
    <p>– StockMind Team</p>
  `;
};

module.exports = renewalApprovedTemplate;