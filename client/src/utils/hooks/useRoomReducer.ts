import { useReducer } from "react";

export const useRoomReducer = () => {
  const initialState: RoomState = {
    isVideoOn: false,
    isMicOn: false,
    showExitModal: false,
    isSharingScreen: false,
    screenUid: null,
    facingMode: "user",
  };

  const reducer = (state: RoomState, action: RoomAction): RoomState => {
    const { type, payload } = action;
    switch (type) {
      case "TOGGLE_VIDEO":
        return { ...state, isVideoOn: !state.isVideoOn };
      case "TOGGLE_MIC":
        return { ...state, isMicOn: !state.isMicOn };
      case "TOGGLE_SCREENSHARE":
        return { ...state, isSharingScreen: !state.isSharingScreen };
      case "TOGGLE_EXIT_MODAL":
        return { ...state, showExitModal: !state.showExitModal };
      case "TOGGLE_FACING_MODE":
        return { ...state, facingMode: state.facingMode === "user" ? "environment" : "user" };
      case "SET_SCREEN_UID":
        return { ...state, screenUid: payload };
      default:
        return state;
    }
  };

  return useReducer(reducer, initialState);
};
