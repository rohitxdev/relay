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
  "setAccessToken",
  "setCanShareLink",
  "setCanShareScreen",
  "setCanUseRearCamera",
  "setCanCopyToClipboard",
  "resetAppState",
] as const;
type AppActions = typeof appActions[number];

interface RoomState {
  isVideoOn: boolean;
  isMicOn: boolean;
  isSharingScreen: boolean;
  facingMode: facingMode;
  floatClient: boolean;
}

interface AppState {
  error: string | null;
  roomId: string | null;
  username: string | null;
  accessToken: string | null;
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
