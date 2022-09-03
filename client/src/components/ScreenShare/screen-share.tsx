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
  const [screenVideoTrack, setScreenVideoTrack] = useState<ILocalVideoTrack | null>(null);

  const acquireTracks = async () => {
    try {
      const videoTrack = await AgoraRTC.createScreenVideoTrack(
        { optimizationMode: "detail", encoderConfig: "1080p_2" },
        "disable"
      );
      setScreenVideoTrack(videoTrack);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!screenVideoTrack) {
      acquireTracks();
    }
    return () => {
      screenVideoTrack?.close();
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
      if (screenVideoTrack && screenClient.current.connectionState === "CONNECTED") {
        await screenClient.current.publish(screenVideoTrack);
        if (screenRef.current && !screenVideoTrack.isPlaying) {
          screenVideoTrack.play(screenRef.current);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (screenVideoTrack) {
      joinRoomAsUser().then(() => {
        publishTracks();
      });
    }
    return () => {
      if (screenVideoTrack && screenClient.current.connectionState === "CONNECTED") {
        screenVideoTrack.close();
        screenClient.current.leave();
      }
    };
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
