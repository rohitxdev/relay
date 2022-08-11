import AgoraRTC, {
  CameraVideoTrackInitConfig,
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { useNavigate } from "react-router-dom";
import { memo, useEffect, useRef, useState } from "react";
import VideoOnIcon from "../assets/icons/videocam.svg";
import VideoOffIcon from "../assets/icons/videocam-off.svg";
import MicOnIcon from "../assets/icons/mic.svg";
import MicOffIcon from "../assets/icons/mic-off.svg";
import EndCallIcon from "../assets/icons/call.svg";
import FlipCameraIcon from "../assets/icons/flip-camera.svg";
import Avatar from "./Avatar";

function LocalVideo({ client }: { client: IAgoraRTCClient }) {
  const navigate = useNavigate();
  const vidRef = useRef<HTMLDivElement>(null);
  const exitModalRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrack = useRef<ICameraVideoTrack | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  let timeOut: ReturnType<typeof setTimeout>;
  const localAudioConfig = {
    ANS: true,
    AEC: true,
    AGC: true,
    encoderConfig: { bitrate: 128 },
  };
  const localVideoConfig: CameraVideoTrackInitConfig = {
    encoderConfig: {
      frameRate: { min: 20, ideal: 30, max: 40 },
      bitrateMin: 512,
      bitrateMax: 2048,
      height: { min: 240, ideal: 720, max: 1080 },
      width: { min: 320, ideal: 1280, max: 1920 },
    },
    facingMode: "user",
  };

  const buttonStyles = (value: boolean) =>
    value
      ? { backgroundColor: "var(--primary-blue)" }
      : { backgroundColor: "rgba(255,255,255,0.3)" };

  const getLocalTracks = async () => {
    [localAudioTrack.current, localVideoTrack.current] =
      await AgoraRTC.createMicrophoneAndCameraTracks(localAudioConfig, localVideoConfig);
  };

  const toggleVideo = async () => {
    if (vidRef.current && localVideoTrack.current) {
      if (isVideoOn) {
        setIsVideoOn(false);
        localVideoTrack.current.stop();
        await client.unpublish(localVideoTrack.current);
      } else {
        setIsVideoOn(true);
        localVideoTrack.current.play(vidRef.current);
        await client.publish(localVideoTrack.current);
      }
    }
  };

  const toggleMic = async () => {
    if (localAudioTrack.current) {
      if (isMicOn) {
        setIsMicOn(false);
        await client.unpublish(localAudioTrack.current);
      } else {
        setIsMicOn(true);
        await client.publish(localAudioTrack.current);
      }
    }
  };

  const handleTouch = async () => {
    clearTimeout(timeOut);
    if (controlsRef.current) {
      controlsRef.current.style.opacity = "1";
      controlsRef.current.style.transform = "translateY(0%)";
      controlsRef.current.style.transition = "all 0.2s ease-in";
    }
    timeOut = setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.style.opacity = "0";
        controlsRef.current.style.transform = "translateY(calc(100% + 2em))";
      }
    }, 4000);
  };

  const handleExit = async () => {
    await client.leave();
    sessionStorage.clear();
    navigate("/");
  };

  const showModal = async () => {
    if (exitModalRef.current) {
      exitModalRef.current.style.display = "unset";
    }
  };

  const hideModal = async () => {
    if (exitModalRef.current) {
      exitModalRef.current.style.display = "none";
    }
  };

  const cleanUp = async () => {
    localVideoTrack.current?.close();
    localAudioTrack.current?.close();
  };

  useEffect(() => {
    getLocalTracks();
    return () => {
      cleanUp();
    };
  }, []);

  return (
    <>
      <div className="video" ref={vidRef} onTouchEnd={handleTouch}>
        <Avatar isTrue={!isVideoOn} />
        <div className="controls" ref={controlsRef}>
          <button style={buttonStyles(isVideoOn)} onClick={toggleVideo}>
            {isVideoOn ? <VideoOnIcon /> : <VideoOffIcon />}
          </button>
          <button className="exit-btn" onClick={showModal}>
            <EndCallIcon />
          </button>
          <button style={buttonStyles(isMicOn)} onClick={toggleMic}>
            {isMicOn ? <MicOnIcon /> : <MicOffIcon />}
          </button>
        </div>
      </div>
      <div className="exit-modal" ref={exitModalRef}>
        <p>Are you sure you want to exit?</p>
        <div>
          <button onClick={hideModal}>Stay</button>
          <button onClick={handleExit}>Exit</button>
        </div>
      </div>
    </>
  );
}
export default memo(LocalVideo);
