export const registerServiceWorker = async () => {
  try {
    const registered = await navigator?.serviceWorker.register("./service-worker.js", {
      type: "module",
    });
    console.info("🪛👷 Service worker registered successfully.");
  } catch (err) {
    console.error("❌ Error: Service worker could not be registered ❌");
  }
};

registerServiceWorker();
