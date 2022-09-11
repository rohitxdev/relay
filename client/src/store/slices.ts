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
    users: 0,
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
    incrementUsers: (state) => {
      state.users = state.users + 1;
    },
    decrementUsers: (state) => {
      state.users = state.users - 1;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetState: (state) => {
      return {
        isVideoOn: false,
        isMicOn: false,
        isSharingScreen: false,
        isRearCameraAvailable: false,
        isScreenSharingAvailable: false,
        facingMode: "user",
        users: 0,
        error: state.error,
      };
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
    incrementUsers,
    decrementUsers,
    setError,
    resetState,
  },
} = roomSlice;
