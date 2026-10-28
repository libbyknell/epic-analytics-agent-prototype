/*
 * DF26 keynote offline failover — service worker.
 *
 * Injected into every locally-served app by keynote-local.js. It ONLY touches
 * the handful of external hosts the prototypes pull avatars/fonts from; every
 * other request passes straight through untouched (so it cannot break an app).
 *
 * Strategy for those hosts: cache-first, then network, and cache what the
 * network returns. So while you're online during setup the cache fills up;
 * if the venue Wi-Fi dies mid-keynote, the same assets are served from cache.
 * On install it also precaches the known static set so coverage doesn't depend
 * on clicking through every screen. Anything still missing offline falls back
 * to a generated SVG avatar (never a broken image).
 */
const CACHE = "kw-offline-v1";

// Hosts we intercept. Everything else is left alone.
const HOSTS = [
  "i.pravatar.cc",
  "randomuser.me",
  "avatars.slack-edge.com",
  "ui-avatars.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

// Stable cache key: pravatar images are size-independent (same photo at any
// /NN?img=X), so key them by image number — that also covers URLs the app
// builds at runtime (e.g. `/80?img=${var}`). Everything else keys by full URL.
function cacheKey(url) {
  if (url.hostname === "i.pravatar.cc") {
    const img = url.searchParams.get("img") || "0";
    return "/__kwcache/pravatar/" + img;
  }
  return url.href;
}

// Known static assets, precached on install (best-effort; online at setup).
function precacheList() {
  const list = [];
  for (let i = 1; i <= 70; i++) list.push("https://i.pravatar.cc/150?img=" + i);
  [11,17,22,29,32,38,45,52,61,67,75,86].forEach(n => list.push("https://randomuser.me/api/portraits/men/" + n + ".jpg"));
  [12,22,28,33,42,44,53,55,68,79].forEach(n => list.push("https://randomuser.me/api/portraits/women/" + n + ".jpg"));
  list.push(
    "https://avatars.slack-edge.com/2025-09-22/9654321087654_f3d1e2c4b5a6f7e8d9c0_original.jpg",
    "https://avatars.slack-edge.com/2025-10-15/9732845091234_e4c2b2a8f6d7e9f3b1c4_original.jpg",
    "https://avatars.slack-edge.com/2025-11-02/9827792567218_b2c912b8b1840ebb8abb_original.jpg",
    "https://avatars.slack-edge.com/2025-11-03/9844366739553_abd89f27c90650f4c359_original.png",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400&display=swap",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
    "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap",
    "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
  );
  return list;
}

// Fetch a URL in the right mode and store it under its cache key. Google Fonts
// CSS must be readable (cors) so it can be parsed offline; images can be opaque.
async function cacheOne(cache, rawUrl) {
  const url = new URL(rawUrl);
  const isCss = url.hostname === "fonts.googleapis.com";
  const req = new Request(rawUrl, { mode: isCss ? "cors" : "no-cors" });
  const res = await fetch(req);
  await cache.put(cacheKey(url), res.clone());
  return res;
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.allSettled(precacheList().map((u) => cacheOne(cache, u)));
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// A neutral SVG avatar, optionally with initials — the last-resort fallback so
// a missing image never renders as a broken-image icon.
function fallbackAvatar(url) {
  let initials = "";
  const name = url.searchParams && url.searchParams.get("name");
  if (name) {
    initials = decodeURIComponent(name).replace(/\+/g, " ").trim().split(/\s+/)
      .slice(0, 2).map((w) => w[0] ? w[0].toUpperCase() : "").join("");
  }
  const bg = "#c7d0dc", fg = "#5b6675";
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">' +
    '<rect width="128" height="128" fill="' + bg + '"/>' +
    (initials
      ? '<text x="64" y="82" font-family="Helvetica,Arial,sans-serif" font-size="52" font-weight="600" fill="' + fg + '" text-anchor="middle">' + initials + "</text>"
      : '<circle cx="64" cy="50" r="24" fill="' + fg + '"/><path d="M24 116a40 40 0 0 1 80 0z" fill="' + fg + '"/>') +
    "</svg>";
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
}

self.addEventListener("fetch", (event) => {
  let url;
  try { url = new URL(event.request.url); } catch (e) { return; }
  if (HOSTS.indexOf(url.hostname) === -1) return; // pass through, untouched

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = cacheKey(url);
    const hit = await cache.match(key);
    if (hit) return hit;
    try {
      const res = await cacheOne(cache, event.request.url);
      return res;
    } catch (e) {
      // Offline and not cached. Avatars → generated SVG; fonts → let it fail
      // (the page falls back to system fonts, which is visually near-identical).
      const isAvatar = url.hostname !== "fonts.googleapis.com" && url.hostname !== "fonts.gstatic.com";
      if (isAvatar) return fallbackAvatar(url);
      return new Response("", { status: 504 });
    }
  })());
});
