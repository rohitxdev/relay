import { api } from "@services";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import AgoraRTC, { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef } from "react";
import styles from "./screen-share.module.scss";

export const ScreenShare = ({ dispatch }: { dispatch: React.Dispatch<RoomAction> }) => {
  const { roomId, username } = useRoomContext();
  const screenRef = useRef<HTMLDivElement | null>(null);
  const screenVideoRef = useRef<ILocalVideoTrack | null>(null);
  const screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
  const screenUsername = `${username}'s screen`;

  const shareScreen = async () => {
    const response = await api.getAccessToken(roomId, screenUsername);
    const { appId, uid, accessToken } = await response.json();
    if (screenRef.current) {
      dispatch({ type: "SET_SCREEN_UID", payload: uid });
      await screenClient.join(appId, roomId, accessToken, uid);
      const mediaTracks = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const screenVideoTrack = mediaTracks.getVideoTracks()[0];
      screenVideoRef.current = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: screenVideoTrack,
        optimizationMode: "detail",
      });
      screenVideoRef.current.play(screenRef.current);
      await screenClient.publish(screenVideoRef.current);
    }
  };

  const cleanUp = async () => {
    if (screenVideoRef.current) {
      screenVideoRef.current.close();
    }
    await screenClient.leave();
  };

  useEffect(() => {
    shareScreen();
    return () => {
      cleanUp();
    };
  }, []);

  return (
    <div className={styles.screenShare} ref={screenRef}>
      <p className={styles.screenUsername}>Your screen</p>
    </div>
  );
};
