export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => {
        console.log("SERVICE WORKER REGISTERED 😈😈😈", reg);
      })
      .catch(() => {
        console.log("😭😭😭😭");
      });
  }
};
