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
  error: error;
}

interface IRemoteUser {
  uid: UID;
  username: string;
  remoteVideoTrack?: IRemoteVideoTrack;
  remoteAudioTrack?: IRemoteAudioTrack;
}
