import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { ClientUser, Controls, LiveChat, RemoteUsers, ScreenShare } from "@components";
import { useAppContext, useError, useRoomContext, useViewportSize } from "@hooks";
import { useNavigate } from "react-router-dom";
import { api } from "@helpers";
import ChatIcon from "@assets/icons/chat.svg";

export const Room = () => {
  const navigate = useNavigate();
  const { setError } = useError();
  const { vh, vw } = useViewportSize();
  const [showLiveChat, setShowLiveChat] = useState(false);

  const {
    appState: { roomId, username },
  } = useAppContext();
  const {
    roomState: { facingMode, isMicOn, isVideoOn, isSharingScreen, floatClient, showNotification },
  } = useRoomContext();

  const client = useMemo(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }), []);

  const enterRoom = async () => {
    try {
      if (roomId && username) {
        const response = await api.getAgoraAccessToken(roomId, username, "a");
        const { appId, uid, accessToken } = await response.json();
        await client.join(appId, roomId, accessToken, uid);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      }
    }
  };

  const toggleLiveChatVisibility = () => {
    setShowLiveChat((state) => !state);
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
            <div></div>
            <div className={styles.roomId}>
              <p>room id</p>
              <h1 onClick={() => navigator.clipboard.writeText(roomId)}>{roomId}</h1>
            </div>
            <button
              className={[styles.chatBtn, showNotification && styles.showNotification].join(" ")}
              onClick={toggleLiveChatVisibility}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            </button>
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
          <LiveChat roomId={roomId} username={username} showLiveChat={showLiveChat} setShowLiveChat={setShowLiveChat} />
        </div>
      )}
    </>
  );
};
