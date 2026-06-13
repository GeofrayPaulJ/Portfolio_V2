import { notFound } from "next/navigation";
import Link from "next/link";
import { getNoteMetadata, getNoteContent, getAllNoteSlugs } from "@/lib/notes";
import NoteRenderer from "@/components/note-renderer";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getNoteMetadata(slug);
  if (!meta) return { title: "Note Not Found" };

  return {
    title: `${meta.title} | Technical Notes, Geofray Paul J`,
    description: meta.description,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getNoteMetadata(slug);
  if (!meta) notFound();

  const content = getNoteContent(slug);

  return (
    <section className="relative min-h-screen bg-background pt-32 pb-24 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Back Navigation */}
        <Link
          href="/#documentation"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sky-500 transition-colors mb-10 group"
        >
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Technical Notes
        </Link>

        {/* Note Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <span className="font-mono text-3xl font-bold text-sky-500 leading-none">
              {meta.number}
            </span>
            <span className="font-mono text-xs text-muted-foreground/50">
              {meta.readTime} read
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-6">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] text-muted-foreground/50 dark:text-white/35"
              >
                {tag}
                {tag !== meta.tags[meta.tags.length - 1] && (
                  <span className="ml-2 text-muted-foreground/25 dark:text-white/20 select-none">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>

          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl">
            {meta.description}
          </p>
        </header>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

        {/* Content */}
        {content ? (
          <NoteRenderer content={content} />
        ) : (
          <div className="text-center py-20">
            <span className="font-mono text-6xl font-bold text-sky-500/20 block mb-6">
              {meta.number}
            </span>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Publication Pending
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              This technical note is currently under active development. The full
              write-up will be published once the research findings are
              finalised.
            </p>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-20 pt-8 border-t border-border">
          <Link
            href="/#documentation"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sky-500 transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            All Technical Notes
          </Link>
        </div>
      </div>
    </section>
  );
}
