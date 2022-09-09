class ApiService {
  #SERVER_URL = import.meta.env.DEV ? import.meta.env.VITE_API_ENDPOINT : "";

  async #fetchApi(input: RequestInfo | URL, init?: RequestInit | undefined) {
    return fetch(this.#SERVER_URL + input, init);
  }

  async getRoomID() {
    return this.#fetchApi(`/api/get-room-id`);
  }

  async getUsername(uid: string) {
    return this.#fetchApi(`/api/get-username/${uid}`);
  }

  async getAccessToken(roomId: string, username: string) {
    return this.#fetchApi(`/api/get-access-token?roomId=${roomId}&username=${username}`);
  }

  async verifyRoomId(roomId: string) {
    return this.#fetchApi(`/api/verify-room-id/${roomId}`);
  }

  async deleteUsername(uid: string) {
    return this.#fetchApi(`/api/delete-username/${uid}`, { method: "DELETE" });
  }
}

export const api = new ApiService();
