import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../config";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! How can I help you with admissions today?", isBot: true }]);
  const [input, setInput] = useState("");
  //for bot response loading state
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, isBot: false };
    setMessages([...messages, userMsg]);
    setInput("");
    setIsLoading(true); // Start loading when user sends a message
 
    try {
    const res = await axios.post(`${API_BASE_URL}/chat`, { message: input });
    setMessages(prev => [...prev, { text: res.data.response, isBot: true }]);
  } finally {
    setIsLoading(false); // Stop loading
  }
};

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-blue-600 p-4 text-white font-bold text-sm">AdmitPro AI Support</div>
                           {isLoading && <div className="p-2 bg-slate-100 rounded-lg text-xs w-fit italic">AI is thinking...</div>}
          <div className="flex-grow p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg text-sm ${m.isBot ? 'bg-slate-100 mr-8' : 'bg-blue-600 text-white ml-8'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input 
              className="flex-grow text-xs border p-2 rounded-lg outline-none" 
              placeholder="Ask about quotas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="text-blue-600 font-bold text-xs">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;