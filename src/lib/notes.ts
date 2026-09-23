import fs from "fs";
import path from "path";
import { notes, getNoteMetadata } from "@/lib/notes-meta";

export { getNoteMetadata };
export type { NoteMetadata } from "@/lib/notes-meta";

export function getAllNoteSlugs(): string[] {
  return notes.map((note) => note.slug);
}

export function getNoteContent(slug: string): string | null {
  const meta = getNoteMetadata(slug);
  if (!meta || !meta.filename) return null;

  const notePath = path.join(process.cwd(), "tech notes", meta.filename);
  if (!fs.existsSync(notePath)) return null;

  return fs.readFileSync(notePath, "utf-8");
}
