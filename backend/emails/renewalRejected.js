const renewalRejectedTemplate = (name, product) => {
  return `
    <h2>Renewal Rejected ❌</h2>
    <p>Hello ${name},</p>
    <p>Your renewal request for <b>${product}</b> was rejected.</p>
    <p>Please contact admin for more details.</p>
    <br/>
    <p>– StockMind Team</p>
  `;
};

module.exports = renewalRejectedTemplate;