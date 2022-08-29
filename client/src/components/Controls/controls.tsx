import EndCallIcon from "@assets/icons/call.svg";
import styles from "./controls.module.scss";
import VideoOnIcon from "@assets/icons/video-on.svg";
import VideoOffIcon from "@assets/icons/video-off.svg";
import MicOnIcon from "@assets/icons/mic-on.svg";
import MicOffIcon from "@assets/icons/mic-off.svg";
import FlipCameraIcon from "@assets/icons/flip-camera.svg";
import ScreenShareOnIcon from "@assets/icons/screen-share.svg";
import ScreenShareOffIcon from "@assets/icons/stop-screen-share.svg";
import { useAppContext } from "@utils/hooks";

export const Controls = ({
  roomState,
  roomDispatch,
}: {
  roomState: RoomState;
  roomDispatch: React.Dispatch<RoomAction>;
}) => {
  const { isVideoOn, isMicOn, isSharingScreen, facingMode } = roomState;
  const { isScreenShareAvailable, isRearCameraAvailable } = useAppContext();

  const toggleExitModal = () => {
    roomDispatch({ type: "TOGGLE_EXIT_MODAL" });
  };

  const toggleVideo = () => {
    roomDispatch({ type: "TOGGLE_VIDEO" });
  };

  const toggleMic = () => {
    roomDispatch({ type: "TOGGLE_MIC" });
  };

  const toggleScreenShare = () => {
    roomDispatch({ type: "TOGGLE_SCREENSHARE" });
  };

  const toggleFacingMode = () => {
    roomDispatch({ type: "TOGGLE_FACING_MODE" });
  };

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
        <button
          aria-label="Exit room"
          onClick={toggleExitModal}
          className={[styles.exitBtn, styles.controlBtn].join(" ")}
        >
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
