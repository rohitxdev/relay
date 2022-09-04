export const registerServiceWorker = async () => {
  try {
    const registered = await navigator?.serviceWorker.register("./service-worker.js", { type: "module", scope: "/" });
    console.info("🪛👷 Service worker registered successfully.");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      console.error("❌ Error: Service worker could not be registered ❌");
    }
  }
};

registerServiceWorker();
