const registerSW = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./")
      .then((reg) => {
        console.warn("SERVICE WORKER REGISTERED 😈😈😈", reg);
      })
      .catch(() => {
        console.warn("😭😭😭😭");
      });
  }
};

declare const self: ServiceWorkerGlobalScope;
self.addEventListener("install", () => {
  console.warn("🍻🍻🍻🍻");
});
self.addEventListener("activate", () => {
  console.warn("🐼🐼🐼🐼");
});

export { registerSW };
