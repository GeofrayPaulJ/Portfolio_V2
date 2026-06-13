"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoteRendererProps {
  content: string;
}

export default function NoteRenderer({ content }: NoteRendererProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mt-12 mb-4 pb-2 border-b border-border">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[15px] text-muted-foreground leading-[1.8] mb-5">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-muted-foreground/80 italic">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-sky-500 hover:text-sky-400 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 space-y-2 mb-5 text-[15px] text-muted-foreground leading-[1.8]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-2 mb-5 text-[15px] text-muted-foreground leading-[1.8]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-sky-500/40 pl-4 my-6 text-muted-foreground/80 italic">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block font-mono text-[13px] text-foreground/90">
                  {children}
                </code>
              );
            }
            return (
              <code className="font-mono text-[13px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-[#0d0f12] dark:bg-[#0d0f12] border border-border rounded-lg p-4 my-6 overflow-x-auto">
              {children}
            </pre>
          ),
          hr: () => (
            <hr className="my-10 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-sky-500/5 border-b border-border">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-muted-foreground border-t border-border text-[13px] leading-relaxed">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
