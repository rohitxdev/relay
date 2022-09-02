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

    const getClientMediaTracks = async () => {
      const mediaTracks = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
        },
        audio: {
          noiseSuppression: true,
          autoGainControl: true,
          suppressLocalAudioPlayback: true,
          echoCancellation: true,
        },
      });
      const customVideoTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: mediaTracks.getVideoTracks()[0],
        optimizationMode: "motion",
        bitrateMin: 512,
        bitrateMax: 2048,
      });
      const customMicrophoneTrack = AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack: mediaTracks.getAudioTracks()[0],
        encoderConfig: { bitrate: 128, stereo: true },
      });
      setClientVideoTrack(customVideoTrack);
      setClientMicrophoneTrack(customMicrophoneTrack);
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
      if (clientMicrophoneTrack) {
        if (isMicOn) {
          client.publish(clientMicrophoneTrack);
        } else {
          client.unpublish(clientMicrophoneTrack);
        }
      }
    }, [isMicOn]);

    useEffect(() => {
      getClientMediaTracks();
      return () => {
        if (clientVideoTrack) {
          clientVideoTrack.stop();
          client.unpublish(clientVideoTrack);
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
