declare const self: ServiceWorkerGlobalScope;

export const serviceWorker = () => {
  const cacheVersion = "v1.0.12";
  const cacheName = `relay-cache-${cacheVersion}`;
  const indexURL = new URL("/", import.meta.url);

  const cacheFirstThenFetch = async (req: Request) => {
    const proxiedReq = req.mode == "navigate" ? indexURL : req;
    const cacheRes = await caches.match(proxiedReq);
    if (cacheRes) {
      return cacheRes;
    }
    const fetchRes = await fetch(proxiedReq);
    const cache = await caches.open(cacheName);
    const cacheKeys = await cache.keys();
    if (cacheKeys.length > 20) cache.delete(cacheKeys[0]);
    await cache.put(proxiedReq, fetchRes.clone());
    return fetchRes;
  };

  self.addEventListener("install", () => {
    self.skipWaiting();
  });

  self.addEventListener("activate", async (e) => {
    const keys = await caches.keys();
    e.waitUntil(Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))));
    await self.clients.claim();
  });

  self.addEventListener("fetch", async (e) => {
    const fileTypesToBeCached: RequestDestination[] = [
      "font",
      "image",
      "audio",
      "document",
      "style",
      "script",
      "worker",
      "manifest",
    ];
    if (e.request.url.includes(indexURL.hostname) && fileTypesToBeCached.includes(e.request.destination)) {
      const res = cacheFirstThenFetch(e.request);
      e.respondWith(res);
    }
  });
};

serviceWorker();
