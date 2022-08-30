export function fetchData(url: string, reqInit?: RequestInit) {
  const BASE_URL = import.meta.env.DEV ? "http://localhost:4000" : "";
  return fetch(BASE_URL + url, reqInit);
}
