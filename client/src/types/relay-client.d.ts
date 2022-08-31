/// <reference types="vite/client" />

const roomActionType = [
  "TOGGLE_VIDEO",
  "TOGGLE_MIC",
  "TOGGLE_EXIT_MODAL",
  "TOGGLE_SCREENSHARE",
  "TOGGLE_FACING_MODE",
  "SET_SCREEN_UID",
] as const;

interface RoomState {
  isVideoOn: boolean;
  isMicOn: boolean;
  showExitModal: boolean;
  isSharingScreen: boolean;
  screenUid: string | null;
  facingMode: "user" | { exact: "environment" };
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
