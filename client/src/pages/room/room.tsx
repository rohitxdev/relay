import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
import React, { CSSProperties, useEffect, useMemo } from "react";
import { ClientUser, Controls, LiveChat, RemoteUsers, ScreenShare } from "@components";
import { useAppContext, useError, useRoomContext, useViewportSize } from "@hooks";
import { useNavigate } from "react-router-dom";
import { api } from "@helpers";

export const Room = () => {
  const navigate = useNavigate();
  const { setErrorMessage } = useError();
  const { vh, vw } = useViewportSize();
  const {
    appState: { roomId, username },
  } = useAppContext();
  const {
    roomState: { facingMode, isMicOn, isVideoOn, isSharingScreen, floatClient },
    roomDispatch,
  } = useRoomContext();

  const client = useMemo(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }), []);

  const enterRoom = async () => {
    try {
      if (roomId && username) {
        const response = await api.getAgoraAccessToken(roomId, username);
        const { appId, uid, accessToken } = await response.json();
        await client.join(appId, roomId, accessToken, uid);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setErrorMessage(err.message);
      }
    }
  };

  useEffect(() => {
    if (!(roomId && username)) {
      navigate("/", { state: "Room ID or username not provided." });
    }

    if (client.connectionState !== "CONNECTED" && client.connectionState !== "CONNECTING") {
      enterRoom();
    }
    return () => {
      client.leave();
    };
  }, []);

  return (
    <>
      {roomId && username && (
        <div className={styles.room} style={{ "--vh": vh + "px", "--vw": vw + "px" } as CSSProperties}>
          <div className={styles.options}>
            <div className={styles.roomId}>
              <p>room id</p>
              <h1 onClick={() => navigator.clipboard.writeText(roomId)}>{roomId}</h1>
            </div>
          </div>
          <div className={[styles.userGrid, floatClient && styles.floatingClient].join(" ")}>
            {isSharingScreen && <ScreenShare />}
            <ClientUser
              isVideoOn={isVideoOn ?? false}
              isMicOn={isMicOn ?? false}
              facingMode={facingMode ?? "user"}
              client={client}
            />
            <RemoteUsers client={client} />
          </div>
          <Controls />
          <LiveChat roomId={roomId} username={username} />
        </div>
      )}
    </>
  );
};
