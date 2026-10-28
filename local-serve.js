#!/usr/bin/env node
/*
 * TEMPLATE — local offline server for a demo prototype (or several).
 *
 * Zero dependencies (Node built-ins only). Serves each prebuilt app on a fixed
 * localhost port, then drops a clickable URL sheet + a Chrome-importable
 * bookmarks file on the Desktop and opens the sheet. Nothing is installed or
 * built at run time — apps must already be prebuilt (a Vite app carries its
 * committed `dist/`), so this works with no internet.
 *
 * TO ADAPT: set DEMO_NAME and edit the APPS array below. Place this file next
 * to offline-sw.js at the root of wherever your app folders live.
 *
 *   Run:  node local-serve.js
 *   Or double-click:  "start-demos.command"
 *
 * Stop: Ctrl-C in the terminal, or just close the window.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFile } = require("child_process");

const ROOT = __dirname; // this file lives at the root of your app folders

// Label used for the Desktop URL sheet + bookmarks file/folder.
const DEMO_NAME = "Tableau Proactive Intelligence in Slack";

// One entry per app to serve.
//   name        — label shown in the terminal + Desktop sheet
//   dir         — app folder, relative to this file
//   serve       — subfolder actually served ('' = the app folder itself;
//                 e.g. 'dist' for a built Vite app, 'src', 'publish', ...)
//   port        — fixed localhost port
//   appFallback — optional: deep links under /app resolve to app/index.html
//                 (only if your app is an SPA mounted under /app)
const APPS = [
  { name: "Proactive Intelligence in Slack", dir: ".", serve: "", port: 8091 },
  // { name: "Second App", dir: "second-app", serve: "", port: 8082 },
];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".mjs":  "text/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".otf":  "font/otf",
  ".map":  "application/json",
  ".txt":  "text/plain; charset=utf-8",
  ".csv":  "text/csv; charset=utf-8",
  ".xml":  "application/xml",
};

// Offline failover service worker (served on every app origin) + the tiny
// registration snippet injected into HTML. See offline-sw.js for what it does.
const SW_ROUTE = "/__keynote-offline-sw.js";
const SW_FILE = path.join(ROOT, "offline-sw.js");
const SW_SNIPPET =
  '\n<script>(function(){if(!("serviceWorker" in navigator))return;' +
  'navigator.serviceWorker.register("' + SW_ROUTE + '").then(function(){' +
  'if(!navigator.serviceWorker.controller&&!sessionStorage.getItem("kwSwReloaded")){' +
  'sessionStorage.setItem("kwSwReloaded","1");location.reload();}}).catch(function(){});})();</script>\n';

function injectSW(html) {
  if (html.indexOf(SW_ROUTE) !== -1) return html; // already present
  if (html.indexOf("</head>") !== -1) return html.replace("</head>", SW_SNIPPET + "</head>");
  if (html.indexOf("</body>") !== -1) return html.replace("</body>", SW_SNIPPET + "</body>");
  return html + SW_SNIPPET;
}

function serveFile(res, filePath, status) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") {
    const body = Buffer.from(injectSW(fs.readFileSync(filePath, "utf8")), "utf8");
    res.writeHead(status || 200, { "Content-Type": TYPES[ext] });
    return res.end(body);
  }
  const body = fs.readFileSync(filePath);
  res.writeHead(status || 200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
  res.end(body);
}

function makeServer(app) {
  const base = path.join(ROOT, app.dir, app.serve);
  return http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    // Serve the offline service worker on every app origin (root scope).
    if (urlPath === SW_ROUTE) {
      try {
        const sw = fs.readFileSync(SW_FILE);
        res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Service-Worker-Allowed": "/", "Cache-Control": "no-cache" });
        return res.end(sw);
      } catch (e) { res.writeHead(500); return res.end("sw missing"); }
    }
    if (urlPath === "/" || urlPath === "") urlPath = "/index.html";
    const filePath = path.normalize(path.join(base, urlPath));
    // Directory-traversal guard.
    if (!filePath.startsWith(base)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    fs.stat(filePath, (err, st) => {
      if (!err && st.isFile()) {
        try { return serveFile(res, filePath); }
        catch (e) { res.writeHead(500); return res.end("Read error"); }
      }
      // SPA / deep-link fallback — DataApps' LWC shell lives under /app.
      const fb = app.appFallback && urlPath.startsWith("/app")
        ? path.join(base, "app", "index.html")
        : path.join(base, "index.html");
      if (fs.existsSync(fb)) {
        try { return serveFile(res, fb, 200); }
        catch (e) { res.writeHead(500); return res.end("Read error"); }
      }
      res.writeHead(404);
      res.end("Not found");
    });
  });
}

const results = [];
let pending = APPS.length;

function afterAllStarted() {
  writeDesktopSheet(results);
  writeChromeBookmarks(results);
  printSummary(results);
}

APPS.forEach((app) => {
  const base = path.join(ROOT, app.dir, app.serve);
  const url = `http://localhost:${app.port}/`;
  if (!fs.existsSync(base)) {
    results.push({ ...app, url, status: "MISSING", note: `folder not found: ${path.relative(ROOT, base)}` });
    if (--pending === 0) afterAllStarted();
    return;
  }
  const server = makeServer(app);
  server.on("error", (e) => {
    const note = e.code === "EADDRINUSE" ? `port ${app.port} already in use` : e.message;
    results.push({ ...app, url, status: "ERROR", note });
    if (--pending === 0) afterAllStarted();
  });
  server.listen(app.port, () => {
    results.push({ ...app, url, status: "OK", note: "" });
    if (--pending === 0) afterAllStarted();
  });
});

function writeDesktopSheet(rows) {
  const ordered = APPS.map((a) => rows.find((r) => r.name === a.name)).filter(Boolean);
  const when = new Date().toLocaleString();
  const cards = ordered.map((r) => {
    const ok = r.status === "OK";
    const badge = ok ? "" : `<span class="badge">${r.status}${r.note ? " — " + r.note : ""}</span>`;
    const href = ok ? r.url : "#";
    return `
      <a class="card ${ok ? "" : "down"}" href="${href}" ${ok ? "" : 'onclick="return false"'}>
        <div class="name">${r.name} ${badge}</div>
        <div class="url">${ok ? r.url : "unavailable"}</div>
      </a>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>${DEMO_NAME} — Local Demo URLs</title>
<style>
  :root { color-scheme: light; }
  body { font: 15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; margin: 0; background: #f4f6fb; color: #1c2333; }
  header { padding: 28px 32px 8px; }
  h1 { margin: 0 0 4px; font-size: 22px; }
  .sub { color: #6b7280; font-size: 13px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 14px; padding: 20px 32px 40px; }
  .card { display: block; text-decoration: none; color: inherit; background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 4px 18px rgba(20,25,35,.06); transition: transform .08s ease, box-shadow .08s ease; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(20,25,35,.10); }
  .card.down { opacity: .55; cursor: default; }
  .name { font-weight: 600; font-size: 16px; margin-bottom: 6px; }
  .url { font-family: ui-monospace,SFMono-Regular,Menlo,monospace; font-size: 13px; color: #05628a; }
  .badge { display: inline-block; font: 600 11px/1 sans-serif; color: #b91c1c; background: #fee2e2; padding: 3px 7px; border-radius: 999px; vertical-align: middle; }
  footer { padding: 0 32px 32px; color: #9aa2b1; font-size: 12px; }
</style></head>
<body>
  <header>
    <h1>${DEMO_NAME} — Local Demo URLs</h1>
    <div class="sub">Served locally from this laptop · generated ${when}</div>
  </header>
  <div class="grid">${cards}</div>
  <footer>Servers run in the Terminal window that launched them. Keep it open while presenting; close it (or Ctrl-C) to stop. Re-run <b>start-demos.command</b> to bring them back.</footer>
</body></html>`;

  const dest = path.join(os.homedir(), "Desktop", DEMO_NAME + " — Local URLs.html");
  try {
    fs.writeFileSync(dest, html);
    // Open it (macOS `open`; harmless no-op message elsewhere).
    execFile("open", [dest], (err) => { if (err) console.log("  (open the sheet manually: " + dest + ")"); });
    console.log("\nDesktop sheet written: " + dest);
  } catch (e) {
    console.log("\nCould not write Desktop sheet (" + e.message + "). URLs are listed above.");
  }
}

function writeChromeBookmarks(rows) {
  // Netscape bookmark format — import via Chrome ▸ Bookmarks ▸ Import Bookmarks
  // and Settings ▸ Bookmarks HTML File. Creates a folder named DEMO_NAME.
  const ok = APPS.map((a) => rows.find((r) => r.name === a.name)).filter((r) => r && r.status === "OK");
  const items = ok.map((r) => `        <DT><A HREF="${r.url}">${r.name}</A>`).join("\n");
  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3>${DEMO_NAME}</H3>
    <DL><p>
${items}
    </DL><p>
</DL><p>
`;
  const dest = path.join(os.homedir(), "Desktop", DEMO_NAME + " — Chrome Bookmarks.html");
  try {
    fs.writeFileSync(dest, html);
    console.log("Chrome bookmarks written: " + dest);
    console.log("  Import once: Chrome ▸ Bookmarks ▸ Import Bookmarks and Settings ▸ Bookmarks HTML File → pick that file.");
  } catch (e) {
    console.log("Could not write Chrome bookmarks (" + e.message + ").");
  }
}

function printSummary(rows) {
  const ordered = APPS.map((a) => rows.find((r) => r.name === a.name)).filter(Boolean);
  console.log("\n  " + DEMO_NAME + " — local demo servers\n  " + "-".repeat(52));
  ordered.forEach((r) => {
    const pad = r.name.padEnd(20);
    if (r.status === "OK") console.log("  ✓ " + pad + r.url);
    else console.log("  ✗ " + pad + r.status + (r.note ? " (" + r.note + ")" : ""));
  });
  console.log("  " + "-".repeat(52));
  console.log("  Leave this window open while presenting. Ctrl-C to stop.\n");
}
