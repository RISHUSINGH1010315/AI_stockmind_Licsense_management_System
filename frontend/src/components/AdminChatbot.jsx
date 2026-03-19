import { useState } from "react";
import axios from "axios";

function AdminChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const token = localStorage.getItem("token");

  const askBot = async () => {
    if (!message) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const stats = res.data;
      const msg = message.toLowerCase();
      let reply = "Sorry, I didn't understand 🤔";

      if (msg.includes("users"))
        reply = `👥 Total users: ${stats.users}`;
      else if (msg.includes("products"))
        reply = `📦 Total products: ${stats.products}`;
      else if (msg.includes("licenses"))
        reply = `🔑 Total licenses: ${stats.licenses}`;
      else if (msg.includes("renewal"))
        reply = `🔄 Pending renewals: ${stats.pendingRenewals}`;
      else if (msg.includes("hello"))
        reply = "Hi Admin 👋 How can I help you today?";

      setChat((prev) => [...prev, { sender: "bot", text: reply }]);
      setMessage("");
    } catch {
      setChat((prev) => [...prev, { sender: "bot", text: "Server error 😢" }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 
                   text-white w-14 h-14 rounded-full shadow-2xl text-2xl transition"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 font-semibold">
            Admin AI Assistant
          </div>

          {/* Messages */}
          <div className="p-3 h-72 overflow-y-auto space-y-3 bg-gray-50">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  c.sender === "user"
                    ? "ml-auto bg-indigo-100 text-black"
                    : "bg-white border text-black"
                }`}
              >
                {c.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 p-3 outline-none text-black"
              onKeyDown={(e) => e.key === "Enter" && askBot()}
            />
            <button
              onClick={askBot}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default AdminChatbot;