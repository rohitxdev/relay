import AgoraRTC, {
  CameraVideoTrackInitConfig,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  ILocalVideoTrack,
  MicrophoneAudioTrackInitConfig,
} from "agora-rtc-sdk-ng";
import { memo, useEffect, useRef, useState } from "react";
import styles from "./client-video.module.scss";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import { Avatar } from "@components";

export const ClientVideo = memo(
  ({
    isVideoOn,
    isMicOn,
    facingMode,
  }: {
    isVideoOn: boolean;
    isMicOn: boolean;
    facingMode: "user" | "environment";
  }) => {
    const { username, client } = useRoomContext();
    const clientVideoRef = useRef<HTMLDivElement | null>(null);
    const [clientAudioTrack, setClientAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
    const [clientVideoTrack, setClientVideoTrack] = useState<ILocalVideoTrack | null>(null);
    const clientAudioConfig: MicrophoneAudioTrackInitConfig = {
      ANS: true,
      AEC: true,
      AGC: true,
      encoderConfig: { bitrate: 128 },
    };
    const clientVideoConfig: CameraVideoTrackInitConfig = {
      encoderConfig: {
        frameRate: { min: 20, ideal: 25, max: 30 },
        bitrateMin: 512,
        bitrateMax: 2048,
        height: { min: 360, ideal: 720, max: 1080 },
        width: { min: 640, ideal: 1280, max: 1920 },
      },
      facingMode: facingMode,
      optimizationMode: "motion",
    };

    useEffect(() => {
      if (clientVideoRef.current && clientVideoTrack) {
        if (isVideoOn) {
          clientVideoTrack?.play(clientVideoRef.current);
          client.publish(clientVideoTrack);
        } else {
          clientVideoTrack?.stop();
          client.unpublish(clientVideoTrack);
        }
      }
    }, [isVideoOn]);

    useEffect(() => {
      if (clientAudioTrack) {
        if (isMicOn) {
          client.publish(clientAudioTrack);
        } else {
          client.unpublish(clientAudioTrack);
        }
      }
    }, [isMicOn]);

    useEffect(() => {
      AgoraRTC.createMicrophoneAndCameraTracks(clientAudioConfig, clientVideoConfig).then(
        (tracks) => {
          if (clientVideoTrack) {
            clientVideoTrack.close();
          }
          if (clientAudioTrack) {
            clientAudioTrack.close();
          }
          setClientAudioTrack(tracks[0]);
          setClientVideoTrack(tracks[1]);
        }
      );
    }, [facingMode]);

    return (
      <div className={styles.client} ref={clientVideoRef}>
        <p className={styles.clientUsername}>{username}</p>
        <Avatar />
      </div>
    );
  }
);
