"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
  layoutId = "hoverBackground",
}: {
  items: {
    title: string;
    description: string;
    tags?: string[];
  }[];
  className?: string;
  layoutId?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-sky-500/[0.12] dark:bg-sky-500/[0.08] block rounded-2xl"
                layoutId={layoutId}
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
          <HoverCard>
            <HoverCardTitle>{item.title}</HoverCardTitle>
            <HoverCardDescription>{item.description}</HoverCardDescription>
            {item.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </HoverCard>
        </div>
      ))}
    </div>
  );
};

const HoverCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full overflow-hidden border border-border bg-slate-50/50 dark:bg-background/80 backdrop-blur-sm relative z-20 transition-all duration-300 group-hover:border-sky-500/30",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const HoverCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h4
      className={cn(
        "text-foreground font-semibold tracking-tight text-lg",
        className
      )}
    >
      {children}
    </h4>
  );
};

const HoverCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "mt-3 text-muted-foreground tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
