"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { challenges } from "@/lib/challenges-meta";
import { publications } from "@/lib/publications";
import { skills } from "@/lib/skills";

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
          <div className="flex flex-wrap justify-end gap-2">
            <a
              href="/Geofray_Paul_J_CV.pdf"
              className="inline-flex items-center gap-2 rounded-md bg-sky-500 hover:bg-sky-600 px-4 py-2 text-sm font-medium text-white"
            >
              <Download size={16} />
              Industry résumé (PDF)
            </a>
            <a
              href="/Geofray_Paul_J_CV_Academic.pdf"
              className="inline-flex items-center gap-2 rounded-md border border-sky-500 px-4 py-2 text-sm font-medium text-sky-500 hover:bg-sky-500/10"
            >
              <Download size={16} />
              Academic CV (PDF)
            </a>
          </div>
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
          <p className="text-xl md:text-2xl text-sky-500 font-medium mb-4">AI Engineer | Medical Imaging & MLOps</p>
          <p className="text-sm text-muted-foreground leading-relaxed break-words">
            <a href="mailto:geofraypaul1223@gmail.com" className="hover:text-sky-500 underline-offset-2 hover:underline">geofraypaul1223@gmail.com</a>
            {" · "}Chennai, India · open to relocation{" · "}
            <a href="https://www.linkedin.com/in/geofraypaulj1212" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 underline-offset-2 hover:underline">https://www.linkedin.com/in/geofraypaulj1212</a>
            {" · "}
            <a href="https://github.com/GeofrayPaulJ" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 underline-offset-2 hover:underline">https://github.com/GeofrayPaulJ</a>
            {" · "}
            <a href="https://geofraypaul.vercel.app" className="hover:text-sky-500 underline-offset-2 hover:underline">https://geofraypaul.vercel.app</a>
          </p>
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
            AI engineer in medical imaging: segmentation and classification models, computational pathology, computational radiology and neuroimaging pipelines, and the infrastructure that trains and serves them. Entered four MICCAI 2026 challenges as an independent researcher.
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
                    <span className="text-sm font-mono text-muted-foreground">November 2025 – present</span>
                  </div>
                  <p className="text-sky-500 font-medium mb-6 text-sm uppercase tracking-wider">Sudha Gopalakrishnan Brain Centre, IIT Madras</p>
                  
                  <div className="space-y-8">
                    {/* Subsection 1 */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-400 mb-4 tracking-widest border-b border-border/50 pb-2">Model Evaluation, Benchmarking & Failure Diagnosis</h4>
                      <ul className="space-y-4 text-muted-foreground list-disc pl-4">
                        <li><strong>HookNet Grey/White Matter Segmentation:</strong> Multiple sclerosis whole-slide images (H&E), multi-slide pooled training. Diagnosed a stagnant boundary metric to a coarse ground-truth polygon rather than a model or metric defect, confirmed via a per-class tau-sweep control test — redirected the team toward re-annotation instead of further training spend.</li>
                      </ul>
                    </div>

                    {/* Subsection 2 */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-400 mb-4 tracking-widest border-b border-border/50 pb-2">Computational Pathology & Radiology Pipelines</h4>
                      <ul className="space-y-4 text-muted-foreground list-disc pl-4">
                        <li><strong>CD34 Microvessel Segmentation:</strong> nnU-Net v2 pipeline automating density quantification across gigapixel whole-slide images; eliminated tile-boundary artefacts via overlap-averaged inference.</li>
                        <li><strong>IHC Analysis Platform:</strong> Multi-marker inference backend (CD68, CD34 and astrocyte; beta-amyloid planned) behind a single React + Django + Celery interface; resolved container-crash failures under large TIFF workloads.</li>
                        <li><strong>Fetal Brain Skull-Stripping:</strong> Skull-stripping models for postmortem fetal brain MRI (nnU-Net and nnSAM). Found and fixed a silent orientation error that transposed predictions, and established the correct brain-boundary convention against a public fetal brain atlas. nnU-Net trained on masks including CSF, with fold 0 fine-tuned on expert-annotated masks.</li>
                      </ul>
                    </div>

                    {/* Subsection 3 */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-400 mb-4 tracking-widest border-b border-border/50 pb-2">MLOps, Infrastructure & Systems Architecture</h4>
                      <ul className="space-y-4 text-muted-foreground list-disc pl-4">
                        <li><strong>Neurological Asset Tracking System:</strong> Interviewed lab personnel to surface physical edge cases across the specimen lifecycle (sectioning, staining, QR-coded digital storage); architected the relational data model and ORM layer, built the tracking interface, and delivered BPMN/UML workflow diagrams to the CSO.</li>
                        <li><strong>Asynchronous Processing:</strong> Django, Celery, and Redis platforms for high-throughput, non-blocking inference.</li>
                      </ul>
                    </div>

                    {/* Subsection 4 */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-400 mb-4 tracking-widest border-b border-border/50 pb-2">Web</h4>
                      <ul className="space-y-4 text-muted-foreground list-disc pl-4">
                        <li><strong>Institute Website:</strong> Built the institute&apos;s public website solo in React (sgbc.humanbrain.in) and the BRICS 2026 Neuroscience Symposium pages.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative pl-8 border-l border-border">
                  <div className="absolute w-3 h-3 bg-muted-foreground/40 rounded-full -left-[6.5px] top-1.5" />
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Career break (health)</h3>
                    <span className="text-sm font-mono text-muted-foreground">June 2024 – October 2025</span>
                  </div>
                  <p className="text-muted-foreground">Fully recovered.</p>
                </div>
              </div>
            </motion.section>

            {/* Papers and Reports */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-8 border-t border-border/50"
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-sky-500 font-bold mb-6">Papers and Reports</h2>
              <ul className="space-y-6">
                {publications.map((pub) => (
                  <li key={pub.title}>
                    <p className="text-sm text-muted-foreground">{pub.authors}</p>
                    <h3 className="text-lg font-bold leading-snug mt-1">{pub.title}</h3>
                    <p className="text-sky-500 font-medium text-sm mt-1">{pub.venue}</p>
                    {pub.links
                      .filter((link) => !link.href.startsWith("/"))
                      .map((link) => (
                        <p key={link.href} className="text-sm text-muted-foreground mt-1">
                          {link.label}:{" "}
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-500 underline underline-offset-2"
                          >
                            {link.href.replace("https://", "")}
                          </a>
                        </p>
                      ))}
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Challenges */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="pt-8 border-t border-border/50"
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-sky-500 font-bold mb-2">Challenges (MICCAI 2026)</h2>
              <p className="text-sm text-muted-foreground mb-6">Entered as an independent researcher.</p>
              <ul className="space-y-3 text-muted-foreground">
                {challenges.map((challenge) => (
                  <li key={challenge.slug}>
                    <Link
                      href={`/challenges/${challenge.slug}`}
                      className="font-semibold text-foreground hover:text-sky-500 underline-offset-2 hover:underline transition-colors"
                    >
                      {challenge.name}
                    </Link>
                    <span>: {challenge.resumeLine ?? challenge.result}</span>
                  </li>
                ))}
              </ul>
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
                <h3 className="text-xl font-bold">B.Tech, Computer Science and Engineering (AI specialisation)</h3>
                <p className="text-sky-500 font-medium">Karunya Institute of Technology and Sciences</p>
                <p className="text-sm text-muted-foreground mt-1">2020 to 2024</p>
              </div>
            </motion.section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-16">
            {/* Skills */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-sky-500 font-bold mb-8">Skills</h2>
              <dl className="space-y-5">
                {skills.map((skill) => (
                  <div key={skill.label}>
                    <dt className="text-[10px] font-bold uppercase text-zinc-500 mb-1 tracking-widest">{skill.label}</dt>
                    <dd className="text-sm text-muted-foreground leading-relaxed">{skill.text}</dd>
                  </div>
                ))}
              </dl>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}
