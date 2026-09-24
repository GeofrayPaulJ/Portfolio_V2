"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Send, Loader2 } from "lucide-react";
import { extractChips } from "@/lib/chips";

interface Message {
  role: "user" | "alfred";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "alfred",
  content:
    "Hello. I'm Alfred, Geofray's technical assistant. I can take you through his engineering work, his MICCAI 2026 challenge entries, his technical notes and what he is building now. What would you like to know?",
};

const DEFAULT_SUGGESTIONS = [
  "What did the AIMS-TBI paper find?",
  "What is he building now?",
];

export default function AiAgentSection() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoScrollRef = useRef(true);

  const scrollToBottom = () => {
    if (terminalRef.current && autoScrollRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const handleTerminalScroll = () => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      autoScrollRef.current = scrollHeight - scrollTop <= clientHeight + 50;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isTyping]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isTyping || streamingText) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setShowSuggestions(false);
    autoScrollRef.current = true;
    inputRef.current?.focus();
    setIsTyping(true);

    try {
      const res = await fetch("/api/alfred-cs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send the full conversation so follow-ups like "another one"
          // resolve against prior turns. INITIAL_MESSAGE is dropped, since it's
          // a static client-side greeting, not part of the real exchange.
          messages: [...messages.slice(1), userMsg],
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      if (!res.body) throw new Error("No response body");

      setIsTyping(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setStreamingText(fullText);
              }
            } catch {
              // Partial JSON chunk, skip
            }
          }
        }
      }

      // Extract chips from the end of Alfred's response
      const { clean, chips } = extractChips(fullText);

      setMessages((prev) => [
        ...prev,
        { role: "alfred", content: clean },
      ]);
      setStreamingText("");
      setSuggestions(chips.length ? chips : DEFAULT_SUGGESTIONS);
      setShowSuggestions(true);

    } catch (err) {
      console.error("Alfred error:", err);
      setIsTyping(false);
      setStreamingText("");
      setMessages((prev) => [
        ...prev,
        {
          role: "alfred",
          content:
            "I appear to be experiencing a momentary lapse. Do try again. Mr. Paul would insist on it.",
        },
      ]);
      setShowSuggestions(true);
    }
  };

  return (
    <section
      id="ai-agent"
      className="relative py-24 pb-40 border-t border-border overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Spotlight */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-60"
        style={{ background: "rgba(14, 165, 233, 0.15)" }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Meet Alfred
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-lg">
            An assistant that reads a curated knowledge base of my work in full
            on every question and answers with Gemini. Ask it anything.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto border border-border rounded-xl bg-card shadow-[0_0_50px_-12px_rgba(14,165,233,0.15)] dark:bg-zinc-900 overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="bg-muted/50 px-3 md:px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-muted-foreground/30" />
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-muted-foreground/30" />
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Alfred // Gemini, full context
              </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">
                Status: Live
              </span>
            </div>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            onScroll={handleTerminalScroll}
            className="p-5 md:p-8 lg:p-10 h-[400px] md:h-[500px] overflow-y-auto font-mono text-xs md:text-sm leading-relaxed scroll-smooth scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          >
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 md:gap-4 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {msg.role === "alfred" && (
                    <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                      <span className="text-sky-400 text-[10px] md:text-[11px] font-bold">
                        AL
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] space-y-2 ${
                      msg.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 md:p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-sky-500/10 border border-sky-500/20 text-foreground rounded-tr-none"
                          : "bg-muted/40 border border-border text-foreground rounded-tl-none dark:bg-zinc-800/40"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming Message */}
              {streamingText && (
                <div className="flex gap-3 md:gap-4 flex-row">
                  <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                    <span className="text-sky-400 text-[10px] md:text-[11px] font-bold">
                      AL
                    </span>
                  </div>
                  <div className="max-w-[85%] text-left">
                    <div className="inline-block p-3 md:p-4 rounded-2xl bg-muted/40 border border-border text-foreground rounded-tl-none dark:bg-zinc-800/40">
                      {streamingText}
                      <span className="inline-block w-1 h-4 bg-sky-500 ml-1 animate-pulse align-middle" />
                    </div>
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 md:gap-4 flex-row">
                  <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                    <span className="text-sky-400 text-[10px] md:text-[11px] font-bold">
                      AL
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/40 border border-border px-4 py-3 rounded-2xl rounded-tl-none dark:bg-zinc-800/40">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-sky-500/50"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Suggestion Chips */}
              {showSuggestions && !isTyping && !streamingText && (
                <div className="flex flex-wrap gap-2 pt-2 justify-start ml-9 md:ml-12">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="text-[10px] md:text-xs px-4 py-2 rounded-full border border-border bg-background hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400 text-muted-foreground transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-800"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-5 bg-muted/30 border-t border-border shrink-0 dark:bg-zinc-950/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-sky-500 transition-colors">
                  <Search size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Alfred anything..."
                  className="w-full h-11 md:h-12 bg-background border border-border rounded-lg pl-11 md:pl-12 pr-4 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all dark:bg-zinc-950"
                  disabled={isTyping || !!streamingText}
                />
              </div>
              <Button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold h-11 md:h-12 px-6 md:px-8 rounded-lg transition-all border-none text-sm gap-2"
                disabled={!inputValue.trim() || isTyping || !!streamingText}
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Ask Alfred
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}