const CACHE_NAME = "workout-app-cache-v10";
// Keep asset versions aligned with index.html and manifest.json so an older
// browser HTTP cache cannot mix previous scripts with the new page.
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=10",
  "./app.js?v=10",
  "./data.js?v=10",
  "./food-catalog.js?v=10",
  "./food-search.js?v=10",
  "./store.js?v=10",
  "./manifest.json?v=10",
  "./icon.svg?v=10",
  "./icons/icon-180.png?v=10",
  "./icons/icon-192.png?v=10",
  "./icons/icon-512.png?v=10"
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
