import styles from "./client-video.module.scss";
import AgoraRTC, { ILocalVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
import { memo, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector, useError, useRoomContext, useToggleFullscreen } from "@utils/hooks";
import EnterFullscreenIcon from "@assets/icons/enter-fullscreen.svg";
import ExitFullscreenIcon from "@assets/icons/exit-fullscreen.svg";
import { UserIcon } from "@components";
import { decrementUsers, incrementUsers } from "@store";

export const ClientVideo = memo(
  ({ isVideoOn, isMicOn, facingMode }: { isVideoOn: boolean; isMicOn: boolean; facingMode: facingMode }) => {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.room.users);
    const [_, setError] = useError();
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
      dispatch(incrementUsers());
      return () => {
        if (clientVideoTrack) {
          clientVideoTrack.close();
        }
        if (clientMicrophoneTrack) {
          clientMicrophoneTrack.close();
        }
        dispatch(decrementUsers());
      };
    }, []);

    useEffect(() => {
      if (users === 2 && clientRef.current) {
        clientRef.current.onpointerdown = (event) => {
          if (clientRef.current) {
            const clientRect = clientRef.current.getBoundingClientRect();
            const shiftX = event.clientX - clientRect.left;
            const shiftY = event.clientY - clientRect.top;
            clientRef.current.style.transform = "scale(0.97)";

            window.onpointermove = (e) => {
              if (clientRef.current && clientRef.current.parentElement) {
                if (
                  clientRef.current.offsetWidth - shiftX + e.clientX <
                    clientRef.current.parentElement.offsetWidth - 24 &&
                  e.clientX > shiftX
                ) {
                  clientRef.current.style.left = e.clientX - shiftX + "px";
                }
                if (
                  clientRef.current.offsetHeight - shiftY + e.clientY <
                    clientRef.current.parentElement.offsetHeight - 24 &&
                  e.clientY > shiftY
                ) {
                  clientRef.current.style.top = e.clientY - shiftY + "px";
                }
              }
            };
          }
        };
        window.onpointerup = (event) => {
          if (clientRef.current) {
            clientRef.current.style.transform = "scale(1)";
          }
          window.onpointermove = null;
        };
      }
      return () => {
        if (clientRef.current) {
          clientRef.current.onpointerdown = null;
          window.onpointermove = null;
        }
      };
    }, [users]);

    return (
      <div
        className={[users !== 2 ? styles.client : styles.float, facingMode === "user" && styles.mirrored].join(" ")}
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
