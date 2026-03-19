const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: "StockMind <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("Email sent:", data);
  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = sendEmail;