/// <reference lib="WebWorker" />
export {};
declare const self: ServiceWorkerGlobalScope;
const addResourcesToCache = async (resources: string[]) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(addResourcesToCache(["/404.html"]));
});

self.addEventListener("activate", () => {
  console.warn("🐼🐼🐼🐼");
});

self.addEventListener("fetch", async (event) => {
  console.warn("fetched");

  if (!navigator.onLine) {
    event.respondWith((await caches.match("/404.html")) as Response);
  }
});
