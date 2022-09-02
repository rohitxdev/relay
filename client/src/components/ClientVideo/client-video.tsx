import AgoraRTC, { ILocalVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
import { memo, useEffect, useRef, useState } from "react";
import styles from "./client-video.module.scss";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import { UserIcon } from "@components";

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
    const [clientMicrophoneTrack, setClientMicrophoneTrack] = useState<ILocalAudioTrack | null>(
      null
    );
    const [clientVideoTrack, setClientVideoTrack] = useState<ILocalVideoTrack | null>(null);

    const getMicrophoneTrack = async () => {
      navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: {
            noiseSuppression: true,
            autoGainControl: true,
            suppressLocalAudioPlayback: true,
            echoCancellation: true,
          },
        })
        .then((tracks) => {
          const microphoneTrack = AgoraRTC.createCustomAudioTrack({
            mediaStreamTrack: tracks.getAudioTracks()[0],
            encoderConfig: { bitrate: 128, stereo: true },
          });
          setClientMicrophoneTrack(microphoneTrack);
        })
        .catch((error) => {
          if (error instanceof Error) {
            console.warn(error);
          }
        });
    };

    const getCameraTrack = async () => {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode,
          },
          audio: false,
        })
        .then((tracks) => {
          const cameraTrack = AgoraRTC.createCustomVideoTrack({
            mediaStreamTrack: tracks.getVideoTracks()[0],
            optimizationMode: "motion",
            bitrateMin: 512,
            bitrateMax: 2048,
          });
          setClientVideoTrack(cameraTrack);
        })
        .catch((error) => {
          if (error instanceof Error) {
            console.warn(error);
          }
        });
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
    }, [isVideoOn, clientVideoTrack]);

    useEffect(() => {
      if (!clientMicrophoneTrack) {
        getMicrophoneTrack();
      }
      if (clientMicrophoneTrack) {
        if (isMicOn) {
          client.publish(clientMicrophoneTrack);
        } else {
          client.unpublish(clientMicrophoneTrack);
        }
      }
    }, [isMicOn]);

    useEffect(() => {
      getCameraTrack();
      return () => {
        if (clientVideoTrack) {
          clientVideoTrack.close();
        }
      };
    }, [facingMode]);

    return (
      <div
        className={[styles.client, facingMode === "user" && styles.mirrored].join(" ")}
        ref={clientVideoRef}
      >
        <p className={styles.clientUsername}>{username}</p>
        <UserIcon />
      </div>
    );
  }
);
