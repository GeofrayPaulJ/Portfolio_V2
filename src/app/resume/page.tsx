"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 flex justify-between items-center print:hidden"
        >
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:bg-muted">
              <ArrowLeft size={16} />
              Back to Portfolio
            </Button>
          </Link>
          <Button 
            className="bg-sky-500 hover:bg-sky-600 text-white gap-2 border-none"
            onClick={() => window.print()}
          >
            <Download size={16} />
            Download PDF
          </Button>
        </motion.div>

        <style jsx global>{`
          @media print {
            @page {
              margin: 20mm;
            }
            body {
              background: white !important;
              color: black !important;
            }
            .bg-background {
              background: white !important;
            }
            .text-muted-foreground {
              color: #4b5563 !important;
            }
            .text-sky-500 {
              color: #0ea5e9 !important;
            }
            .border-border {
              border-color: #e5e7eb !important;
            }
            .bg-muted {
              background: #f3f4f6 !important;
              print-color-adjust: exact;
            }
          }
        `}</style>

        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Geofray Paul J</h1>
          <p className="text-xl md:text-2xl text-sky-500 font-medium mb-8">AI Engineer | Medical Imaging & MLOps</p>
        </motion.header>

        {/* Profile Summary */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-sm uppercase tracking-[0.2em] text-sky-500 font-bold mb-6">Profile</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            AI Engineer based at the Sudha Gopalakrishnan Brain Centre (IIT Madras), specialising in production-grade deep learning systems for medical imaging. Focused on building reliable, end-to-end infrastructure, from segmentation architectures and GPU-optimised training loops to scalable clinical inference backends. Experienced in translating raw wet-lab data into clinical-grade models. Available for targeted technical consulting in Terabyte-scale computational pathology and radiology workflows.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-16">
            {/* Experience */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-sky-500 font-bold mb-8">Professional Experience</h2>
              
              <div className="space-y-12">
                <div className="relative pl-8 border-l border-border">
                  <div className="absolute w-3 h-3 bg-sky-500 rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Junior AI Engineer</h3>
                    <span className="text-sm font-mono text-muted-foreground">2024 to Present</span>
                  </div>
                  <p className="text-sky-500 font-medium mb-6 text-sm uppercase tracking-wider">Sudha Gopalakrishnan Brain Centre, IIT Madras</p>
                  
                  <div className="space-y-8">
                    {/* Subsection 1 */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-400 mb-4 tracking-widest border-b border-border/50 pb-2">Pipeline Architecture & Computational Pathology</h4>
                      <ul className="space-y-4 text-muted-foreground list-disc pl-4">
                        <li><strong>CD34 Segmentation:</strong> Built an nnU-Net V2 semantic segmentation pipeline to automate microvascular density quantification in CD34-stained whole slide images at gigapixel scale.</li>
                        <li><strong>Artefact Elimination:</strong> Implemented WSI tiling with 50% stride and overlap averaging to eliminate prediction edge artefacts across multi-gigabyte tissue scans.</li>
                        <li><strong>IHC Inference Engine:</strong> Developed a multi-marker IHC backend quantifying CD68, CD34, Astrocytes, and Beta-Amyloid across diverse tissue samples, integrating spatial annotations for high-fidelity masking.</li>
                        <li><strong>MRI Standardisation:</strong> Built a hardware-agnostic MRI preprocessing pipeline using MONAI, ANTs, and SimpleITK to standardise raw SAG T1 MPRAGE and ASL sequences with isotropic resampling (0.5mm³).</li>
                      </ul>
                    </div>

                    {/* Subsection 2 */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-400 mb-4 tracking-widest border-b border-border/50 pb-2">MLOps, Infrastructure & Data Provenance</h4>
                      <ul className="space-y-4 text-muted-foreground list-disc pl-4">
                        <li><strong>Cluster Optimisation:</strong> Managed training loops using NVIDIA Nsight Systems, AMP, and DDP to reduce memory bottlenecks across a DGX A100 cluster (640GB aggregate VRAM).</li>
                        <li><strong>Asynchronous Processing:</strong> Deployed scalable analysis platforms utilising Django, Celery, and Redis for high-throughput inference.</li>
                        <li><strong>Relational Architecture:</strong> Architected the central data model for a neurological specimen tracking system, mapping the physical lifecycle from wet-lab sectioning and staining to QR-coded digital storage.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Education */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-8 border-t border-border/50"
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-sky-500 font-bold mb-6">Education</h2>
              <div>
                <h3 className="text-xl font-bold">B.Tech. Computer Science and Engineering</h3>
                <p className="text-sky-500 font-medium">AI Specialisation | Karunya Institute of Technology and Sciences</p>
                <p className="text-sm text-muted-foreground mt-1">2020 to 2024</p>
              </div>
            </motion.section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-16">
            {/* Core Competencies */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-sky-500 font-bold mb-8">Core Competencies</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold uppercase text-zinc-500 mb-3 tracking-widest">Medical Imaging & Pathology</h3>
                  <div className="flex flex-wrap gap-2">
                    {["nnU-Net V2", "U-Mamba", "WSI Analysis", "IHC Quantification", "DICOM/NIfTI", "MONAI", "ANTs", "SAM", "MedSAM", "UNI", "CONCH", "Foundation Models"].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-muted text-xs rounded border border-border">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase text-zinc-500 mb-3 tracking-widest">High-Performance Infrastructure</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Docker", "Linux", "CUDA", "DGX A100", "Nsight Systems", "AMP", "DDP"].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-muted text-xs rounded border border-border">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase text-zinc-500 mb-3 tracking-widest">Backend & Data Architecture</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Django REST", "Celery", "Redis", "Async Processing", "Relational Modeling", "BPMN"].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-muted text-xs rounded border border-border">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Languages */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-sky-500 font-bold mb-8">Languages</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-sm">English</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Native / Professional</p>
                </div>
                <div>
                  <p className="font-bold text-sm">Spanish</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">A2 Level</p>
                </div>
                <div>
                  <p className="font-bold text-sm">Tamil</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Native</p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}
