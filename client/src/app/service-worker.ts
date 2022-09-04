/// <reference lib="WebWorker" />
declare const self: ServiceWorkerGlobalScope;
const serviceWorker = () => {
  const addResourcesToCache = async (resources: RequestInfo[]) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
  };
  self.addEventListener("install", (event) => {
    console.info("🤖 Service worker installed");
    // event.waitUntil(addResourcesToCache(["/404.html"]));
  });

  self.addEventListener("activate", () => {
    console.info("💪 Service worker activated");
  });

  self.addEventListener("fetch", (e) => {});
};
export default serviceWorker;
