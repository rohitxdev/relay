import styles from "./remote-video.module.scss";
import { IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { useRef, useEffect, memo } from "react";
import { UserIcon } from "@components";

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
    const vidRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (vidRef.current && remoteVideoTrack) {
        remoteVideoTrack.play(vidRef.current);
      }
      remoteAudioTrack?.play();
    });

    return (
      <div className={styles.remoteVideo} ref={vidRef}>
        <p className={styles.remoteUsername}>{username}</p>
        <UserIcon username={username} />
      </div>
    );
  }
);
