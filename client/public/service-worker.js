const a = (params) => {
  self.addEventListener("install", () => {
    console.warn("🍻🍻🍻🍻");
  });
  self.addEventListener("activate", () => {
    console.warn("🐼🐼🐼🐼");
  });
};
a();
export { a };
