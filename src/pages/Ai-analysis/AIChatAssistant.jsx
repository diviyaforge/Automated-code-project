// ─── AI CHAT ASSISTANT ────────────────────────────────────────────────────────
// Self-contained chat page. Manages its own message state and API calls.
// Does NOT share code or analysis results with Dashboard state.

import { useState, useRef, useEffect } from "react";
import { s } from "../shared";

const SUGGESTIONS = [
  "What does this error mean: TypeError: Cannot read property of undefined?",
  "Explain the difference between async/await and Promises",
  "How do I reverse a string in Python?",
  "What is Big O notation?",
];

export default function AIChatAssistant() {
  const [messages, setMessages]       = useState([{ role: "assistant", content: "👋 Hello! I'm your AI code assistant. Ask me anything — explain code, find bugs, suggest improvements, or any coding question.", id: 0 }]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg    = { role: "user", content: text, id: Date.now() };
    const newHistory = [...chatHistory, { role: "user", content: text }];
    setMessages(p => [...p, userMsg]);
    setChatHistory(newHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1200,
          system: "You are a helpful AI coding assistant. Answer questions about code clearly and concisely. Format code examples with triple backticks. Be precise and conversational.",
          messages: newHistory,
        }),
      });
      const data  = await res.json();
      const reply = data.content?.map(b => b.text || "").join("\n") || "No response.";
      const aiMsg = { role: "assistant", content: reply, id: Date.now() + 1 };
      setMessages(p => [...p, aiMsg]);
      setChatHistory(p => [...p, { role: "assistant", content: reply }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "⚠️ Something went wrong. Please try again.", id: Date.now() + 1 }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "👋 Hello! I'm your AI code assistant. Ask me anything — explain code, find bugs, suggest improvements, or any coding question.", id: Date.now() }]);
    setChatHistory([]);
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>💬</div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "16px", color: "#f1f5f9" }}>AI Chat Assistant</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#4ECDC4" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ECDC4", display: "inline-block" }}/>Online • powered by Claude
            </div>
          </div>
        </div>
        <button style={{ ...s.loadBtn, color: "#f87171", borderColor: "rgba(239,68,68,.3)", background: "rgba(239,68,68,.08)" }} onClick={clearChat}>🗑 Clear</button>
      </div>

      {/* Message list */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px", paddingRight: "4px", paddingBottom: "8px" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", animation: "chatPop .2s ease" }}>
            <div style={{ fontSize: "11px", color: "#4b5563", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".04em", paddingLeft: msg.role === "user" ? 0 : "2px", paddingRight: msg.role === "user" ? "2px" : 0 }}>
              {msg.role === "user" ? "You" : "🤖 AI Assistant"}
            </div>
            <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#111827", border: msg.role === "user" ? "none" : "1px solid #1e2535", color: "#e2e8f0", fontSize: "14px", lineHeight: "1.75", fontFamily: "'Syne',sans-serif", boxShadow: msg.role === "user" ? "0 4px 16px rgba(124,58,237,.3)" : "none", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", animation: "chatPop .2s ease" }}>
            <div style={{ fontSize: "11px", color: "#4b5563", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".04em", paddingLeft: "2px" }}>🤖 AI Assistant</div>
            <div style={{ padding: "14px 18px", background: "#111827", border: "1px solid #1e2535", borderRadius: "18px 18px 18px 4px", display: "flex", gap: "5px", alignItems: "center" }}>
              {[0,1,2].map(i => <span key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#7c3aed", display: "inline-block", animation: `bounce 1.2s ease ${i*.2}s infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggestion chips — shown only when no conversation yet */}
      {messages.length === 1 && !loading && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px", flexShrink: 0 }}>
          {SUGGESTIONS.map(sg => (
            <button key={sg} onClick={() => setInput(sg)} style={{ background: "rgba(124,58,237,.1)", border: "1px solid rgba(124,58,237,.3)", borderRadius: "20px", color: "#c4b5fd", fontSize: "12px", fontWeight: "600", padding: "6px 14px", cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>{sg}</button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ background: "#111827", border: "1px solid #1e2535", borderRadius: "16px", padding: "10px 14px", display: "flex", gap: "10px", alignItems: "flex-end", flexShrink: 0 }}>
        <textarea
          ref={inputRef} rows={2} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask anything about your code… (Enter to send, Shift+Enter for new line)"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: "14px", fontFamily: "'Syne',sans-serif", lineHeight: "1.6", resize: "none", minHeight: "44px" }}
        />
        <button onClick={send} disabled={loading || !input.trim()}
          style={{ width: "42px", height: "42px", borderRadius: "11px", flexShrink: 0, border: "none", background: loading || !input.trim() ? "#1e2535" : "linear-gradient(135deg,#7c3aed,#4f46e5)", cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", boxShadow: loading || !input.trim() ? "none" : "0 4px 14px rgba(124,58,237,.4)" }}>
          {loading ? <div style={s.spinner}/> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
        </button>
      </div>
    </div>
  );
}


