import { useRoomContext } from "@utils/hooks";
import EndCallIcon from "@assets/icons/call.svg";
import styles from "./controls.module.scss";
import VideoOnIcon from "@assets/icons/video-on.svg";
import VideoOffIcon from "@assets/icons/video-off.svg";
import MicOnIcon from "@assets/icons/mic-on.svg";
import MicOffIcon from "@assets/icons/mic-off.svg";
import FlipCameraIcon from "@assets/icons/flip-camera.svg";
import ScreenShareOnIcon from "@assets/icons/screen-share.svg";
import ScreenShareOffIcon from "@assets/icons/stop-screen-share.svg";

export const Controls = () => {
  const { state, dispatch } = useRoomContext();
  const { isVideoOn, isMicOn, isSharingScreen, facingMode, isRearCameraAvailable, isScreenshareAvailable } = state;

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

  return (
    <>
      <section aria-label="Client controls" className={styles.clientControls}>
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
            aria-label={facingMode === "environment" ? "Switch to front camera" : "Switch to rear camera"}
            onClick={toggleFacingMode}
            className={facingMode === "environment" ? styles.btnOn : styles.btnOff}
            disabled={!isRearCameraAvailable}
          >
            <FlipCameraIcon />
          </button>
        </div>
      </section>
    </>
  );
};
