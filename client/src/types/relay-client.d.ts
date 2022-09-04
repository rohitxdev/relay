/// <reference types="vite/client" />

const roomActionType = [
  "TOGGLE_VIDEO",
  "TOGGLE_MIC",
  "TOGGLE_EXIT_MODAL",
  "TOGGLE_SCREENSHARE",
  "SET_SCREENSHARE_AVAILABILITY",
  "SET_REAR_CAMERA_AVAILABILITY",
  "TOGGLE_FACING_MODE",
] as const;

interface RoomState {
  isVideoOn: boolean;
  isMicOn: boolean;
  showExitModal: boolean;
  isSharingScreen: boolean;
  isRearCameraAvailable: boolean;
  isScreenshareAvailable: boolean;
  facingMode: "user" | "environment";
}
interface RoomAction {
  type: typeof roomActionType[number];
  payload?: any;
}

interface IRemoteUser {
  uid: UID;
  username: string;
  remoteVideoTrack?: IRemoteVideoTrack;
  remoteAudioTrack?: IRemoteAudioTrack;
}
