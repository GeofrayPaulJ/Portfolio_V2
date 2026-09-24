"use client";

import { motion, useInView, MotionConfig } from "framer-motion";
import { useRef } from "react";
import { skills } from "@/lib/skills";

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <MotionConfig reducedMotion="user">
      <section id="skills" className="relative py-32">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Skills
            </h2>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8"
          >
            {skills.map((skill) => (
              <div key={skill.label} className="border-l border-border pl-5">
                <dt className="font-mono text-xs uppercase tracking-widest text-sky-500 font-semibold mb-2">
                  {skill.label}
                </dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">
                  {skill.text}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>
    </MotionConfig>
  );
}
