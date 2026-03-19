const { Resend } = require("resend");

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const sendEmail = async (to, subject, html) => {
  try {
    if (!resend) {
      console.log("Resend not configured, skipping email");
      return;
    }

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
