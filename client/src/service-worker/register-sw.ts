export const registerServiceWorker = async () => {
  try {
    await navigator?.serviceWorker.register("./service-worker.js");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
};

registerServiceWorker();
