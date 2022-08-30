export const registerSW = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./swtest.js", { type: "module" })
      .then((reg) => {
        console.warn("SERVICE WORKER REGISTERED 😈😈😈", reg);
      })
      .catch(() => {
        console.warn("😭😭😭😭");
      });
  }
};
