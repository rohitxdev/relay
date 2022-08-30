const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";
const EXPIRATION_TIME_IN_SECONDS = 2 * 86400;

export { PORT, HOST, EXPIRATION_TIME_IN_SECONDS };
