import styles from "./client-video.module.scss";
import AgoraRTC, { ILocalVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
import { memo, useEffect, useRef, useState } from "react";
import { useError, useRoomContext, useToggleFullscreen } from "@utils/hooks";
import EnterFullscreenIcon from "@assets/icons/enter-fullscreen.svg";
import ExitFullscreenIcon from "@assets/icons/exit-fullscreen.svg";
import { UserIcon } from "@components";

export const ClientVideo = memo(
  ({ isVideoOn, isMicOn, facingMode }: { isVideoOn: boolean; isMicOn: boolean; facingMode: facingMode }) => {
    const [error, setError] = useError();
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
        if (err instanceof Error) {
          console.error(err.message);
          setError(err.message);
        }
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
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
          setError(err.message);
        }
      }
    };

    useEffect(() => {
      if (isMicOn) {
        if (clientMicrophoneTrack) {
          client.publish(clientMicrophoneTrack);
        } else {
          getMicrophoneTrack();
        }
      } else {
        if (clientMicrophoneTrack) {
          client.unpublish(clientMicrophoneTrack);
        }
      }
    }, [isMicOn, clientMicrophoneTrack]);

    useEffect(() => {
      if (clientRef.current) {
        if (isVideoOn) {
          if (clientVideoTrack) {
            clientVideoTrack.play(clientRef.current);
            client.publish(clientVideoTrack);
          } else {
            getCameraTrack();
          }
        } else {
          if (clientVideoTrack) {
            clientVideoTrack.stop();
            client.unpublish(clientVideoTrack);
          }
        }
      }
    }, [isVideoOn, clientVideoTrack]);

    useEffect(() => {
      if (clientVideoTrack) {
        if (isVideoOn) {
          client.unpublish(clientVideoTrack);
        }
        clientVideoTrack?.close();
      }
      setClientVideoTrack(null);
    }, [facingMode]);

    useEffect(() => {
      return () => {
        if (clientVideoTrack) {
          clientVideoTrack.close();
        }
        if (clientMicrophoneTrack) {
          clientMicrophoneTrack.close();
        }
      };
    });

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
