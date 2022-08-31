import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ClientVideo, Controls, RemoteUsers, ScreenShare } from "@components";
import { RoomContextProvider } from "@context";
import { useRoomReducer } from "@utils/hooks";
import { api } from "@services";

export const Room = () => {
  const [state, dispatch] = useRoomReducer();
  const { isVideoOn, isMicOn, isSharingScreen, facingMode, screenUid } = state;
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const username = sessionStorage.getItem("username");
  const { current: client } = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp9" }));

  const enterRoom = async (roomId: string, username: string) => {
    const response = await api.getAccessToken(roomId, username);
    const { appId, uid, accessToken } = await response.json();
    if (
      client.connectionState !== "CONNECTED" &&
      client.connectionState !== "CONNECTING" &&
      client.connectionState !== "RECONNECTING"
    ) {
      await client.join(appId, roomId, accessToken, uid);
    }
  };

  const checkForRearCamera = async () => {
    if (localStorage.getItem("rear-camera")) {
      dispatch({ type: "SET_REAR_CAMERA_AVAILABILITY", payload: true });
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
        });
        localStorage.setItem("rear-camera", "available");
        dispatch({ type: "SET_REAR_CAMERA_AVAILABILITY", payload: true });
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.name, error.message);
        }
      }
    }
  };

  const checkForScreenShare = () => {
    if ("getDisplayMedia" in navigator.mediaDevices) {
      dispatch({ type: "SET_SCREENSHARE_AVAILABILITY", payload: true });
    } else {
      console.warn("Screensharing is not available on this device.");
    }
  };

  const escapeListener = (e: globalThis.KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({ type: "TOGGLE_EXIT_MODAL" });
    }
  };

  useEffect(() => {
    if (roomId && username) {
      checkForScreenShare();
      checkForRearCamera();
      enterRoom(roomId, username);
    } else {
      navigate("/", { replace: true });
    }
    window.addEventListener("keydown", escapeListener);

    return () => {
      if (client.connectionState === "CONNECTED") {
        client.leave();
      }
      window.removeEventListener("keydown", escapeListener);
    };
  }, []);

  if (!(roomId && username)) {
    return <p>Error: No room ID or username found</p>;
  }

  return (
    <RoomContextProvider value={{ roomId, username, client: client }}>
      <div className={styles.room}>
        <div className={styles.userGrid}>
          {isSharingScreen && <ScreenShare dispatch={dispatch} />}
          <ClientVideo isVideoOn={isVideoOn} isMicOn={isMicOn} facingMode={facingMode} />
          <RemoteUsers screenUid={screenUid} />
        </div>
        <Controls state={state} dispatch={dispatch} />
      </div>
    </RoomContextProvider>
  );
};
