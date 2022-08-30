interface RoomState {
  isVideoOn: boolean;
  isMicOn: boolean;
  showExitModal: boolean;
  isSharingScreen: boolean;
  isScreenShareAvailable: boolean;
  isRearCameraAvailable: boolean;
  facingMode: "user" | "environment";
}
interface RoomAction {
  type: keyof typeof roomActionType;
  payload?: any;
}
const roomActionType = {
  TOGGLE_VIDEO: "TOGGLE_VIDEO",
  TOGGLE_MIC: "TOGGLE_MIC",
  TOGGLE_EXIT_MODAL: "TOGGLE_EXIT_MODAL",
  TOGGLE_SCREENSHARE: "TOGGLE_SCREENSHARE",
  TOGGLE_FACING_MODE: "TOGGLE_FACING_MODE",
  SET_SCREENSHARE_AVAILABILITY: "SET_SCREENSHARE_AVAILABILITY",
  SET_REAR_CAMERA_AVAILABILITY: "SET_REAR_CAMERA_AVAILABILITY",
};
