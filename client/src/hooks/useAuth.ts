import { api } from "@helpers";
import { useEffect, useRef } from "react";
import { useAppContext } from "./useAppContext";

export function useAuth() {
  const tokenExpirationTimeInMs = useRef(0);
  const {
    appState: { accessToken },
    appDispatch,
  } = useAppContext();
  const getAccessToken = async () => {
    try {
      const res = await api.getAccessToken();
      if (!res.ok) {
        throw new Error("Could not get access token.");
      }
      const { accessToken, username, tokenExpirationTimeInMs: expiryTime } = await res.json();
      if (!(accessToken && username && tokenExpirationTimeInMs)) {
        throw new Error("Missing information in response object.");
      }
      appDispatch({ type: "setAccessToken", payload: accessToken });
      tokenExpirationTimeInMs.current = Number(expiryTime);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    getAccessToken();
    const intervalId = setInterval(getAccessToken, tokenExpirationTimeInMs.current);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("is-logged-in", `${accessToken}`);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem("access-token", accessToken);
    }
  }, [accessToken]);

  return { accessToken };
}
