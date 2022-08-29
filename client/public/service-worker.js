self.addEventListener("install", () => {
  console.log("SW INSTALLED");
});

self.addEventListener("fetch", (e) => {
  // e.respondWith("JOHNNY IS HERE");
});
