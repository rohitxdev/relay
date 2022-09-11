declare const self: ServiceWorkerGlobalScope;

export const serviceWorker = () => {
  const CACHE_NAME = `relay_cache::`;
  const CACHE_VERSION = "v1.0.0";

  const addResourcesToCache = async (resources: string | string[]) => {
    try {
      const cache = await caches.open(CACHE_NAME + CACHE_VERSION);
      await cache.addAll(resources);
    } catch (err) {
      console.error(err);
    }
  };
  self.addEventListener("install", (e) => {
    console.info("🤖 Service worker installed");
    e.waitUntil(
      addResourcesToCache([
        "index.html",
        "index.css",
        "index.js",
        "inter-variable-font.woff2",
        "call-join.mp3",
        "call-leave.mp3",
        "relay-128x128.png",
        "relay-256x256.png",
      ])
    );
  });

  self.addEventListener("activate", () => {
    console.info("💪 Service worker activated");
  });

  self.addEventListener("offline", () => {
    console.log("client offline");
  });

  self.addEventListener("fetch", (e) => {
    e.respondWith(
      caches.match(e.request).then((cacheRes) => {
        if (cacheRes) {
          console.log("cache matched");
        }
        return cacheRes || fetch(e.request);
      })
    );
  });
};

serviceWorker();
