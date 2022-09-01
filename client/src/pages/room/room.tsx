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
  const { isVideoOn, isMicOn, isSharingScreen, facingMode } = state;
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const username = sessionStorage.getItem("username");
  const screenUsername = `${username}'s screen`;
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

  const escapeListener = (e: globalThis.KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({ type: "TOGGLE_EXIT_MODAL" });
    }
  };

  useEffect(() => {
    if (roomId && username) {
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
    <RoomContextProvider value={{ roomId, username, screenUsername, client: client }}>
      <div className={styles.room}>
        <div className={styles.userGrid}>
          {isSharingScreen && <ScreenShare dispatch={dispatch} />}
          <ClientVideo isVideoOn={isVideoOn} isMicOn={isMicOn} facingMode={facingMode} />
          <RemoteUsers />
        </div>
        <Controls state={state} dispatch={dispatch} />
      </div>
    </RoomContextProvider>
  );
};
