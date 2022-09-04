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
  const [isFullscreen, toggleFullscreen] = useToggleFullscreen(screenRef.current);
  const screenClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [isPublished, setIsPublished] = useState(false);
  const [screenVideoTrack, setScreenVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [screenAudioTrack, setScreenAudioTrack] = useState<ILocalAudioTrack | null>(null);

  const acquireTracks = async () => {
    try {
      const mediaTracks = await AgoraRTC.createScreenVideoTrack(
        { optimizationMode: "detail", encoderConfig: "1080p_2" },
        "auto"
      );
      if (Array.isArray(mediaTracks)) {
        setScreenVideoTrack(mediaTracks[0]);
        setScreenAudioTrack(mediaTracks[1]);
      } else {
        setScreenVideoTrack(mediaTracks);
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: "TOGGLE_SCREENSHARE" });
    }
  };

  useEffect(() => {
    acquireTracks();
    return () => {
      screenVideoTrack?.close();
      screenAudioTrack?.close();
      if (screenClient.current.connectionState === "CONNECTED") {
        screenClient.current.leave();
      }
    };
  }, []);

  const joinRoomAsUser = async () => {
    try {
      if (screenClient.current.connectionState !== "CONNECTED") {
        const response = await api.getAccessToken(roomId, screenUsername);
        const { appId, uid, accessToken } = await response.json();
        await screenClient.current.join(appId, roomId, accessToken, uid);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const publishTracks = async () => {
    try {
      if (screenVideoTrack) {
        await screenClient.current.publish(screenVideoTrack);
        if (screenRef.current && !screenVideoTrack.isPlaying) {
          screenVideoTrack.play(screenRef.current);
        }
      }
      if (screenAudioTrack) {
        await screenClient.current.publish(screenAudioTrack);
      }
      setIsPublished(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (screenVideoTrack && !isPublished) {
      joinRoomAsUser().then(publishTracks);
    }
  }, [screenVideoTrack]);

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
