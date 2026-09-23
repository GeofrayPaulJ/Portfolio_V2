"use client";

import Link from "next/link";
import { useState, useEffect } from "react";


const navLinks = [
  { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "Technical Notes", href: "#documentation" },
  { label: "Alfred AI", href: "#ai-agent" },
  { label: "Resume", href: "/resume" },
];



export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount guard for SSR hydration
    setMounted(true);
  }, []);

  if (!mounted) {
    return <footer className="w-full border-t border-transparent h-20" />;
  }

  return (
    <footer className="relative z-10 w-full border-t border-border/50 dark:border-[oklch(0.269_0_0)]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Left Anchor (Identity & Ethos) */}
          <div className="flex flex-col space-y-4">
            <Link 
              href="#hero" 
              className="text-xl md:text-2xl font-bold text-foreground tracking-tight hover:opacity-80 transition-opacity"
            >
              Geofray Paul J
            </Link>
            <p className="text-sm text-muted-foreground dark:text-white/55 leading-relaxed max-w-xs">
              Engineering high performance deep learning architectures for computational pathology and radiology.
            </p>
          </div>

          {/* Centre Console (Utility) */}
          <div className="flex flex-col md:items-center">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground dark:text-white/50 hover:text-sky-500 dark:hover:text-sky-500 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>


        </div>

        {/* Absolute Bottom (Legal) */}
        <div className="mt-10 pt-8 border-t border-border/30 dark:border-[oklch(0.269_0_0)/0.3] flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 text-[11px] font-medium tracking-wide text-muted-foreground dark:text-white/35 uppercase text-center">
          <div>
            © {currentYear} Geofray Paul J. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
