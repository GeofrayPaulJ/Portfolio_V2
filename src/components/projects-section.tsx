"use client";

import { motion, useInView, MotionConfig } from "framer-motion";
import { useRef } from "react";
import { personalProjects } from "@/lib/projects";

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <MotionConfig reducedMotion="user">
      <section id="projects" className="relative py-32 overflow-hidden">
        {/* Top Gradient Separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Personal projects
            </h2>
          </motion.div>

          <div className="space-y-6">
            {personalProjects.map((project, index) => (
              <motion.article
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="rounded-xl border border-border bg-slate-50 dark:bg-[#1a1b21] p-6 md:p-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-10"
              >
                <header>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{project.tagline}</p>
                  <span className="inline-block mt-3 rounded border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] text-sky-500">
                    {project.status}
                  </span>
                </header>

                <div className="space-y-3 text-sm leading-relaxed">
                  <p className="text-muted-foreground">{project.summary}</p>
                  {project.details?.map((detail) => (
                    <p key={detail.label} className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{detail.label}:</span>{" "}
                      {detail.text}
                    </p>
                  ))}
                  {project.built && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Built:</span> {project.built}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Next:</span> {project.next}
                  </p>
                  {project.links.length > 0 && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1">
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-sm font-medium text-sky-500 hover:text-sky-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
