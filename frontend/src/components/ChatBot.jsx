import { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState([
    { from: "bot", text: "Hi 👋 I'm StockMind Assistant. How can I help you today?" }
  ]);

  // 🤖 SEND MESSAGE TO AI
  const sendMessage = async () => {
    if (!msg.trim()) return;

    const userMessage = msg;
    setMsg("");

    setChat((prev) => [...prev, { from: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch {
      setChat((prev) => [...prev, { from: "bot", text: "AI server error 😢" }]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl animate-bounce"
          >
            <FaRobot size={22} />
          </button>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50">

          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <span className="font-semibold tracking-wide">
              StockMind Assistant ✨
            </span>
            <FaTimes
              className="cursor-pointer hover:scale-110 transition"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-100 text-black">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow ${
                  c.from === "bot"
                    ? "bg-white text-black"
                    : "bg-indigo-600 text-white ml-auto"
                }`}
              >
                {c.text}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="bg-white text-gray-500 italic px-3 py-2 rounded-xl shadow w-fit animate-pulse">
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex border-t bg-white">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me about licenses, renewals, payments..."
              className="flex-1 p-3 outline-none text-black"
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 transition"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;