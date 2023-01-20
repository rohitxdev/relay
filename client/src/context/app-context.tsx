import { createContext, ReactNode, useEffect, useReducer } from "react";

const initialAppState: AppState = {
  error: null,
  roomId: null,
  username: null,
  canShareLink: false,
  canShareScreen: false,
  canUseRearCamera: false,
  canCopyToClipboard: false,
};

const getAppSessionState = (): AppState => {
  const appSessionState = sessionStorage.getItem("app_state");
  if (!appSessionState) {
    return initialAppState;
  }
  Object.keys(JSON.parse(appSessionState)).forEach((key) => {
    if (!(key in initialAppState)) {
      throw new Error("Corrupted app session state.");
    }
  });
  return JSON.parse(appSessionState);
};

const appReducer = (state: AppState, action: { type: AppActions; payload?: unknown }): AppState => {
  const { type, payload } = action;

  switch (type) {
    case "setError":
      if (payload !== null && typeof payload !== "string") {
        throw new Error("Invalid payload type.");
      }
      return { ...state, error: payload };
    case "setRoomId":
      if (payload !== null && typeof payload !== "string") {
        throw new Error("Invalid payload type.");
      }
      return { ...state, roomId: payload };
    case "setUsername":
      if (typeof payload !== "string" && payload !== null) {
        throw new Error("Invalid payload type.");
      }
      return { ...state, username: payload };
    case "setCanShareLink":
      if (typeof payload !== "boolean") {
        throw new Error("Invalid payload type.");
      }
      return { ...state, canShareLink: payload };
    case "setCanShareScreen":
      if (typeof payload !== "boolean") {
        throw new Error("Invalid payload type.");
      }
      return { ...state, canShareScreen: payload };
    case "setCanUseRearCamera":
      if (typeof payload !== "boolean") {
        throw new Error("Invalid payload type.");
      }
      return { ...state, canUseRearCamera: payload };
    case "setCanCopyToClipboard":
      if (typeof payload !== "boolean") {
        throw new Error("Invalid payload type.");
      }
      return { ...state, canCopyToClipboard: payload };
    case "resetAppState":
      return initialAppState;
    default:
      throw new Error("Invalid app action.");
  }
};

export const AppContext = createContext<AppContext | null>(null);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [appState, appDispatch] = useReducer(appReducer, getAppSessionState());

  useEffect(() => {
    sessionStorage.setItem("app_state", JSON.stringify(appState));
  }, [appState]);

  return <AppContext.Provider value={{ appState, appDispatch }}>{children}</AppContext.Provider>;
};
