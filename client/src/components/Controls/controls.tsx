import { useEffect, useLayoutEffect, useState } from "react";
import EndCallIcon from "@assets/icons/call.svg";
import styles from "./controls.module.scss";
import VideoOnIcon from "@assets/icons/video-on.svg";
import VideoOffIcon from "@assets/icons/video-off.svg";
import MicOnIcon from "@assets/icons/mic-on.svg";
import MicOffIcon from "@assets/icons/mic-off.svg";
import FlipCameraIcon from "@assets/icons/flip-camera.svg";
import ScreenShareOnIcon from "@assets/icons/screen-share.svg";
import ScreenShareOffIcon from "@assets/icons/stop-screen-share.svg";
import { ExitModal } from "@components";

export const Controls = ({ state, dispatch }: { state: RoomState; dispatch: React.Dispatch<RoomAction> }) => {
  const { isVideoOn, isMicOn, isSharingScreen, facingMode, showExitModal } = state;
  const [isRearCameraAvailable, setIsRearCameraAvailable] = useState(false);
  const [isScreenshareAvailable, setIsScreenshareAvailable] = useState(false);

  const toggleExitModal = () => {
    dispatch({ type: "TOGGLE_EXIT_MODAL" });
  };

  const toggleVideo = () => {
    dispatch({ type: "TOGGLE_VIDEO" });
  };

  const toggleMic = () => {
    dispatch({ type: "TOGGLE_MIC" });
  };

  const toggleScreenShare = () => {
    dispatch({ type: "TOGGLE_SCREENSHARE" });
  };

  const toggleFacingMode = () => {
    dispatch({ type: "TOGGLE_FACING_MODE" });
  };

  const checkForScreenShare = () => {
    if ("getDisplayMedia" in navigator.mediaDevices) {
      setIsScreenshareAvailable(true);
    } else {
      console.info("💻 Screensharing is not available on this device.");
    }
  };

  const checkForRearCamera = async () => {
    try {
      const tracks = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
        audio: false,
      });
      tracks.getVideoTracks().forEach((track) => {
        track.stop();
      });
      setIsRearCameraAvailable(true);
    } catch (error) {
      alert(JSON.stringify(error));
      console.info("📷 Rear camera is not available on this device.");
    }
  };

  useEffect(() => {
    checkForScreenShare();
    checkForRearCamera();
  }, []);

  return (
    <>
      {showExitModal && <ExitModal dispatch={dispatch} />}
      <div className={styles.clientControls}>
        <div>
          <button
            aria-label={isSharingScreen ? "Stop screenshare" : "Start screenshare"}
            onClick={toggleScreenShare}
            className={isSharingScreen ? styles.btnOn : styles.btnOff}
            disabled={!isScreenshareAvailable}
          >
            {isSharingScreen ? <ScreenShareOnIcon /> : <ScreenShareOffIcon />}
          </button>
          <button
            aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
            onClick={toggleVideo}
            className={isVideoOn ? styles.btnOn : styles.btnOff}
          >
            {isVideoOn ? <VideoOnIcon /> : <VideoOffIcon />}
          </button>
          <button aria-label="Leave room" onClick={toggleExitModal} className={styles.exitBtn}>
            <EndCallIcon />
          </button>
          <button
            aria-label={isMicOn ? "Turn off mic" : "Turn on mic"}
            onClick={toggleMic}
            className={isMicOn ? styles.btnOn : styles.btnOff}
          >
            {isMicOn ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          <button
            aria-label={facingMode === "user" ? "Switch to rear camera" : "Switch to front camera"}
            onClick={toggleFacingMode}
            className={facingMode === "environment" ? styles.btnOn : styles.btnOff}
            disabled={!isRearCameraAvailable}
          >
            <FlipCameraIcon />
          </button>
        </div>
      </div>
    </>
  );
};
