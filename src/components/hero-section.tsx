"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const coreTags = [
  "MLOps",
  "Computational Pathology",
  "Computational Radiology",
  "Foundation Models",
  "DGX A100",
];

export default function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount guard for SSR hydration
    setMounted(true);
  }, []);

  const portraitSrc = theme === "light" ? "/geofray-light.png" : "/geofray-portrait.png";
  const containerBg = theme === "light" ? "bg-[#f8fafc]" : "bg-[#1A1B21]";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Sky Blue Spotlight with Pulse Animation */}
      <motion.div 
        className="absolute left-0 top-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-60"
        style={{ background: "rgba(14, 165, 233, 0.15)" }}
        animate={{ 
          opacity: [0.6, 1, 0.6],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-12 items-center">
          
          {/* Left Column (60% width) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
                AI Engineer <br />
                <span className="text-sky-500">Medical Imaging & MLOps.</span>
              </h1>
            </div>

            {/* Paragraph (Refined Copy) */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Medical image segmentation and classification, computational
              pathology and neuroimaging, and the infrastructure that trains
              and serves the models.
            </p>

            {/* Capability Tags (Single-line separator style) */}
            <div className="pt-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center whitespace-nowrap font-mono text-[14px] tracking-[0.5px] text-muted-foreground/60 dark:text-white/45">
                {coreTags.map((tag, index) => (
                  <span key={tag} className="flex items-center">
                    {tag}
                    {index < coreTags.length - 1 && (
                      <span className="mx-2 text-muted-foreground/30 dark:text-white/25 select-none">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Calls to Action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6">
              <Button
                size="lg"
                onClick={() => document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-sky-500 text-white hover:bg-sky-600 px-8 h-12 rounded-lg font-semibold transition-all duration-300 border-none w-full sm:w-auto"
              >
                View Challenges
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('ai-agent')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 h-12 rounded-lg font-semibold transition-all w-full sm:w-auto"
              >
                AI Assistant
              </Button>
            </div>
          </motion.div>

          {/* Right Column (40% width) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Flexible Image Container */}
            {mounted && (
              <>
                <div className={`relative w-full max-w-[580px] rounded-2xl overflow-hidden ${containerBg} border border-border shadow-2xl group pt-4`}>
                  <img 
                    src={portraitSrc}
                    alt="Geofray Paul J"
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60" />
                </div>
                
                {/* Dual Layer Glow Effect */}
                <div className="absolute -inset-4 bg-sky-500/10 blur-3xl -z-10 rounded-full opacity-50" />
                <div className="absolute -inset-24 bg-sky-500/5 blur-[120px] -z-20 rounded-full animate-pulse" />
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
        onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </motion.div>
    </section>
  );
}
