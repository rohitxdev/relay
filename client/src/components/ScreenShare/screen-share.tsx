import styles from "./screen-share.module.scss";
import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import { useToggleFullscreen, useRoomContext, useAppContext } from "@utils/hooks";
import EnterFullscreenIcon from "@assets/icons/enter-fullscreen.svg";
import ExitFullscreenIcon from "@assets/icons/exit-fullscreen.svg";
import { api } from "@services";

export const ScreenShare = () => {
  const { roomId, screenUsername, dispatch } = useRoomContext();
  const { setError } = useAppContext();
  const screenVideoRef = useRef<HTMLDivElement | null>(null);
  const screenClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const mediaTracksRef = useRef<ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [screenVideoTrack, setScreenVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [screenAudioTrack, setScreenAudioTrack] = useState<ILocalAudioTrack | null>(null);
  const [isFullscreen, toggleFullscreen] = useToggleFullscreen(screenVideoRef.current);

  const acquireTracks = async () => {
    try {
      mediaTracksRef.current = await AgoraRTC.createScreenVideoTrack(
        { optimizationMode: "detail", encoderConfig: "1080p_2" },
        "auto"
      );
      if (Array.isArray(mediaTracksRef.current)) {
        setScreenVideoTrack(mediaTracksRef.current[0]);
        setScreenAudioTrack(mediaTracksRef.current[1]);
      } else {
        setScreenVideoTrack(mediaTracksRef.current);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
      dispatch({ type: "TOGGLE_SCREENSHARE" });
    }
  };

  const joinRoomAsUser = async () => {
    try {
      const response = await api.getAccessToken(roomId, screenUsername);
      const { appId, uid, accessToken } = await response.json();
      await screenClient.current.join(appId, roomId, accessToken, uid);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
    }
  };

  const publishTracks = async () => {
    try {
      if (screenVideoTrack) {
        await screenClient.current.publish(screenVideoTrack);
      }
      if (screenAudioTrack) {
        await screenClient.current.publish(screenAudioTrack);
      }
      setIsPublished(true);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
    }
  };

  const playVideoTrack = () => {
    if (screenVideoTrack && screenVideoRef.current && !screenVideoTrack.isPlaying) {
      screenVideoTrack.play(screenVideoRef.current);
    }
  };

  const cleanUpTracks = () => {
    if (screenVideoTrack) {
      screenVideoTrack.stop();
      screenVideoTrack.close();
    }
    if (screenAudioTrack) {
      screenAudioTrack.close();
    }
  };

  useEffect(() => {
    if (!screenVideoTrack) {
      acquireTracks();
    }
    return () => {
      cleanUpTracks();
      if (screenClient.current.connectionState === "CONNECTED") {
        screenClient.current.leave();
      }
    };
  }, []);

  useEffect(() => {
    if (screenVideoTrack && screenClient.current.connectionState !== "CONNECTED") {
      joinRoomAsUser()
        .then(() => {
          if (!isPublished) {
            publishTracks();
          }
        })
        .then(playVideoTrack);
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
