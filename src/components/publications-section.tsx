"use client";

import { motion, useInView, MotionConfig } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { publications } from "@/lib/publications";

const linkClass =
  "rounded-sm text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function PublicationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <MotionConfig reducedMotion="user">
      <section id="papers" className="relative py-32">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Papers and Reports
            </h2>
          </motion.div>

          <ol className="space-y-8 max-w-4xl">
            {publications.map((pub, index) => (
              <motion.li
                key={pub.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="border-l border-border pl-5"
              >
                <p className="text-sm text-muted-foreground">{pub.authors}</p>
                <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug mt-1">
                  {pub.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{pub.venue}</p>
                {pub.links.length > 0 && (
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                    {pub.links.map((link) =>
                      link.href.startsWith("/") ? (
                        <Link key={link.href} href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          {link.label}
                        </a>
                      )
                    )}
                  </div>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}
