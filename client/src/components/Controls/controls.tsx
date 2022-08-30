import EndCallIcon from "@assets/icons/call.svg";
import styles from "./controls.module.scss";
import VideoOnIcon from "@assets/icons/video-on.svg";
import VideoOffIcon from "@assets/icons/video-off.svg";
import MicOnIcon from "@assets/icons/mic-on.svg";
import MicOffIcon from "@assets/icons/mic-off.svg";
import FlipCameraIcon from "@assets/icons/flip-camera.svg";
import ScreenShareOnIcon from "@assets/icons/screen-share.svg";
import ScreenShareOffIcon from "@assets/icons/stop-screen-share.svg";
import { useEffect } from "react";

export const Controls = ({
  state,
  dispatch,
}: {
  state: RoomState;
  dispatch: React.Dispatch<RoomAction>;
}) => {
  const {
    isVideoOn,
    isMicOn,
    isSharingScreen,
    isScreenShareAvailable,
    isRearCameraAvailable,
    facingMode,
  } = state;

  const checkForRearCamera = async () => {
    if (localStorage.getItem("rear-camera-availability")) {
      dispatch({ type: "SET_REAR_CAMERA_AVAILABILITY", payload: true });
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      });
      localStorage.setItem("rear-camera-availability", "available");
      dispatch({ type: "SET_REAR_CAMERA_AVAILABILITY", payload: true });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const checkForScreenShare = () => {
    if ("getDisplayMedia" in navigator.mediaDevices) {
      dispatch({ type: "SET_SCREENSHARE_AVAILABILITY", payload: true });
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
      <div className={styles.clientControls}>
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
    </>
  );
};
