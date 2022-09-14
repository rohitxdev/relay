declare const self: ServiceWorkerGlobalScope;

export const serviceWorker = () => {
  const cacheVersion = "v1.0.10";
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

  const fetchPage = async (url: string) => {
    const cacheRes = await caches.match(url);
    return cacheRes ? cacheRes : fetch(url);
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
    if (e.request.method === "GET" && fileTypesToBeCached.includes(e.request.destination)) {
      const res = cacheFirstThenFetch(e.request);
      e.respondWith(res);
    }

    if (e.request.mode === "navigate") {
      const res = fetchPage("/");
      e.respondWith(res);
    }
  });
};

serviceWorker();
