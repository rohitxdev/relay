import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    isVideoOn: false,
    isMicOn: false,
    isSharingScreen: false,
    isRearCameraAvailable: false,
    isScreenSharingAvailable: false,
    facingMode: "user",
    error: null,
  } as RoomState,
  reducers: {
    toggleVideo: (state) => {
      state.isVideoOn = !state.isVideoOn;
    },
    toggleMic: (state) => {
      state.isMicOn = !state.isMicOn;
    },
    toggleScreenShare: (state) => {
      state.isSharingScreen = !state.isSharingScreen;
    },
    toggleFacingMode: (state) => {
      state.facingMode = state.facingMode === "user" ? "environment" : "user";
    },
    rearCameraIsAvailable: (state) => {
      state.isRearCameraAvailable = true;
    },
    screenSharingIsAvailable: (state) => {
      state.isScreenSharingAvailable = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  reducer: room,
  actions: {
    toggleVideo,
    toggleMic,
    toggleScreenShare,
    toggleFacingMode,
    rearCameraIsAvailable,
    screenSharingIsAvailable,
    setError,
  },
} = roomSlice;
