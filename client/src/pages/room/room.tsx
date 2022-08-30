import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ClientVideo, Controls, ExitModal, RemoteUsers, ScreenShare } from "@components";
import { RoomContextProvider } from "@context";
import { useRoomReducer } from "@utils/hooks";
import { api } from "@services";

export const Room = () => {
  const [state, dispatch] = useRoomReducer();
  const { isVideoOn, isMicOn, isSharingScreen, showExitModal, facingMode } = state;
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const username = sessionStorage.getItem("username");
  const screenUsername = `${username}'s screen`;
  const clientRef = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp9" }));

  const enterRoom = async (roomId: string, username: string) => {
    const response = await api.getAccessToken(roomId, username);
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

  if (!(roomId && username)) {
    return <p>Error: No room ID or username found</p>;
  }

  return (
    <RoomContextProvider value={{ roomId, username, screenUsername, client: clientRef.current }}>
      <div className={styles.room}>
        {showExitModal && <ExitModal dispatch={dispatch} />}
        <div className={styles.userGrid}>
          {isSharingScreen && <ScreenShare />}
          <ClientVideo isVideoOn={isVideoOn} isMicOn={isMicOn} facingMode={facingMode} />
          <RemoteUsers />
        </div>
        <Controls state={state} dispatch={dispatch} />
      </div>
    </RoomContextProvider>
  );
};
