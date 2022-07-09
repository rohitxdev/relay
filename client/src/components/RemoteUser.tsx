import { IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { useState, useRef } from "react";
import AudioOnIcon from "../assets/icons/volume-high.svg";
import AudioOffIcon from "../assets/icons/volume-mute.svg";
import Avatar from "./Avatar";

export default function RemoteUser({
  remoteAudioTrack,
  remoteVideoTrack,
}: {
  remoteAudioTrack: IRemoteAudioTrack | undefined;
  remoteVideoTrack: IRemoteVideoTrack | undefined;
}) {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const audioRef = useRef(isAudioOn);
  const vidRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  if (audioRef.current === true) {
    remoteAudioTrack?.play();
  }
  if (vidRef.current) {
    remoteVideoTrack?.play(vidRef.current);
  }

  const buttonStyles = (value: boolean) =>
    value
      ? { backgroundColor: "var(--primary-blue)" }
      : { backgroundColor: "rgba(255,255,255,0.3)" };

  const handleTouch = async () => {
    if (controlsRef.current) {
      controlsRef.current.style.opacity = "1";
      controlsRef.current.style.transform = "translateY(0%)";
      controlsRef.current.style.transition = "all 0.2s ease-in";
    }
    setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.style.opacity = "0";
        controlsRef.current.style.transform = "translateY(calc(100% + 2em))";
      }
    }, 3000);
  };

  const toggleAudio = async () => {
    if (isAudioOn) {
      audioRef.current = false;
      setIsAudioOn(false);
      remoteAudioTrack?.stop();
    } else {
      audioRef.current = false;
      setIsAudioOn(true);
      remoteAudioTrack?.play();
    }
  };

  return (
    <div className="video" ref={vidRef} onTouchEnd={handleTouch}>
      <Avatar isTrue={!remoteVideoTrack} />
      <div className="controls" ref={controlsRef}>
        <button style={buttonStyles(isAudioOn)} onClick={toggleAudio}>
          {isAudioOn ? <AudioOnIcon /> : <AudioOffIcon />}
        </button>
      </div>
    </div>
  );
}
