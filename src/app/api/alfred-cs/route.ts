import { GoogleGenAI, ThinkingLevel, type Content } from "@google/genai";
import { NextRequest } from "next/server";
import { buildSystemInstruction } from "@/lib/alfred-knowledge";
import { extractChips } from "@/lib/chips";

const MODEL = process.env.ALFRED_MODEL || "gemini-3.5-flash-lite";
const HISTORY_TURNS = 8;
const MAX_MESSAGE_CHARS = 2000;
// Thinking tokens count toward this cap: LOW thinking plus a ~120-word reply and the chip line.
const MAX_OUTPUT_TOKENS = 1500;
// Measured from the start of the request (including the one 503 retry) to the first streamed text.
const FIRST_TOKEN_TIMEOUT_MS = 12000;
const RETRY_DELAY_MS = 1000;

const FALLBACK_TEXT =
  "The line to Mr. Paul's archive is engaged. Please try again in a minute, or use the contact form below.";
const FALLBACK_CHIPS = [
  "What did the AIMS-TBI paper find?",
  "How did RARE26 predict its own leaderboard?",
];

type IncomingMessage = { role: "user" | "assistant" | "alfred"; content: string };

let client: GoogleGenAI | null = null;
let systemInstruction: string | null = null;

function toContents(messages: IncomingMessage[]): Content[] {
  const contents: Content[] = messages.slice(-HISTORY_TURNS).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content.slice(0, MAX_MESSAGE_CHARS) }],
  }));
  while (contents.length && contents[0].role !== "user") contents.shift();
  return contents;
}

function describeError(err: unknown): string {
  const key = process.env.GOOGLE_AI_API_KEY;
  const status = (err as { status?: number })?.status;
  const message = err instanceof Error ? err.message : String(err);
  const safe = key ? message.split(key).join("[redacted]") : message;
  return `status=${status ?? "n/a"} ${safe}`;
}

export async function POST(req: NextRequest) {
  let messages: IncomingMessage[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.messages)) {
      messages = body.messages.filter(
        (m: IncomingMessage) => typeof m?.content === "string" && m.content.trim()
      );
    }
  } catch {
    // fall through to the empty-query response
  }

  const contents = toContents(messages);
  if (!contents.length || contents[contents.length - 1].role !== "user") {
    return new Response(JSON.stringify({ error: "No query provided" }), {
      status: 400,
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (text: string) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      let full = "";
      const firstToken = new AbortController();
      const firstTokenTimer = setTimeout(() => firstToken.abort(), FIRST_TOKEN_TIMEOUT_MS);

      try {
        client ??= new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
        systemInstruction ??= buildSystemInstruction();

        const request = () =>
          client!.models.generateContentStream({
            model: MODEL,
            contents,
            config: {
              systemInstruction: systemInstruction!,
              temperature: 0.1,
              maxOutputTokens: MAX_OUTPUT_TOKENS,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              abortSignal: firstToken.signal,
            },
          });

        // One retry for transient "high demand" 503s; 429s go straight to the fallback to spare quota.
        let response;
        try {
          response = await request();
        } catch (err) {
          if ((err as { status?: number })?.status !== 503) throw err;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
          response = await request();
        }

        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            clearTimeout(firstTokenTimer);
            full += text;
            send(text);
          }
        }

        if (!extractChips(full).chips.length) send(`\n${JSON.stringify(FALLBACK_CHIPS)}`);
      } catch (err) {
        const reason = firstToken.signal.aborted
          ? `no first token within ${FIRST_TOKEN_TIMEOUT_MS} ms`
          : describeError(err);
        console.error("Alfred upstream error:", reason);
        send(`${full ? "\n\n" : ""}${FALLBACK_TEXT}\n${JSON.stringify(FALLBACK_CHIPS)}`);
      } finally {
        clearTimeout(firstTokenTimer);
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
