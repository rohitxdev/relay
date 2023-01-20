/// <reference types="vite/client" />

type facingMode = "user" | "environment";
type error = string | null;

const roomActions = [
  "toggleVideo",
  "toggleMic",
  "toggleScreenShare",
  "toggleFacingMode",
  "toggleFloatClient",
  "toggleNotification",
  "toggleLiveChat",
  "resetRoomState",
] as const;
type RoomActions = typeof roomActions[number];

const appActions = [
  "setError",
  "setRoomId",
  "setUsername",
  "setCanShareLink",
  "setCanShareScreen",
  "setCanUseRearCamera",
  "setCanCopyToClipboard",
  "resetAppState",
] as const;
type AppActions = typeof appActions[number];

const authActions = ["setAccessToken", "setIsLoggedIn"] as const;
type AuthActions = typeof authActions[number];

interface RoomState {
  isVideoOn: boolean;
  isMicOn: boolean;
  isSharingScreen: boolean;
  facingMode: facingMode;
  floatClient: boolean;
  showNotification: boolean;
}

interface AppState {
  error: string | null;
  roomId: string | null;
  username: string | null;
  canShareLink: boolean;
  canShareScreen: boolean;
  canUseRearCamera: boolean;
  canCopyToClipboard: boolean;
}

interface RoomContext {
  roomState: RoomState;
  roomDispatch: React.Dispatch<{
    type: RoomActions;
    payload?: unknown;
  }>;
}

interface AppContext {
  appState: AppState;
  appDispatch: React.Dispatch<{
    type: AppActions;
    payload?: unknown;
  }>;
}

interface ChatMessage {
  sender: string;
  type: "message" | "meta";
  data: string;
  time: string;
}

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
}

interface AuthContext {
  authState: AuthState;
  authDispatch: React.Dispatch<{
    type: AuthActions;
    payload?: unknown;
  }>;
}
