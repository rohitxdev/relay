declare const self: ServiceWorkerGlobalScope;

export const serviceWorker = () => {
  const cacheVersion = "v1.0.8";
  const cacheName = `relay-cache-${cacheVersion}`;

  const cacheFirstThenFetch = async (req: Request) => {
    const cacheRes = await caches.match(req);
    if (cacheRes) {
      return cacheRes;
    }
    const fetchRes = await fetch(req);
    const cache = await caches.open(cacheName);
    await cache.put(req, fetchRes.clone());
    return fetchRes;
  };

  const fetchWithFallback = async (req: Request) => {
    try {
      const fetchRes = await fetch(req);
      return fetchRes;
    } catch (err) {
      const fallbackRes = await caches.match("/");
      return fallbackRes as Response;
    }
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
    if (!e.request.url.includes("api")) {
      if (e.request.mode === "same-origin") {
        const res = cacheFirstThenFetch(e.request);
        e.respondWith(res);
      }
      if (e.request.mode === "navigate") {
        const res = fetchWithFallback(e.request);
        e.respondWith(res);
      }
    }
  });
};

serviceWorker();
