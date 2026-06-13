"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HoverEffect } from "@/components/ui/aceternity/card-hover-effect";

const expertise = [
  {
    title: "Advanced Segmentation Architectures",
    description:
      "Engineering bleeding-edge segmentation pipelines for gigapixel-scale whole slide images and 3D volumes, leveraging hybrid state-space models and established frameworks to bridge research and clinical deployment.",
    tags: ["nnU-Net", "U-Mamba", "WSI"],
  },
  {
    title: "Computational Pathology & Radiology",
    description:
      "Designing Terabyte-scale workflows that process, de-identify, and analyse dense medical imaging formats. Ensuring strict data provenance and compliance from wet-lab acquisition to digital storage.",
    tags: ["Pathology", "Radiology", "Project MONAI"],
  },
  {
    title: "Foundation Model Adaptation",
    description:
      "Fine-tuning and adapting medical imaging foundation models (SAM, MedSAM, UNI, and CONCH) for specialised histopathology and radiology tasks. Bridging generalised vision encoders to domain-specific clinical workflows.",
    tags: ["SAM", "MedSAM", "UNI", "CONCH"],
  },
  {
    title: "High-Throughput Data Orchestration",
    description:
      "Constructing asynchronous, non-blocking data pipelines to feed heavy computational models without bottlenecking the hardware. Managing distributed worker nodes for maximum cluster efficiency.",
    tags: ["Celery", "Redis", "Async"],
  },
  {
    title: "Hardware-Level GPU Optimisation",
    description:
      "Extracting maximum inference and training throughput from NVIDIA architecture. Profiling bottlenecks and implementing mixed-precision workflows across high-performance compute clusters.",
    tags: ["CUDA", "Nsight Systems", "Distributed Compute"],
  },
  {
    title: "MLOps & Containerised Infrastructure",
    description:
      "Architecting persistent, GPU-accelerated Linux environments. Rebuilding lean and containerised deployments for operational stability.",
    tags: ["Docker", "WSL2", "Linux"],
  },
  {
    title: "Clinical Interfaces & Inference APIs",
    description:
      "Developing secure, scalable access points for medical models. Connecting complex Python inference logic to clinical dashboards through robust, production-ready Django architectures.",
    tags: ["Next.js", "Django REST", "Python"],
  },
];

export default function ExpertiseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="expertise" className="relative py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Core Expertise
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl">
            Dedicated to bridging the gap between research models and production-ready systems for Terabyte-scale pathology workflows.
          </p>
        </motion.div>

        {/* Aceternity HoverEffect cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <HoverEffect items={expertise} layoutId="expertiseHover" />
        </motion.div>
      </div>
    </section>
  );
}
