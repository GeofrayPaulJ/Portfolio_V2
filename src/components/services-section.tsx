"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HoverEffect } from "@/components/ui/aceternity/card-hover-effect";

const services = [
  {
    title: "Custom Segmentation Architectures",
    description:
      "Engineering bespoke, state-of-the-art segmentation pipelines tailored to proprietary medical datasets. Bridging the gap between raw gigapixel whole-slide images and clinical-grade diagnostic models by implementing robust validation and QC protocols for production environments. Foundation model adaptation: fine-tuning SAM, MedSAM, and pathology-specific encoders (UNI, CONCH) for targeted clinical segmentation tasks.",
    tags: ["nnU-Net", "U-Mamba", "PyTorch", "SAM", "MedSAM"],
  },
  {
    title: "Infrastructure & GPU Optimisation",
    description:
      "Containerising environments, profiling workloads, and orchestrating asynchronous data pipelines to extract maximum throughput from high-performance GPU clusters and enterprise compute architectures.",
    tags: ["Docker", "CUDA", "Celery", "Redis"],
  },
  {
    title: "Clinical Inference & Deployment",
    description:
      "Translating complex Python inference logic into secure, production-ready access points. Developing the robust APIs and integration layers required to deploy medical models safely into clinical dashboards while maintaining strict latency requirements for real-time inference.",
    tags: ["Django REST", "Project MONAI", "Next.js"],
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Services
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl">
            Elite, Terabyte-scale Medical Imaging and MLOps capabilities for enterprise HealthTech clients.
          </p>
        </motion.div>

        {/* Aceternity HoverEffect cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <HoverEffect items={services} layoutId="servicesHover" />
        </motion.div>
      </div>
    </section>
  );
}
