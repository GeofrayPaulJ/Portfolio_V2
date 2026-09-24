// Splits Alfred's reply into prose and the follow-up questions on its last line.
// Accepts ["a","b"] and the nested [["a","b"]] the model occasionally emits.
export function extractChips(text: string): { clean: string; chips: string[] } {
  const trimmed = text.trim();
  const lastBreak = trimmed.lastIndexOf("\n");
  const lastLine = trimmed.slice(lastBreak + 1).trim();
  if (!lastLine.startsWith("[")) return { clean: trimmed, chips: [] };

  try {
    let chips = JSON.parse(lastLine);
    if (Array.isArray(chips) && chips.length === 1 && Array.isArray(chips[0])) chips = chips[0];
    if (
      Array.isArray(chips) &&
      chips.length >= 2 &&
      chips.every((c: unknown) => typeof c === "string")
    ) {
      return { clean: trimmed.slice(0, Math.max(lastBreak, 0)).trim(), chips };
    }
  } catch {
    // Not valid JSON, leave as is
  }
  return { clean: trimmed, chips: [] };
}
