import { api } from "@services";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import styles from "./screen-share.module.scss";

export const ScreenShare = ({ dispatch }: { dispatch: React.Dispatch<RoomAction> }) => {
  const { roomId, screenUsername } = useRoomContext();
  const screenRef = useRef<HTMLDivElement | null>(null);
  const screenClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [screenVideoTrack, setScreenVideoTrack] = useState<ILocalVideoTrack | null>(null);

  const joinRoomAsUser = async () => {
    if (screenVideoTrack && screenRef.current) {
      const response = await api.getAccessToken(roomId, screenUsername);
      const { appId, uid, accessToken } = await response.json();
      await screenClient.current.join(appId, roomId, accessToken, uid);
      await screenClient.current.publish(screenVideoTrack);
      screenVideoTrack.play(screenRef.current);
    }
  };

  const acquireTracks = async () => {
    try {
      const mediaTracks = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 24 } },
        audio: false,
      });
      const videoTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: mediaTracks.getVideoTracks()[0],
        optimizationMode: "detail",
      });
      setScreenVideoTrack(videoTrack);
    } catch (error) {
      console.warn(error);
      dispatch({ type: "TOGGLE_SCREENSHARE" });
    }
  };

  useEffect(() => {
    joinRoomAsUser();
    return () => {
      screenClient.current.leave();
    };
  }, [screenVideoTrack]);

  useEffect(() => {
    if (!screenVideoTrack) {
      acquireTracks();
    }
  }, []);

  return (
    <>
      {screenVideoTrack && (
        <div className={styles.screenShare} ref={screenRef}>
          <p className={styles.screenUsername}>Your screen</p>
        </div>
      )}
    </>
  );
};
