import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClientVideo, Controls, ExitModal, RemoteUsers, ScreenShare } from "@components";
import { RoomContextProvider } from "@context";
import { fetchData } from "../../utils/helpers/fetchData";
import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";

export const Room = () => {
  const initialState: RoomState = {
    isVideoOn: false,
    isMicOn: false,
    showExitModal: false,
    isSharingScreen: false,
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
      case "TOGGLE_FACING_MODE":
        return { ...state, facingMode: state.facingMode === "user" ? "environment" : "user" };
      default:
        throw new Error("INVALID ACTION");
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isVideoOn, isMicOn, isSharingScreen, showExitModal, facingMode } = state;
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const username = sessionStorage.getItem("username");
  const screenUsername = `${username}'s screen`;
  const clientRef = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp9" }));

  const enterRoom = async (roomId: string, username: string) => {
    const response = await fetchData(`/api/get-access-token?roomId=${roomId}&username=${username}`);
    const { appId, uid, accessToken } = await response.json();
    await clientRef.current.join(appId, roomId, accessToken, uid);
  };

  useEffect(() => {
    if (roomId && username) {
      enterRoom(roomId, username);
    } else {
      navigate("/", { replace: true });
    }

    return () => {
      clientRef.current.leave();
    };
  }, []);

  return (
    <>
      {roomId && username && (
        <RoomContextProvider
          value={{ roomId, username, screenUsername, client: clientRef.current }}
        >
          <div className={styles.room}>
            {showExitModal && <ExitModal roomDispatch={dispatch} />}
            <div className={styles.userGrid}>
              <ClientVideo isVideoOn={isVideoOn} isMicOn={isMicOn} facingMode={facingMode} />
              {isSharingScreen && <ScreenShare />}
              <RemoteUsers />
            </div>
            <Controls roomState={state} roomDispatch={dispatch} />
          </div>
        </RoomContextProvider>
      )}
    </>
  );
};
