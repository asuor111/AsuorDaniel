"use client";

import { useState } from "react";

export function SimpleChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: userMessage }] }),
      });

      const data = await response.json();

      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              What can I help with?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask a question, write code, or explore ideas.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-2xl px-4 py-2.5">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border/30 bg-card/50 p-4 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-2.5 bg-background/50 border border-border/30 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
          Powered by Orphentis AI · Groq Llama 3.3
        </p>
      </div>
    </div>
  );
}