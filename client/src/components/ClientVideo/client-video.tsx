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
    const [clientAudioTrack, setClientAudioTrack] = useState<ILocalAudioTrack | null>(null);
    const [clientVideoTrack, setClientVideoTrack] = useState<ILocalVideoTrack | null>(null);

    const getClientMediaTracks = async () => {
      const mediaTracks = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: facingMode },
        },
        audio: {
          noiseSuppression: true,
          autoGainControl: true,
          suppressLocalAudioPlayback: true,
          echoCancellation: true,
        },
      });
      const cameraTrack = mediaTracks.getVideoTracks()[0];
      const microphoneTrack = mediaTracks.getAudioTracks()[0];
      const customVideoTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: cameraTrack,
        optimizationMode: "motion",
        bitrateMin: 512,
        bitrateMax: 2048,
      });
      const customAudioTrack = AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack: microphoneTrack,
        encoderConfig: { bitrate: 128, stereo: true },
      });
      setClientVideoTrack(customVideoTrack);
      setClientAudioTrack(customAudioTrack);
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
      if (clientAudioTrack) {
        if (isMicOn) {
          client.publish(clientAudioTrack);
        } else {
          client.unpublish(clientAudioTrack);
        }
      }
    }, [isMicOn]);

    useEffect(() => {
      if (clientVideoTrack) {
        client.unpublish(clientVideoTrack);
        clientVideoTrack.close();
      }
      if (clientAudioTrack) {
        client.unpublish(clientAudioTrack);
        clientAudioTrack.close();
      }
      getClientMediaTracks();
      return () => {
        if (clientVideoTrack) {
          client.unpublish(clientVideoTrack);
          clientVideoTrack.close();
        }
        if (clientAudioTrack) {
          client.unpublish(clientAudioTrack);
          clientAudioTrack.close();
        }
      };
    }, [facingMode]);

    return (
      <div className={styles.client} ref={clientVideoRef}>
        <p className={styles.clientUsername}>{username}</p>
        <UserIcon />
      </div>
    );
  }
);
