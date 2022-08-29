import { createSlice } from "@reduxjs/toolkit";

export interface RoomState {
  isVideoOn: boolean;
  isMicOn: boolean;
  showExitModal: boolean;
  isSharingScreen: boolean;
  facingMode: "user" | "environment";
}

const roomSlice = createSlice({
  name: "room",
  initialState: {
    isVideoOn: false,
    isMicOn: false,
    showExitModal: false,
    isSharingScreen: false,
    facingMode: "user",
  } as RoomState,
  reducers: {
    toggleVideo: (state) => {
      state.isVideoOn = !state.isVideoOn;
    },
    toggleMic: (state) => {
      state.isMicOn = !state.isMicOn;
    },
    toggleExitModal: (state) => {
      state.showExitModal = !state.showExitModal;
    },
    toggleScreenShare: (state) => {
      state.isSharingScreen = !state.isSharingScreen;
    },
    toggleFacingMode: (state) => {
      state.facingMode = state.facingMode === "user" ? "environment" : "user";
    },
  },
});
export const {
  reducer: room,
  actions: { toggleExitModal, toggleFacingMode, toggleMic, toggleScreenShare, toggleVideo },
} = roomSlice;
