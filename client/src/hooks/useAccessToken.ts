import { useState } from "react";

export const useAccessToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAccessToken = async () => {
    const res = await fetch("/api/auth/refresh-access-token", { credentials: "same-origin" });
    if (res.ok) {
      const accessToken = await res.text();
      return setToken(accessToken);
    }
    if (res.status === 403) {
    }
  };
};
