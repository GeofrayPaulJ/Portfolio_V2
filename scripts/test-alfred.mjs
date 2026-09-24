// Posts questions to Alfred on a running dev server, prints each reply and checks it.
// Usage: node scripts/test-alfred.mjs [baseUrl]   (default http://localhost:3000)
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const BASE = process.argv[2] || "http://localhost:3000";
const PAUSE_MS = 5000;

const DEFLECTION = "falls outside what I've been briefed on";
const FALLBACK_MARKER = "The line to Mr. Paul's archive is engaged";
const CHALLENGE_TERMS = /challenge|MICCAI|AIMS-TBI|RARE26|TopAneu|Educational|leaderboard/i;
const EMPLOYER_TERMS = /SGBC|Sudha|Gopalakrishnan|IIT/i;

const answersChallenge = (reply) => [
  !reply.includes(DEFLECTION) || "deflected instead of answering from the knowledge base",
  !EMPLOYER_TERMS.test(reply) || "mentions the employer in a challenge answer",
];

const QUESTIONS = [
  { q: "hello", checks: () => [] },
  { q: "What did the AIMS-TBI paper find?", checks: answersChallenge },
  {
    q: "How did RARE26 predict its own leaderboard?",
    checks: (reply) => [
      ...answersChallenge(reply),
      (/0\.0252/.test(reply) && /0\.0333/.test(reply)) || "omits the leave-one-centre-out projection (0.0252 and 0.0333)",
      /0\.0782/.test(reply) || "omits the pooled projection (0.0782) the finding is compared against",
      !/acceptance statistic|screening|uncalibrated/i.test(reply) ||
        "ties the uncalibrated component-screening statistic to the projection",
    ],
  },
  { q: "What limited the TopAneu pipeline?", checks: answersChallenge },
  {
    q: "What GPU did he use?",
    checks: (reply, prose) => [
      /16 GB consumer GPU/i.test(reply) || "does not give the challenge hardware as a 16 GB consumer GPU",
      !sentences(prose).some((s) => /A100|DGX/i.test(s) && CHALLENGE_TERMS.test(s)) ||
        "connects the DGX A100 to a challenge in the same sentence",
      sentences(prose).length <= 2 || `answer is ${sentences(prose).length} sentences, expected one or two`,
    ],
  },
  {
    q: "What GPU did he use for the AIMS-TBI challenge?",
    checks: (reply) => [
      /16 GB consumer GPU/i.test(reply) || "does not say a single 16 GB consumer GPU",
      !/A100|DGX/i.test(reply) || "mentions the DGX A100 in a challenge answer",
      !EMPLOYER_TERMS.test(reply) || "mentions the employer in a challenge answer",
    ],
  },
  {
    q: "Where did he place in AIMS-TBI?",
    checks: (reply) => [
      (/8th/.test(reply) && /11th/.test(reply)) || "does not give 8th (detection) and 11th (segmentation)",
      /1 October 2026/.test(reply) || "omits the status: official ranking announced 1 October 2026",
      !/preliminary/i.test(reply) || "labels the AIMS-TBI result preliminary",
      !EMPLOYER_TERMS.test(reply) || "mentions the employer in a challenge answer",
    ],
  },
  {
    q: "Is he available for consulting?",
    checks: (reply) => [
      reply.includes(DEFLECTION) || "does not use the standard deflection",
      !/\brates?\b|\bSOW\b|BYOC|engagement/i.test(reply) || "contains consulting content",
    ],
  },
];

// Every number Alfred states must appear in the knowledge base (catches dropped digits such as 0.782 for 0.0782).
const NUMBER = /\d+(?:[.,]\d+)*/g;
const KNOWN_NUMBERS = new Set(
  readdirSync("corpus")
    .filter((f) => f.endsWith(".md"))
    .flatMap((f) => readFileSync(join("corpus", f), "utf-8").match(NUMBER) ?? [])
);

const GLOBAL_CHECKS = (reply, prose) => {
  const unknown = [...new Set(prose.match(NUMBER) ?? [])].filter((n) => !KNOWN_NUMBERS.has(n));
  return [
    !/RTX|5060|\bT4\b/i.test(reply) || "names a GPU model",
    !/\b(leading|winner|winning|first place|1st place)\b/i.test(reply) || "uses banned placement wording",
    !unknown.length || `states numbers not in the knowledge base: ${unknown.join(", ")}`,
  ];
};

function sentences(prose) {
  return prose
    .replace(/\b(Mr|Mrs|Ms|Dr|vs|e\.g|i\.e)\./g, "$1")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

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
  return text.trim();
}

function splitChips(text) {
  const lines = text.split("\n");
  const last = lines.pop().trim();
  try {
    let chips = JSON.parse(last);
    if (Array.isArray(chips) && chips.length === 1 && Array.isArray(chips[0])) chips = chips[0];
    if (Array.isArray(chips) && chips.length === 2 && chips.every((c) => typeof c === "string")) {
      return { prose: lines.join("\n").trim(), chips };
    }
  } catch {
    // not a chip line
  }
  return { prose: text, chips: null };
}

let failures = 0;
for (const [i, { q, checks }] of QUESTIONS.entries()) {
  if (i) await new Promise((r) => setTimeout(r, PAUSE_MS));
  console.log(`\n=== Q${i + 1}: ${q}`);
  try {
    const reply = await ask(q);
    console.log(reply);
    const { prose, chips } = splitChips(reply);
    const problems = [
      chips ? true : "final line is not a two-item JSON array",
      !reply.includes(FALLBACK_MARKER) || "upstream fallback was served",
      ...GLOBAL_CHECKS(reply, prose),
      ...checks(reply, prose),
    ].filter((r) => r !== true);
    console.log(problems.length ? `--- FAIL: ${problems.join("; ")}` : "--- PASS");
    if (problems.length) failures++;
  } catch (err) {
    console.log(`--- FAIL: request failed: ${err.message}`);
    failures++;
  }
}

console.log(`\n${QUESTIONS.length - failures}/${QUESTIONS.length} passed`);
process.exit(failures ? 1 : 0);
