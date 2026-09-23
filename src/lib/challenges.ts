import fs from "fs";
import path from "path";
import { challenges, getChallengeMetadata } from "@/lib/challenges-meta";

export { getChallengeMetadata };
export type { ChallengeMetadata } from "@/lib/challenges-meta";

export function getAllChallengeSlugs(): string[] {
  return challenges.map((challenge) => challenge.slug);
}

export function getChallengeContent(slug: string): string | null {
  const meta = getChallengeMetadata(slug);
  if (!meta) return null;

  const challengePath = path.join(
    process.cwd(),
    "content",
    "challenges",
    meta.filename
  );
  if (!fs.existsSync(challengePath)) return null;

  return fs.readFileSync(challengePath, "utf-8");
}
