import { createSlice } from "@reduxjs/toolkit";

const initialState: RoomState = {
  isVideoOn: false,
  isMicOn: false,
  isSharingScreen: false,
  isRearCameraAvailable: false,
  isScreenSharingAvailable: false,
  facingMode: "user",
  floatClient: false,
  error: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
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
    setFloatClient: (state, action) => {
      state.floatClient = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetState: (state) => {
      return { ...initialState, error: state.error };
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
    setFloatClient,
    setError,
    resetState,
  },
} = roomSlice;
