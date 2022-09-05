import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientVideo, Controls, ExitModal, RemoteUsers, ScreenShare } from "@components";
import { RoomContextProvider } from "@context";
import { useRoomReducer } from "@utils/hooks";
import { api } from "@services";

export const Room = () => {
  const [state, dispatch] = useRoomReducer();
  const { isVideoOn, isMicOn, isSharingScreen, facingMode, showExitModal } = state;
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const username = sessionStorage.getItem("username");
  const screenUsername = `${username}'s screen`;
  const { current: client } = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [isChecked, setIsChecked] = useState(false);

  const enterRoom = async (roomId: string, username: string) => {
    const response = await api.getAccessToken(roomId, username);
    const { appId, uid, accessToken } = await response.json();
    if (client.connectionState === "DISCONNECTED") {
      await client.join(appId, roomId, accessToken, uid);
    }
  };

  const escapeHandler = (e: globalThis.KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({ type: "TOGGLE_EXIT_MODAL" });
    }
  };

  const checkDeviceCapabilities = async () => {
    if ("getDisplayMedia" in navigator.mediaDevices) {
      dispatch({ type: "SET_SCREENSHARE_AVAILABILITY", payload: true });
    } else {
      console.info("💻 Screensharing is not available on this device.");
    }
    try {
      const tracks = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
        audio: false,
      });
      tracks.getVideoTracks().forEach((track) => {
        track.stop();
      });
      dispatch({ type: "SET_REAR_CAMERA_AVAILABILITY", payload: true });
      setIsChecked(true);
    } catch (error) {
      console.info("📷 Rear camera is not available on this device.");
    }
  };

  if (!isChecked) {
    checkDeviceCapabilities();
  }

  useEffect(() => {
    if (roomId && username) {
      enterRoom(roomId, username);
    } else {
      navigate("/", { replace: true });
    }
    window.addEventListener("keydown", escapeHandler);

    return () => {
      if (client.connectionState === "CONNECTED") {
        client.leave();
      }
      window.removeEventListener("keydown", escapeHandler);
    };
  }, []);

  return (
    <>
      {roomId && username && (
        <RoomContextProvider value={{ roomId, username, screenUsername, client }}>
          <div className={styles.room}>
            {showExitModal && <ExitModal dispatch={dispatch} />}
            <div className={styles.userGrid}>
              {isSharingScreen && <ScreenShare dispatch={dispatch} />}
              <ClientVideo isVideoOn={isVideoOn} isMicOn={isMicOn} facingMode={facingMode} />
              <RemoteUsers />
            </div>
            <Controls state={state} dispatch={dispatch} />
          </div>
        </RoomContextProvider>
      )}
    </>
  );
};
