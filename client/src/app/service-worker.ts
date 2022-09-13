declare const self: ServiceWorkerGlobalScope;

export const serviceWorker = () => {
  const cacheVersion = "v1.0.1";
  const cacheName = `relay-cache-${cacheVersion}`;

  const cacheDynamicResource = async (req: Request, res: Response) => {
    caches.open(cacheName).then((cache) => cache.put(req, res));
  };

  self.addEventListener("activate", () => {
    caches
      .keys()
      .then((keys) => keys.map((key) => key !== cacheName && caches.delete(key)))
      .catch((err) => {
        console.error(err);
      });
  });

  self.addEventListener("fetch", async (e) => {
    if (!e.request.url.includes("api") && e.request.method === "GET") {
      const res = caches.match(e.request).then(
        (cacheRes) =>
          cacheRes ??
          fetch(e.request).then((res) => {
            cacheDynamicResource(e.request, res.clone());
            return res;
          })
      );
      e.respondWith(res);
    }
  });
};

serviceWorker();
