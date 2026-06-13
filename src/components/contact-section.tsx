"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

const CAL_LINK =
  process.env.NEXT_PUBLIC_CAL_LINK || "https://cal.com/your-username/30min";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 border-t border-border overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Get in touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-lg">
            Two ways to reach me. Book a slot directly, or send a note and I&apos;ll
            reply personally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Track 1: Book a call */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col border border-border rounded-xl bg-card dark:bg-zinc-900 p-8 shadow-[0_0_50px_-12px_rgba(14,165,233,0.12)]"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-5">
              <Calendar className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Book a 30-minute call
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              For scoped consulting in computational pathology, radiology, or
              foundation-model adaptation. Pick a time that suits you, with no forms
              and no back-and-forth.
            </p>
            <Button
              nativeButton={false}
              render={
                <a href={CAL_LINK} target="_blank" rel="noopener noreferrer" />
              }
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold h-12 px-6 rounded-lg w-full text-sm gap-2"
            >
              <Calendar size={16} />
              Schedule a slot
              <ArrowUpRight size={16} className="opacity-70" />
            </Button>
          </motion.div>

          {/* Track 2: Send a message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-border rounded-xl bg-card dark:bg-zinc-900 p-8 shadow-[0_0_50px_-12px_rgba(14,165,233,0.12)]"
          >
            {status === "sent" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Message sent
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Thank you. I&apos;ll be in touch at the address you provided.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  Send a message
                </h3>

                {/* Honeypot: hidden from humans */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all dark:bg-zinc-950"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all dark:bg-zinc-950"
                />
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What would you like to discuss?"
                  rows={4}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all resize-none dark:bg-zinc-950"
                />

                {status === "error" && (
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle size={14} />
                    {errorMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold h-12 px-6 rounded-lg w-full text-sm gap-2"
                >
                  {status === "sending" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {status === "sending" ? "Sending..." : "Send message"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
