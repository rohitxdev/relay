import { useEffect, useState } from "react";
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

export const Controls = ({
  state,
  dispatch,
}: {
  state: RoomState;
  dispatch: React.Dispatch<RoomAction>;
}) => {
  const { isVideoOn, isMicOn, isSharingScreen, facingMode, showExitModal } = state;
  const [isRearCameraAvailable, setRearCameraAvailability] = useState(false);
  const [isScreenShareAvailable, setScreenShareAvailability] = useState(false);

  const checkForRearCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      });
      setRearCameraAvailability(true);
    } catch (error) {
      console.warn("Rear camera is not available on this device.");
    }
  };

  const checkForScreenShare = () => {
    if ("getDisplayMedia" in navigator.mediaDevices) {
      setScreenShareAvailability(true);
    } else {
      console.warn("Screensharing is not available on this device.");
    }
  };

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
            disabled={!isScreenShareAvailable}
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
            aria-label="Flip camera"
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
