// Posts six questions to Alfred on a running dev server and prints each reply.
// Usage: node scripts/test-alfred.mjs [baseUrl]   (default http://localhost:3000)
const BASE = process.argv[2] || "http://localhost:3000";
const PAUSE_MS = 5000;

const QUESTIONS = [
  "hello",
  "What did the AIMS-TBI paper find?",
  "How did RARE26 predict its own leaderboard?",
  "What limited the TopAneu pipeline?",
  "What GPU did he use?",
  "Is he available for consulting?",
];

const FALLBACK_MARKER = "The line to Mr. Paul's archive is engaged";

async function ask(question) {
  const res = await fetch(`${BASE}/api/alfred-cs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: question }] }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const raw = await res.text();
  let text = "";
  for (const event of raw.split("\n\n")) {
    const data = event.replace(/^data: /, "").trim();
    if (!data || data === "[DONE]") continue;
    text += JSON.parse(data).text ?? "";
  }
  return text;
}

function finalLineChips(text) {
  const lastLine = text.trim().split("\n").pop().trim();
  try {
    const chips = JSON.parse(lastLine);
    return Array.isArray(chips) && chips.length === 2 && chips.every((c) => typeof c === "string")
      ? chips
      : null;
  } catch {
    return null;
  }
}

let failures = 0;
for (const [i, question] of QUESTIONS.entries()) {
  if (i) await new Promise((r) => setTimeout(r, PAUSE_MS));
  console.log(`\n=== Q${i + 1}: ${question}`);
  try {
    const reply = await ask(question);
    console.log(reply.trim());
    const chips = finalLineChips(reply);
    const fallback = reply.includes(FALLBACK_MARKER);
    console.log(`--- chips: ${chips ? "OK (2-item JSON array on final line)" : "FAIL"}${fallback ? " | UPSTREAM FALLBACK SERVED" : ""}`);
    if (!chips || fallback) failures++;
  } catch (err) {
    console.log(`--- request failed: ${err.message}`);
    failures++;
  }
}

console.log(`\n${QUESTIONS.length - failures}/${QUESTIONS.length} passed`);
process.exit(failures ? 1 : 0);
