import styles from "./client-user.module.scss";
import AgoraRTC, { ILocalVideoTrack, ILocalAudioTrack, IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { memo, useEffect, useRef, useState } from "react";
import { useAppContext, useError, useFloatClient } from "@hooks";
import { User } from "@components";

export const ClientUser = memo(
  ({
    isVideoOn,
    isMicOn,
    facingMode,
    client,
  }: {
    isVideoOn: boolean;
    isMicOn: boolean;
    facingMode: facingMode;
    client: IAgoraRTCClient;
  }) => {
    const { setErrorMessage } = useError();
    const {
      appState: { username },
    } = useAppContext();
    const clientRef = useRef<HTMLDivElement | null>(null);
    const floatClient = useFloatClient(clientRef.current);
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
          setErrorMessage(err.message);
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
          setErrorMessage(err.message);
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

      return () => {
        if (clientMicrophoneTrack) {
          clientMicrophoneTrack.close();
          setClientMicrophoneTrack(null);
        }
      };
    }, [isMicOn, clientMicrophoneTrack]);

    useEffect(() => {
      if (isVideoOn) {
        if (clientVideoTrack) {
          client.publish(clientVideoTrack);
        } else {
          getCameraTrack();
        }
      } else {
        if (clientVideoTrack) {
          client.unpublish(clientVideoTrack);
        }
      }

      return () => {
        if (clientVideoTrack) {
          clientVideoTrack.close();
          setClientVideoTrack(null);
        }
      };
    }, [isVideoOn, clientVideoTrack]);

    useEffect(() => {
      if (clientVideoTrack) {
        if (isVideoOn) {
          client.unpublish(clientVideoTrack);
        }
        clientVideoTrack?.close();
        setClientVideoTrack(null);
      }
    }, [facingMode]);

    return (
      <div
        className={[floatClient && styles.float, facingMode === "user" && styles.mirrored].join(" ")}
        ref={clientRef}
      >
        <User
          username={username ?? "Anonymous"}
          audioTrack={null}
          videoTrack={isVideoOn && clientVideoTrack ? clientVideoTrack : null}
        />
      </div>
    );
  }
);
