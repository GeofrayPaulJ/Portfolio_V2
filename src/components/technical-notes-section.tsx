"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { notes as technicalNotes } from "@/lib/notes-meta";

export default function TechnicalNotesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="documentation"
      className="relative py-32 overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Top Gradient Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Technical Notes
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
            Engineering decisions, architectural trade-offs, and field
            observations from active production pipelines.
          </p>
        </motion.div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {technicalNotes.map((note, index) => (
            <motion.article
              key={note.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="group relative rounded-xl border border-border bg-slate-50 dark:bg-[#1a1b21] p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:border-sky-500/40"
            >
              {/* Top Row: Number + Read Time */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-sky-500 tracking-tight leading-none">
                    {note.number}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {note.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[15px] md:text-base font-semibold text-foreground leading-snug mb-3 tracking-tight">
                  {note.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] text-muted-foreground/50 dark:text-white/35"
                    >
                      {tag}
                      {tag !== note.tags[note.tags.length - 1] && (
                        <span className="ml-2 text-muted-foreground/25 dark:text-white/20 select-none">
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {note.description}
                </p>
              </div>

              {/* Read Note Link */}
              <Link
                href={`/notes/${note.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors duration-200 group/link"
              >
                Read Note
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
