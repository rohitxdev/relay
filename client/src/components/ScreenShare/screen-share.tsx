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
  const screenUsername = `${username}' screen`;

  const shareScreen = async () => {
    const response = await api.getAccessToken(roomId, screenUsername);
    const { appId, uid, accessToken } = await response.json();
    if (screenRef.current) {
      dispatch({ type: "SET_SCREEN_UID", payload: uid });
      await screenClient.join(appId, roomId, accessToken, uid);
      if (/firefox/gi.test(navigator.userAgent)) {
        screenVideoRef.current = (await AgoraRTC.createScreenVideoTrack({
          encoderConfig: "1080p_2",
          screenSourceType: "screen",
        })) as ILocalVideoTrack;
      } else {
        screenVideoRef.current = (await AgoraRTC.createScreenVideoTrack({
          encoderConfig: "1080p_2",
        })) as ILocalVideoTrack;
      }
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
