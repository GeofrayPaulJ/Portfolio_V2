"use client";

import { motion, useInView, MotionConfig } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { challenges } from "@/lib/challenges-meta";

export default function ChallengesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <MotionConfig reducedMotion="user">
      <section id="challenges" className="relative py-32 overflow-hidden">
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
              MICCAI 2026 Challenges
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
              Four entries to MICCAI 2026 challenges. Each write-up gives the
              result with its status, the main finding, and what limited it.
            </p>
          </motion.div>

          {/* Challenge Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <motion.article
                key={challenge.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="group relative rounded-xl border border-border bg-slate-50 dark:bg-[#1a1b21] p-6 md:p-7 flex flex-col justify-between transition-all duration-300 motion-reduce:transition-none hover:border-sky-500/40"
              >
                <div>
                  {/* Top Row: Context + Read Time */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="font-mono text-[11px] text-muted-foreground/60 leading-relaxed break-words">
                      {challenge.context}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/60 shrink-0">
                      {challenge.readTime}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-[15px] md:text-base font-semibold text-foreground leading-snug mb-3 tracking-tight">
                    {challenge.name}
                  </h3>

                  {/* Result with status */}
                  <p className="font-mono text-sm font-semibold text-sky-500 leading-snug mb-4 break-words">
                    {challenge.result}
                  </p>

                  {/* Finding */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {challenge.finding}
                  </p>
                </div>

                {/* Read Write-up Link */}
                <Link
                  href={`/challenges/${challenge.slug}`}
                  aria-label={`Read the ${challenge.name} write-up`}
                  className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors duration-200 group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Read Write-up
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
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
    </MotionConfig>
  );
}
