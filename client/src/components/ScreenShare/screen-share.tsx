import styles from "./screen-share.module.scss";
import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import { useToggleFullscreen, useRoomContext, useAppDispatch, useError } from "@utils/hooks";
import EnterFullscreenIcon from "@assets/icons/enter-fullscreen.svg";
import ExitFullscreenIcon from "@assets/icons/exit-fullscreen.svg";
import { toggleScreenShare } from "@store";
import { api } from "@services";

export const ScreenShare = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useError();
  const { roomId, screenUsername } = useRoomContext();
  const screenVideoRef = useRef<HTMLDivElement | null>(null);
  const screenClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [isPublished, setIsPublished] = useState(false);
  const [screenVideoTrack, setScreenVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [screenAudioTrack, setScreenAudioTrack] = useState<ILocalAudioTrack | null>(null);
  const [isFullscreen, toggleFullscreen] = useToggleFullscreen(screenVideoRef.current);

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
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
        dispatch(toggleScreenShare());
      }
    }
  };

  const joinRoomAsUser = async () => {
    if (screenClient.current.connectionState !== "CONNECTED") {
      const response = await api.getAccessToken(roomId, screenUsername);
      const { appId, uid, accessToken } = await response.json();
      await screenClient.current.join(appId, roomId, accessToken, uid);
    }
  };

  const publishTracks = async () => {
    if (screenVideoTrack) {
      await screenClient.current.publish(screenVideoTrack);
    }
    if (screenAudioTrack) {
      await screenClient.current.publish(screenAudioTrack);
    }
    setIsPublished(true);
  };

  const playVideoTrack = () => {
    if (screenVideoTrack && screenVideoRef.current) {
      screenVideoTrack.play(screenVideoRef.current);
    }
  };

  const shareScreen = async () => {
    try {
      await joinRoomAsUser();
      await publishTracks();
      playVideoTrack();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    acquireTracks();

    return () => {
      if (screenClient.current.connectionState === "CONNECTED") {
        screenClient.current.leave();
      }
      if (screenVideoTrack) {
        screenVideoTrack.close();
      }
      if (screenAudioTrack) {
        screenAudioTrack.close();
      }
    };
  }, []);

  useEffect(() => {
    if (screenVideoTrack && !isPublished) {
      shareScreen();
    }
  }, [screenVideoTrack]);

  return (
    <>
      {screenVideoTrack && (
        <div className={styles.screenShare} ref={screenVideoRef}>
          <p className={styles.screenUsername}>Your screen</p>
          <button
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="fullscreen-btn"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
          </button>
        </div>
      )}
    </>
  );
};
