export async function checkAuthStatus(signal: AbortSignal) {
  const res = await fetch("/api/get-access-token", { signal });
  if (!res.ok) {
    return false;
  }
  const accessToken = await res.text();
  sessionStorage.setItem("accessToken", accessToken);
  return true;
}
