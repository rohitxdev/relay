import styles from "./user.module.scss";
import { ILocalAudioTrack, ILocalVideoTrack, IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { useRef, useEffect, memo, useState } from "react";
import EnterFullscreenIcon from "@assets/icons/enter-fullscreen.svg";
import ExitFullscreenIcon from "@assets/icons/exit-fullscreen.svg";

export const User = memo(
  ({
    username,
    audioTrack,
    videoTrack,
  }: {
    username: string;
    audioTrack: ILocalAudioTrack | IRemoteAudioTrack | null;
    videoTrack: ILocalVideoTrack | IRemoteVideoTrack | null;
  }) => {
    const userRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullScreen] = useState(false);
    const initials = username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const toggleFullscreen = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        userRef.current?.requestFullscreen().catch((err) => {
          console.error(err);
        });
      }
      setIsFullScreen((prevState) => !prevState);
    };

    useEffect(() => {
      audioTrack?.play();

      return () => {
        audioTrack?.stop();
      };
    }, [audioTrack]);

    useEffect(() => {
      if (userRef.current) {
        videoTrack?.play(userRef.current);
      }

      return () => {
        videoTrack?.stop();
      };
    }, [videoTrack]);

    return (
      <div className={styles.user} ref={userRef}>
        <div className={styles.userIconContainer}>
          <div className={styles.userIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
                {initials}
              </text>
            </svg>
          </div>
        </div>
        <div className={styles.userInfo}>
          <p className={styles.username}>{username}</p>
          <button
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className={styles.fullscreenBtn}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
          </button>
        </div>
      </div>
    );
  }
);
