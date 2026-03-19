const licenseAssignedTemplate = (name, product) => {
  return `
    <h2>License Assigned 🎉</h2>
    <p>Hello ${name},</p>
    <p>You have been assigned a license for:</p>
    <h3>${product}</h3>
    <p>You can now start using the product.</p>
    <br/>
    <p>– StockMind Team</p>
  `;
};

module.exports = licenseAssignedTemplate;