import { createContext, ReactNode, useEffect, useReducer, useRef } from "react";
import { api } from "@helpers";
import { useAppContext } from "../hooks";

export const AuthContext = createContext<AuthContext | null>(null);

const initialAuthState: AuthState = {
  accessToken: null,
  isLoggedIn: localStorage.getItem("is_logged_in") === "true" ? true : false,
};

const authReducer = (state: AuthState, action: { type: AuthActions; payload?: unknown }): AuthState => {
  const { type, payload } = action;

  switch (type) {
    case "setAccessToken":
      if (typeof payload !== "string" && payload !== null) {
        throw new Error("Invalid payload type.");
      }
      return { ...state, accessToken: payload };
    case "setIsLoggedIn":
      if (typeof payload !== "boolean") {
        throw new Error("Invalid payload type.");
      }
      return { ...state, isLoggedIn: payload };
    default:
      throw new Error("Invalid auth action.");
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { appDispatch } = useAppContext();
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const { accessToken, isLoggedIn } = authState;
  const timerId = useRef<number | null>(null);
  const logInAttempts = useRef(0);

  const getAccessToken = async () => {
    try {
      const res = await api.getAccessToken();
      if (!res.ok) {
        if (logInAttempts.current > 5) {
          throw new Error("Could not get access token.");
        }
        logInAttempts.current++;
        window.setTimeout(getAccessToken, 3000);
      }
      if (res.status === 401) {
        authDispatch({ type: "setIsLoggedIn", payload: false });
        throw new Error("Login session has expired.");
      }
      if (res.status === 403) {
        authDispatch({ type: "setIsLoggedIn", payload: false });
        throw new Error("User is not logged in.");
      }
      const { accessToken, username, tokenExpiryTimeInMs } = await res.json();

      if (!(accessToken && username && tokenExpiryTimeInMs)) {
        throw new Error("Missing information in response object.");
      }

      authDispatch({ type: "setAccessToken", payload: accessToken });
      appDispatch({ type: "setUsername", payload: username });
      timerId.current = window.setTimeout(() => {
        getAccessToken();
      }, tokenExpiryTimeInMs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    localStorage.setItem("is_logged_in", `${isLoggedIn}`);

    if (isLoggedIn) {
      getAccessToken();
    } else {
      authDispatch({ type: "setAccessToken", payload: null });
    }

    return () => {
      if (timerId.current) {
        window.clearTimeout(timerId.current);
      }
    };
  }, [isLoggedIn]);

  return <AuthContext.Provider value={{ authState, authDispatch }}>{children}</AuthContext.Provider>;
};
