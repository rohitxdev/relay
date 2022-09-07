import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientVideo, Controls, ExitModal, RemoteUsers, ScreenShare } from "@components";
import { RoomContextProvider } from "@context";
import { useAppContext, useRoomReducer } from "@utils/hooks";
import { api } from "@services";

export const Room = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useRoomReducer();
  const { error, setError } = useAppContext();
  const roomId = sessionStorage.getItem("roomId");
  const username = sessionStorage.getItem("username");
  const screenUsername = `${username}'s screen`;
  const [isChecked, setIsChecked] = useState(false);
  const { isVideoOn, isMicOn, isSharingScreen, facingMode, showExitModal } = state;
  const { current: client } = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));

  const enterRoom = async (roomId: string, username: string) => {
    try {
      const response = await api.getAccessToken(roomId, username);
      const { appId, uid, accessToken } = await response.json();
      await client.join(appId, roomId, accessToken, uid);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        dispatch({ type: "SET_ERROR", payload: err.message });
      }
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
    } catch (error) {
      console.info("📷 Rear camera is not available on this device.");
    } finally {
      setIsChecked(true);
    }
  };

  useEffect(() => {
    if (!isChecked) {
      checkDeviceCapabilities();
    }
    if (roomId && username && client.connectionState !== "CONNECTED") {
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
      {error && (
        <p className="error" role="error">
          {error}
        </p>
      )}
      {roomId && username && (
        <RoomContextProvider value={{ roomId, username, screenUsername, client, state, dispatch }}>
          {showExitModal && <ExitModal />}
          <div className={styles.room}>
            <div className={styles.userGrid}>
              {isSharingScreen && <ScreenShare />}
              <ClientVideo isVideoOn={isVideoOn} isMicOn={isMicOn} facingMode={facingMode} />
              <RemoteUsers />
            </div>
            <Controls />
          </div>
        </RoomContextProvider>
      )}
    </>
  );
};
