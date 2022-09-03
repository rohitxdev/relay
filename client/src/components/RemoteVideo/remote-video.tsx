import styles from "./remote-video.module.scss";
import { IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { useRef, useEffect, memo } from "react";
import { UserIcon } from "@components";
import EnterFullscreenIcon from "@assets/icons/enter-fullscreen.svg";
import ExitFullscreenIcon from "@assets/icons/exit-fullscreen.svg";
import { useToggleFullscreen } from "@utils/hooks";

export const RemoteVideo = memo(
  ({
    username,
    remoteAudioTrack,
    remoteVideoTrack,
  }: {
    username: string;
    remoteAudioTrack?: IRemoteAudioTrack;
    remoteVideoTrack?: IRemoteVideoTrack;
  }) => {
    const remoteUserRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, toggleFullscreen] = useToggleFullscreen(remoteUserRef.current);

    useEffect(() => {
      if (remoteUserRef.current && remoteVideoTrack) {
        remoteVideoTrack.play(remoteUserRef.current);
      }
      remoteAudioTrack?.play();
    });

    return (
      <div className={styles.remoteVideo} ref={remoteUserRef}>
        <p className={styles.remoteUsername}>{username}</p>
        <UserIcon username={username} />
        <button
          className="fullscreen-btn"
          onClick={() => {
            toggleFullscreen();
          }}
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
        </button>
      </div>
    );
  }
);
