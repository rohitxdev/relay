import { api } from "@services";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import styles from "./screen-share.module.scss";
import EnterFullscreenIcon from "@assets/icons/enter-fullscreen.svg";
import ExitFullscreenIcon from "@assets/icons/exit-fullscreen.svg";
import { useToggleFullscreen } from "@utils/hooks";

export const ScreenShare = ({ dispatch }: { dispatch: React.Dispatch<RoomAction> }) => {
  const { roomId, screenUsername } = useRoomContext();
  const screenRef = useRef<HTMLDivElement | null>(null);
  const screenClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [screenVideoTrack, setScreenVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const { isFullscreen, toggleFullscreen } = useToggleFullscreen(screenRef.current);

  const joinRoomAsUser = async () => {
    const response = await api.getAccessToken(roomId, screenUsername);
    const { appId, uid, accessToken } = await response.json();
    if (screenClient.current.connectionState !== "CONNECTED") {
      await screenClient.current.join(appId, roomId, accessToken, uid);
    }
  };

  const acquireTracks = async () => {
    try {
      const mediaTracks = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
      });
      const videoTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: mediaTracks.getVideoTracks()[0],
        optimizationMode: "detail",
      });
      setScreenVideoTrack(videoTrack);
      joinRoomAsUser();
    } catch (error) {
      console.warn(error);
      dispatch({ type: "TOGGLE_SCREENSHARE" });
    }
  };

  useEffect(() => {
    if (screenVideoTrack && screenClient.current.connectionState === "CONNECTED") {
      screenClient.current.publish(screenVideoTrack).then(() => {
        if (screenRef.current && !screenVideoTrack.isPlaying) {
          screenVideoTrack.play(screenRef.current);
        }
      });
    }
    return () => {
      if (screenVideoTrack) {
        screenClient.current.unpublish(screenVideoTrack);
      }
    };
  }, [screenVideoTrack]);

  useEffect(() => {
    if (!screenVideoTrack && screenClient.current.connectionState !== "CONNECTED") {
      acquireTracks();
    }
    return () => {
      screenVideoTrack?.close();
      screenClient.current.leave();
    };
  }, []);

  return (
    <>
      {screenVideoTrack && (
        <div className={styles.screenShare} ref={screenRef}>
          <p className={styles.screenUsername}>Your screen</p>
          <button className="fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
          </button>
        </div>
      )}
    </>
  );
};
