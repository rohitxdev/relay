import { useAuthContext } from "./useAuthContext";

export function useApi() {
  const {
    authState: { accessToken },
  } = useAuthContext();
  if (!accessToken) {
    throw new Error("Access token is null.");
  }

  return {
    getRoomID: () => fetch(`/api/get-room-id`, { headers: { Authorization: `Bearer ${accessToken}` } }),

    getUsername: (uid: string) =>
      fetch(`/api/get-username/${uid}`, { headers: { Authorization: `Bearer ${accessToken}` } }),

    getAgoraAccessToken: (roomId: string, username: string) =>
      fetch(`/api/get-agora-access-token?roomId=${roomId}&username=${username}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    verifyRoomId: (roomId: string) =>
      fetch(`/api/verify-room-id/${roomId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),

    deleteUsername: (uid: string) =>
      fetch(`/api/delete-username/${uid}`, { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }),

    signUp: ({ email, username, password }: { email: string; username: string; password: string }) =>
      fetch("/api/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
        headers: { "Content-Type": "application/json" },
      }),

    logIn: ({ username, password }: { username: string; password: string }) =>
      fetch("/api/auth/log-in", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      }),
    getAccessToken: () => fetch(`/api/auth/get-access-token`),

    logOut: () => fetch("/api/auth/log-out"),
  };
}
