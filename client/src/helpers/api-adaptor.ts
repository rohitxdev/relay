export const api = {
  getRoomID: (accessToken: string) =>
    fetch(`/api/get-room-id`, { headers: { Authorization: `Bearer ${accessToken}` } }),

  getUsername: (uid: string, accessToken: string) =>
    fetch(`/api/get-username/${uid}`, { headers: { Authorization: `Bearer ${accessToken}` } }),

  getAgoraAccessToken: (roomId: string, username: string, accessToken: string) =>
    fetch(`/api/get-agora-access-token?roomId=${roomId}&username=${username}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  verifyRoomId: (roomId: string, accessToken: string) =>
    fetch(`/api/verify-room-id/${roomId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),

  deleteUsername: (uid: string, accessToken: string) =>
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

  changeUsername: (newUsername: string, accessToken: string) =>
    fetch("/api/change-username", {
      method: "PUT",
      body: JSON.stringify({ newUsername }),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    }),

  changePassword: (currentPassword: string, newPassword: string, accessToken: string) =>
    fetch("/api/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    }),

  logOut: () => fetch("/api/auth/log-out"),
};
