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
    const [clientMicrophoneTrack, setClientMicrophoneTrack] = useState<ILocalAudioTrack | null>(null);

    const getMicrophoneTrack = async () => {
      try {
        const microphoneTracks = await navigator.mediaDevices.getUserMedia({
          audio: {
            noiseSuppression: true,
            autoGainControl: true,
            suppressLocalAudioPlayback: true,
            echoCancellation: true,
          },
          video: false,
        });
        const microphoneTrack = AgoraRTC.createCustomAudioTrack({
          mediaStreamTrack: microphoneTracks.getAudioTracks()[0],
          encoderConfig: { bitrate: 128, stereo: true },
        });
        setClientMicrophoneTrack(microphoneTrack);
      } catch (err) {
        console.error(err);
      }
    };

    const getCameraTrack = async () => {
      try {
        const cameraTracks = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode === "user" ? "user" : { exact: "environment" } },
          audio: false,
        });
        const cameraTrack = AgoraRTC.createCustomVideoTrack({
          mediaStreamTrack: cameraTracks.getVideoTracks()[0],
          optimizationMode: "motion",
          bitrateMin: 512,
          bitrateMax: 2048,
        });
        setClientVideoTrack(cameraTrack);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (clientMicrophoneTrack) {
        if (isMicOn) {
          client.publish(clientMicrophoneTrack);
        } else {
          client.unpublish(clientMicrophoneTrack);
        }
      } else {
        getMicrophoneTrack();
      }
      return () => {
        if (clientMicrophoneTrack) {
          clientMicrophoneTrack?.close();
        }
      };
    }, [isMicOn]);

    useEffect(() => {
      getCameraTrack();

      return () => {
        if (clientVideoTrack) {
          clientVideoTrack.close();
          setClientVideoTrack(null);
        }
      };
    }, [facingMode]);

    useEffect(() => {
      if (clientVideoTrack) {
        if (isVideoOn && clientRef.current) {
          clientVideoTrack.play(clientRef.current);
          client.publish(clientVideoTrack);
        } else {
          clientVideoTrack.stop();
          client.unpublish(clientVideoTrack);
        }
      }

      return () => {
        if (clientVideoTrack && isVideoOn) {
          clientVideoTrack.close();
          client.unpublish(clientVideoTrack);
        }
      };
    }, [isVideoOn, clientVideoTrack]);

    return (
      <div className={[styles.client, facingMode === "user" && styles.mirrored].join(" ")} ref={clientRef}>
        <button className="fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
        </button>
        <p className={styles.clientUsername}>{username}</p>
        <UserIcon />
      </div>
    );
  }
);
