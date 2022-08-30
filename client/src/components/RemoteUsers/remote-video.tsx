import { IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { useState, useRef, memo, useEffect } from "react";
import AudioOnIcon from "@assets/icons/audio-on.svg";
import AudioOffIcon from "@assets/icons/audio-off.svg";
import { Avatar } from "@components";
import styles from "./remote-user.module.scss";

export const RemoteUser = memo(
  ({
    username,
    remoteAudioTrack,
    remoteVideoTrack,
  }: {
    username: string;
    remoteAudioTrack?: IRemoteAudioTrack;
    remoteVideoTrack?: IRemoteVideoTrack;
  }) => {
    const [isAudioOn, setIsAudioOn] = useState(true);
    const vidRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (vidRef.current && remoteVideoTrack) {
        remoteVideoTrack.play(vidRef.current);
      }
      remoteAudioTrack?.play();
    }, []);

    const toggleAudio = async () => {
      if (isAudioOn) {
        remoteAudioTrack?.stop();
      } else {
        remoteAudioTrack?.play();
      }
      setIsAudioOn(!isAudioOn);
    };

    return (
      <div className={styles.remoteVideo} ref={vidRef}>
        <p className={styles.remoteUsername}>{username}</p>
        <Avatar username={username} />
        <div className={styles.remoteControls}>
          {/* <button
            aria-aria-label={
              isAudioOn ? `Turn off ${username}'s audio` : `Turn on ${username}'s audio`
            }
            className={isAudioOn ? styles.btnOn : styles.btnOff}
            onClick={toggleAudio}
          >
            {isAudioOn ? <AudioOnIcon /> : <AudioOffIcon />}
          </button> */}
        </div>
      </div>
    );
  }
);
