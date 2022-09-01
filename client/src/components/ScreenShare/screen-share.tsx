import { api } from "@services";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import AgoraRTC, { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import styles from "./screen-share.module.scss";

export const ScreenShare = ({ dispatch }: { dispatch: React.Dispatch<RoomAction> }) => {
  const { roomId, screenUsername } = useRoomContext();
  const screenRef = useRef<HTMLDivElement | null>(null);
  const screenVideoRef = useRef<ILocalVideoTrack | null>(null);
  const screenClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp9" }));
  const [isTrackAcquired, setIsTrackAcquired] = useState(false);

  const acquireTrack = async () => {
    try {
      const mediaTracks = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 24 },
        audio: true,
      });
      const screenVideoTrack = mediaTracks.getVideoTracks()[0];
      screenVideoRef.current = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: screenVideoTrack,
        optimizationMode: "detail",
        bitrateMin: 1024,
      });
      setIsTrackAcquired(true);
    } catch (error) {
      dispatch({ type: "TOGGLE_SCREENSHARE" });
    }
  };

  const shareScreen = async () => {
    try {
      if (
        screenRef.current &&
        screenVideoRef.current &&
        screenClient.current.connectionState !== "CONNECTED"
      ) {
        const response = await api.getAccessToken(roomId, screenUsername);
        const { appId, uid, accessToken } = await response.json();
        // dispatch({ type: "SET_SCREEN_UID", payload: uid });
        await screenClient.current.join(appId, roomId, accessToken, uid);
        screenClient.current.publish(screenVideoRef.current);
        screenVideoRef.current.play(screenRef.current);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cleanUp = async () => {
    if (screenVideoRef.current) {
      screenVideoRef.current.close();
    }
    await screenClient.current.leave();
  };

  useEffect(() => {
    if (!isTrackAcquired) {
      acquireTrack();
    }
    if (isTrackAcquired) {
      shareScreen();
    }

    return () => {
      cleanUp();
    };
  }, [isTrackAcquired]);

  return (
    <>
      {isTrackAcquired && (
        <div className={styles.screenShare} ref={screenRef}>
          <p className={styles.screenUsername}>Your screen</p>
        </div>
      )}
    </>
  );
};
