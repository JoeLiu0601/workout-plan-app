const CACHE_NAME = "workout-app-cache-v8";
// Keep asset versions aligned with index.html and manifest.json so an older
// browser HTTP cache cannot mix previous scripts with the new page.
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=8",
  "./app.js?v=8",
  "./data.js?v=8",
  "./store.js?v=8",
  "./manifest.json?v=8",
  "./icon.svg?v=8",
  "./icons/icon-180.png?v=8",
  "./icons/icon-192.png?v=8",
  "./icons/icon-512.png?v=8"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key.startsWith("workout-app-cache-") && key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(async response => {
        if (!response.ok) return (await caches.match(event.request)) || response;
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
