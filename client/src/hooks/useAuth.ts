import { api } from "@helpers";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "./useAppContext";

export function useAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(sessionStorage.getItem("access-token"));
  const tokenExpirationTimeInMs = useRef(0);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("is-logged-in") === "true" ? true : false);

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
      tokenExpirationTimeInMs.current = Number(expiryTime);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    getAccessToken();
    const intervalId = setInterval(getAccessToken, tokenExpirationTimeInMs.current);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("is-logged-in", `${isLoggedIn}`);
  }, [isLoggedIn]);

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem("access-token", accessToken);
    }
  }, [accessToken]);

  return { isLoggedIn, setIsLoggedIn };
}
