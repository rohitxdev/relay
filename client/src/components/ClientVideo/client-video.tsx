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
    const clientVideoRef = useRef<HTMLDivElement | null>(null);
    const { isFullscreen, toggleFullscreen } = useToggleFullscreen(clientVideoRef.current);
    const [clientMicrophoneTrack, setClientMicrophoneTrack] = useState<ILocalAudioTrack | null>(
      null
    );
    const [clientVideoTrack, setClientVideoTrack] = useState<ILocalVideoTrack | null>(null);
    const getMediaTracks = async () => {
      const mediaTracks = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode === "user" ? "user" : { exact: "environment" } },
        audio: {
          noiseSuppression: true,
          autoGainControl: true,
          suppressLocalAudioPlayback: true,
          echoCancellation: true,
        },
      });
      const cameraTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: mediaTracks.getVideoTracks()[0],
        optimizationMode: "motion",
        bitrateMin: 512,
        bitrateMax: 2048,
      });
      const microphoneTrack = AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack: mediaTracks.getAudioTracks()[0],
        encoderConfig: { bitrate: 128, stereo: true },
      });
      setClientMicrophoneTrack(microphoneTrack);
      setClientVideoTrack(cameraTrack);
    };

    const cleanUp = async () => {
      if (clientVideoTrack) {
        clientVideoTrack.close();
        setClientVideoTrack(null);
      }
      if (clientMicrophoneTrack) {
        clientMicrophoneTrack.close();
        setClientMicrophoneTrack(null);
      }
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

      return () => {
        if (clientVideoRef.current && clientVideoTrack) {
          if (isVideoOn) {
            client.unpublish(clientVideoTrack);
            // clientVideoTrack?.stop();
          } else {
            client.publish(clientVideoTrack);
            // clientVideoTrack?.play(clientVideoRef.current);
          }
        }
      };
    }, [isVideoOn, facingMode]);

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
      if (!clientVideoTrack && !clientMicrophoneTrack) {
        getMediaTracks();
      }
      return () => {
        cleanUp();
      };
    }, [facingMode]);

    useEffect(() => {}, []);

    return (
      <div
        className={[styles.client, facingMode === "user" && styles.mirrored].join(" ")}
        ref={clientVideoRef}
      >
        <button
          className="fullscreen-btn"
          onClick={() => {
            toggleFullscreen();
          }}
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
        </button>
        <p className={styles.clientUsername}>{username}</p>
        <UserIcon />
      </div>
    );
  }
);
