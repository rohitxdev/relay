import { useReducer } from "react";

export const useRoomReducer = () => {
  const initialState: RoomState = {
    isVideoOn: false,
    isMicOn: false,
    showExitModal: false,
    isSharingScreen: false,
    isRearCameraAvailable: false,
    isScreenshareAvailable: false,
    facingMode: "user",
  };

  const reducer = (state: RoomState, action: RoomAction): RoomState => {
    switch (action.type) {
      case "TOGGLE_VIDEO":
        return { ...state, isVideoOn: !state.isVideoOn };
      case "TOGGLE_MIC":
        return { ...state, isMicOn: !state.isMicOn };
      case "TOGGLE_SCREENSHARE":
        return { ...state, isSharingScreen: !state.isSharingScreen };
      case "TOGGLE_EXIT_MODAL":
        return { ...state, showExitModal: !state.showExitModal };
      case "SET_SCREENSHARE_AVAILABILITY":
        return { ...state, isScreenshareAvailable: action.payload };
      case "SET_REAR_CAMERA_AVAILABILITY":
        return { ...state, isRearCameraAvailable: action.payload };
      case "TOGGLE_FACING_MODE":
        return {
          ...state,
          facingMode: state.facingMode === "user" ? "environment" : "user",
        };
      default:
        return state;
    }
  };

  return useReducer(reducer, initialState);
};
