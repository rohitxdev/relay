class ApiAdaptor {
  async #apiFetch(input: RequestInfo | URL, init?: RequestInit | undefined) {
    return fetch("/api" + input, init);
  }

  async getRoomID() {
    return this.#apiFetch(`/get-room-id`);
  }

  async getUsername(uid: string) {
    return this.#apiFetch(`/get-username/${uid}`);
  }

  async getAgoraAccessToken(roomId: string, username: string) {
    return this.#apiFetch(`/get-agora-access-token?roomId=${roomId}&username=${username}`);
  }

  async verifyRoomId(roomId: string) {
    return this.#apiFetch(`/verify-room-id/${roomId}`);
  }

  async deleteUsername(uid: string) {
    return this.#apiFetch(`/delete-username/${uid}`, { method: "DELETE" });
  }

  async getJWTAccessToken() {}
}

export const api = new ApiAdaptor();
