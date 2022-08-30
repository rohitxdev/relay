import { api } from "@services";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import AgoraRTC, { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef } from "react";
import styles from "./screen-share.module.scss";

export const ScreenShare = () => {
  const { roomId, screenUsername } = useRoomContext();
  const screenRef = useRef<HTMLDivElement | null>(null);
  const screenVideoRef = useRef<ILocalVideoTrack | null>(null);
  const screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });

  const shareScreen = async () => {
    const response = await api.getAccessToken(roomId, screenUsername);
    const { appId, uid, accessToken } = await response.json();
    if (screenRef.current) {
      await screenClient.join(appId, roomId, accessToken, uid);
      screenVideoRef.current = (await AgoraRTC.createScreenVideoTrack({
        encoderConfig: "1080p_2",
      })) as ILocalVideoTrack;
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

  return <div className={styles.screenShare} ref={screenRef}></div>;
};
