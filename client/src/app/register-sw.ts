export const registerServiceWorker = async () => {
  try {
    const registered = await navigator?.serviceWorker.register("./service-worker.js");
    console.info("✅ Service worker registered successfully");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
};

registerServiceWorker();
