import styles from "./client-user.module.scss";
import AgoraRTC, { ILocalVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
import { memo, useEffect, useRef, useState } from "react";
import { useError, useFloatClient, useRoomContext } from "@utils/hooks";
import { User } from "@components";

export const ClientUser = memo(
  ({ isVideoOn, isMicOn, facingMode }: { isVideoOn: boolean; isMicOn: boolean; facingMode: facingMode }) => {
    const [_, setError] = useError();
    const { username, client } = useRoomContext();
    const clientRef = useRef<HTMLDivElement | null>(null);
    const floatClient = useFloatClient(clientRef.current);
    const [clientVideoTrack, setClientVideoTrack] = useState<ILocalVideoTrack | null>(null);
    const [clientMicrophoneTrack, setClientMicrophoneTrack] = useState<ILocalAudioTrack | null>(null);

    const getMicrophoneTrack = async () => {
      try {
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true,
          AGC: true,
          ANS: true,
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
        const cameraTrack = await AgoraRTC.createCameraVideoTrack({
          facingMode,
          optimizationMode: "motion",
          encoderConfig: { bitrateMin: 512, bitrateMax: 2048, height: window.innerHeight, width: window.innerWidth },
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
          clientMicrophoneTrack.close();
          setClientMicrophoneTrack(null);
        }
      }
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
          clientVideoTrack.close();
          setClientVideoTrack(null);
        }
      }
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

    useEffect(() => {
      return () => {
        if (clientVideoTrack) {
          clientVideoTrack.close();
        }
        if (clientMicrophoneTrack) {
          clientMicrophoneTrack.close();
        }
      };
    }, []);

    return (
      <div
        className={[floatClient && styles.float, facingMode === "user" && styles.mirrored].join(" ")}
        ref={clientRef}
      >
        <User
          username={username}
          audioTrack={null}
          videoTrack={isVideoOn && clientVideoTrack ? clientVideoTrack : null}
        />
      </div>
    );
  }
);
