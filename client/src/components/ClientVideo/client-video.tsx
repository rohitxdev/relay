import AgoraRTC, { ILocalVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
import { memo, useEffect, useRef, useState } from "react";
import styles from "./client-video.module.scss";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import { UserIcon } from "@components";
import EnterFullscreenIcon from "@assets/icons/enter-fullscreen.svg";
import ExitFullscreenIcon from "@assets/icons/exit-fullscreen.svg";
import { useToggleFullscreen } from "@utils/hooks";

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
    const clientRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, toggleFullscreen] = useToggleFullscreen(clientRef.current);
    const [clientVideoTrack, setClientVideoTrack] = useState<ILocalVideoTrack | null>(null);
    const [clientMicrophoneTrack, setClientMicrophoneTrack] = useState<ILocalAudioTrack | null>(
      null
    );
    const mediaTracksRef = useRef<MediaStream | null>(null);
    const getMediaTracks = async () => {
      try {
        mediaTracksRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode === "user" ? "user" : { exact: "environment" } },
          audio: {
            noiseSuppression: true,
            autoGainControl: true,
            suppressLocalAudioPlayback: true,
            echoCancellation: true,
          },
        });
        const cameraTrack = AgoraRTC.createCustomVideoTrack({
          mediaStreamTrack: mediaTracksRef.current.getVideoTracks()[0],
          optimizationMode: "motion",
          bitrateMin: 512,
          bitrateMax: 2048,
        });
        const microphoneTrack = AgoraRTC.createCustomAudioTrack({
          mediaStreamTrack: mediaTracksRef.current.getAudioTracks()[0],
          encoderConfig: { bitrate: 128, stereo: true },
        });
        setClientMicrophoneTrack(microphoneTrack);
        setClientVideoTrack(cameraTrack);
      } catch (error) {
        console.error(error);
      }
    };

    const cleanUp = async () => {
      setClientVideoTrack(null);
      setClientMicrophoneTrack(null);
      mediaTracksRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };

    useEffect(() => {
      if (clientRef.current && clientVideoTrack) {
        if (isVideoOn) {
          clientVideoTrack?.play(clientRef.current);
          client.publish(clientVideoTrack);
        } else {
          clientVideoTrack?.stop();
          client.unpublish(clientVideoTrack);
        }
      }

      return () => {
        if (clientRef.current && clientVideoTrack) {
          if (isVideoOn) {
            client.unpublish(clientVideoTrack);
            clientVideoTrack?.stop();
          }
        }
      };
    }, [isVideoOn, clientVideoTrack]);

    useEffect(() => {
      if (clientMicrophoneTrack) {
        if (isMicOn) {
          client.publish(clientMicrophoneTrack);
        } else {
          client.unpublish(clientMicrophoneTrack);
        }
      }
      return () => {
        if (clientMicrophoneTrack && isMicOn) {
          client.unpublish(clientMicrophoneTrack);
        }
      };
    }, [isMicOn, clientMicrophoneTrack]);

    useEffect(() => {
      if (!clientVideoTrack) {
        getMediaTracks();
      }
      return () => {
        cleanUp();
      };
    }, [facingMode]);

    return (
      <div
        className={[styles.client, facingMode === "user" && styles.mirrored].join(" ")}
        ref={clientRef}
      >
        <button className="fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
        </button>
        <p className={styles.clientUsername}>{username}</p>
        <UserIcon />
      </div>
    );
  }
);
