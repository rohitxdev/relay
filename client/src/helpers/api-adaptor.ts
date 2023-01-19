export const api = {
  getRoomID: () => fetch(`/api/get-room-id`),

  getUsername: (uid: string) => fetch(`/api/get-username/${uid}`),

  getAgoraAccessToken: (roomId: string, username: string) =>
    fetch(`/api/get-agora-access-token?roomId=${roomId}&username=${username}`),
  verifyRoomId: (roomId: string) => fetch(`/api/verify-room-id/${roomId}`),

  deleteUsername: (uid: string) => fetch(`/api/delete-username/${uid}`, { method: "DELETE" }),

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
