/// <reference types="vite/client" />

type facingMode = "user" | "environment";
type error = string | null;

interface RoomState {
  isVideoOn: boolean;
  isMicOn: boolean;
  isSharingScreen: boolean;
  isRearCameraAvailable: boolean;
  isScreenSharingAvailable: boolean;
  facingMode: facingMode;
  floatClient: boolean;
  error: error;
}
