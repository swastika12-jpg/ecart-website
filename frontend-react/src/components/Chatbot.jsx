import { useState, useEffect, useRef } from "react";

function Chatbot({ products, setPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi there! 👋 I am Swastuuu E-Cart's support assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      const responseText = getBotResponse(textToSend);
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (query) => {
    const q = query.toLowerCase();

    // Check shipping
    if (q.includes("shipping") || q.includes("delivery") || q.includes("track")) {
      return "We offer free shipping on all orders over ₹5,000! Standard orders take 3-5 business days to deliver. You can track your placed orders in the 'My Orders' tab.";
    }

    // Check refund/return
    if (q.includes("return") || q.includes("refund") || q.includes("replace")) {
      return "Our return policy allows you to return items within 7 days of delivery. The items must be in original packaging and unused. Refund is processed within 48 hours of return receipt.";
    }

    // Check payment
    if (q.includes("payment") || q.includes("pay") || q.includes("cod") || q.includes("card")) {
      return "We support secure card payments, Net Banking, UPI, and Cash on Delivery (COD) for eligible pin codes.";
    }

    // Check products in catalog dynamically
    const matchedProducts = products.filter(p => 
      q.includes(p.name.toLowerCase()) || 
      q.includes(p.category.toLowerCase()) ||
      (p.description && q.includes(p.description.toLowerCase()))
    );

    if (matchedProducts.length > 0) {
      const p = matchedProducts[0];
      return `Yes! We have "${p.name}" in our catalog under the "${p.category}" category. It costs ₹${p.price.toLocaleString("en-IN")} and we currently have ${p.stock} units in stock.`;
    }

    // Audio search
    if (q.includes("headphone") || q.includes("speaker") || q.includes("audio") || q.includes("sound")) {
      const audioProds = products.filter(p => p.category === "Audio");
      if (audioProds.length > 0) {
        return `We have great audio gear! Check out: ${audioProds.map(p => `"${p.name}" (₹${p.price.toLocaleString("en-IN")})`).join(", ")}.`;
      }
    }

    // Laptop/Electronics search
    if (q.includes("laptop") || q.includes("phone") || q.includes("computer") || q.includes("mobile") || q.includes("electronics")) {
      const elecProds = products.filter(p => p.category === "Electronics");
      if (elecProds.length > 0) {
        return `Under Electronics, we have: ${elecProds.slice(0, 3).map(p => `"${p.name}" (₹${p.price.toLocaleString("en-IN")})`).join(", ")} and more!`;
      }
    }

    // Peripherals/Keyboard search
    if (q.includes("keyboard") || q.includes("mouse") || q.includes("gaming") || q.includes("peripheral")) {
      const periProds = products.filter(p => p.category === "Peripherals");
      if (periProds.length > 0) {
        return `For gaming/work setups, check out our peripherals: ${periProds.slice(0, 3).map(p => `"${p.name}" (₹${p.price.toLocaleString("en-IN")})`).join(", ")}.`;
      }
    }

    // Admin dashboard / human support help
    if (q.includes("human") || q.includes("person") || q.includes("support") || q.includes("admin") || q.includes("contact")) {
      return "You can contact our merchant support team at support@swastuuuecart.com or call us at 1800-123-4567. We are available 24/7!";
    }

    // Default response
    return "I'm sorry, I didn't quite catch that. You can ask me about product stock, shipping rates, return policies, or contact details. Try asking: 'Do you have laptops?' or 'What is your shipping policy?'";
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Chat Icon Toggle */}
      <button 
        className={`chatbot-toggle ${isOpen ? "open" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Customer Support Chat"
        aria-label="Customer Support Chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window Box */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="bot-status-dot"></span>
              <div>
                <h4>Support Assistant</h4>
                <p>Online • Powered by AI</p>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="chatbot-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble ${m.sender}`}>
                <div className="bubble-text">{m.text}</div>
                <div className="bubble-time">{m.time}</div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chat-bubble bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies suggestion buttons */}
          <div className="chatbot-suggestions">
            <button onClick={() => handleSend("Do you have laptops?")}>💻 Laptops</button>
            <button onClick={() => handleSend("What is your shipping policy?")}>📦 Shipping Info</button>
            <button onClick={() => handleSend("How can I return an item?")}>🔄 Returns</button>
            <button onClick={() => handleSend("Talk to support person")}>📞 Live Help</button>
          </div>

          {/* Footer Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }} 
            className="chatbot-footer"
          >
            <input
              type="text"
              placeholder="Ask support..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
