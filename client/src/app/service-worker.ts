declare const self: ServiceWorkerGlobalScope;

export const serviceWorker = () => {
  const cacheVersion = "v1.0.9";
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

  const fetchPage = async (req: Request) => {
    const cacheRes = await caches.match("/");
    return cacheRes ? cacheRes : fetch(req);
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
    if (fileTypesToBeCached.includes(e.request.destination) || e.request.url.includes("assets")) {
      const res = cacheFirstThenFetch(e.request);
      e.respondWith(res);
    }

    if (e.request.mode === "navigate") {
      const res = fetchPage(e.request);
      e.respondWith(res);
    }
  });
};

serviceWorker();
