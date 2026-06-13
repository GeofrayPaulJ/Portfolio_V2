"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const projects = [
  {
    overline: "COMPUTATIONAL PATHOLOGY",
    title: "CD34 Whole-Slide Segmentation Pipeline",
    description:
      "Engineered a high-fidelity segmentation loop utilising nnU-Net to automate microvascular density quantification across gigapixel-scale whole slide images. Orchestrated continuous training environments on persistent Linux containers, bypassing standard PyTorch bottlenecks to deliver clinical-grade accuracy.",
    tags: ["nnU-Net", "WSI Tiling", "Docker"],
  },
  {
    overline: "DATA PROVENANCE & ARCHITECTURE",
    title: "Neurological Asset Tracking System",
    description:
      "Architected the central relational data model bridging wet-lab pathology and digital infrastructure. Mapped the entire lifecycle of brain specimens, from physical sectioning and staining to QR-coded scanning and storage, translating complex laboratory edge cases into strict relational database schemas and BPMN workflows for the software engineering team.",
    tags: ["Relational Data Modeling", "BPMN/UML", "Systems Architecture"],
  },
  {
    overline: "COMPUTATIONAL RADIOLOGY",
    title: "MRI Pre-Processing & Standardisation",
    description:
      "Engineered a hardware-agnostic pipeline to standardise raw 3D MRI sequences (SAG T1 MPRAGE, ASL). Utilised advanced spatial coordinate realignment and medical imaging frameworks to bridge the gap between raw clinical scans and downstream deep learning inference.",
    tags: ["Project MONAI", "DICOM/NIfTI", "Spatial Resampling"],
  },
  {
    overline: "CLINICAL INFRASTRUCTURE",
    title: "IHC Automated Inference Engine",
    description:
      "Developed a scalable backend inference engine for the automated quantification of immunohistochemistry biomarkers. Designed to process diverse tissue datasets asynchronously, providing researchers with high-throughput diagnostic analytics without hardware bottlenecks.",
    tags: ["Inference API", "Biomarker Quantification", "Asynchronous Processing"],
  },
];

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      {/* Background Grid Pattern - Matching Hero */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Top Gradient Separator - Matching Expertise/Services */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Featured Projects
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl">
            A portfolio of production-grade systems delivered across medical imaging, data architecture, and clinical infrastructure.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="relative group block p-2 h-full w-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-sky-500/[0.12] dark:bg-sky-500/[0.08] block rounded-2xl"
                    layoutId="projectsHoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.15 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0.2 },
                    }}
                  />
                )}
              </AnimatePresence>

              <div
                className={cn(
                  "rounded-2xl h-full w-full overflow-hidden border border-border bg-slate-50/50 dark:bg-background/80 backdrop-blur-sm relative z-20 transition-all duration-300 group-hover:border-sky-500/30 p-6 md:p-8 flex flex-col justify-between"
                )}
              >
                <div>
                  <span className="block text-xs uppercase tracking-widest text-sky-500 font-mono font-semibold mb-4">
                    {project.overline}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="bg-sky-500/10 text-sky-400 border-sky-500/20 font-mono text-[10px] py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
