// Renders cv/*.html to the static PDFs in public/ with headless Chrome.
// Usage: node scripts/render-cv.mjs [path-to-chrome]
import { spawn } from "child_process";
import { mkdtempSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { pathToFileURL } from "url";

const CHROME = process.argv[2] || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9334;
const JOBS = [
  { src: "cv/industry.html", out: "public/Geofray_Paul_J_CV.pdf", footer: "Résumé" },
  { src: "cv/academic.html", out: "public/Geofray_Paul_J_CV_Academic.pdf", footer: "Curriculum Vitae" },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  ["--headless=new", "--disable-gpu", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "cv-"))}`, "about:blank"],
  { stdio: "ignore" }
);

let wsUrl;
for (let i = 0; i < 40 && !wsUrl; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    wsUrl = list.find((t) => t.type === "page")?.webSocketDebuggerUrl;
  } catch {}
  if (!wsUrl) await sleep(250);
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send("Page.enable");
for (const job of JOBS) {
  await send("Page.navigate", { url: pathToFileURL(resolve(job.src)).href });
  await sleep(1500);
  const footer = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:7.5pt;color:#666;width:100%;padding:0 16mm;display:flex;justify-content:space-between"><span>Geofray Paul J · ${job.footer} · September 2026</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;
  const res = await send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: footer,
  });
  if (!res.result?.data) throw new Error(`printToPDF failed for ${job.src}: ${JSON.stringify(res.error)}`);
  writeFileSync(job.out, Buffer.from(res.result.data, "base64"));
  console.log(`wrote ${job.out}`);
}
ws.close();
chrome.kill();
process.exit(0);
