interface RoomState {
  isVideoOn: boolean;
  isMicOn: boolean;
  showExitModal: boolean;
  isSharingScreen: boolean;
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
};
