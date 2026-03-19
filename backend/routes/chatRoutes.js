const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

/////////////////////////////////////////////////////
// 🔐 Ensure API KEY exists
/////////////////////////////////////////////////////
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing in .env file");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/////////////////////////////////////////////////////
// 🤖 CHATBOT ROUTE
/////////////////////////////////////////////////////
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a cute, friendly assistant for StockMind AI. Help employees with licenses, renewals and payments in simple short answers.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.error("❌ OpenAI Error:", err.message);

    res.status(500).json({
      reply: "Sorry 😢 AI is currently unavailable. Please try again later."
    });
  }
});

module.exports = router;