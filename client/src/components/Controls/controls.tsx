import styles from "./controls.module.scss";
import EndCallIcon from "@assets/icons/call.svg";
import VideoOnIcon from "@assets/icons/video-on.svg";
import VideoOffIcon from "@assets/icons/video-off.svg";
import MicOnIcon from "@assets/icons/mic-on.svg";
import MicOffIcon from "@assets/icons/mic-off.svg";
import FlipCameraIcon from "@assets/icons/flip-camera.svg";
import ScreenShareOnIcon from "@assets/icons/screen-share.svg";
import ScreenShareOffIcon from "@assets/icons/stop-screen-share.svg";
import { ExitModal } from "@components";
import { useState } from "react";
import { useAppContext, useRoomContext } from "@hooks";

export const Controls = () => {
  const [showExitModal, setShowExitModal] = useState(false);
  const {
    appState: { canShareScreen, canUseRearCamera },
  } = useAppContext();
  const {
    roomState: { facingMode, isMicOn, isSharingScreen, isVideoOn },
    roomDispatch,
  } = useRoomContext();

  const toggleExitModal = () => {
    setShowExitModal((state) => !state);
  };

  return (
    <>
      {showExitModal && <ExitModal toggleExitModal={toggleExitModal} />}
      <section aria-label="Client controls" className={styles.clientControls}>
        <div>
          <button
            aria-label={isSharingScreen ? "Stop screenshare" : "Start screenshare"}
            onClick={() => {
              roomDispatch({ type: "toggleScreenShare" });
            }}
            className={isSharingScreen ? styles.btnOn : styles.btnOff}
            disabled={!canShareScreen}
          >
            {isSharingScreen ? <ScreenShareOnIcon /> : <ScreenShareOffIcon />}
          </button>
          <button
            aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
            onClick={() => {
              roomDispatch({ type: "toggleVideo" });
            }}
            className={isVideoOn ? styles.btnOn : styles.btnOff}
          >
            {isVideoOn ? <VideoOnIcon /> : <VideoOffIcon />}
          </button>
          <button aria-label="Leave room" onClick={toggleExitModal} className={styles.exitBtn}>
            <EndCallIcon />
          </button>
          <button
            aria-label={isMicOn ? "Turn off mic" : "Turn on mic"}
            onClick={() => {
              roomDispatch({ type: "toggleMic" });
            }}
            className={isMicOn ? styles.btnOn : styles.btnOff}
          >
            {isMicOn ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          <button
            aria-label={facingMode === "environment" ? "Switch to front camera" : "Switch to rear camera"}
            onClick={() => {
              roomDispatch({ type: "toggleFacingMode" });
            }}
            className={facingMode === "environment" ? styles.btnOn : styles.btnOff}
            disabled={!canUseRearCamera}
          >
            <FlipCameraIcon />
          </button>
        </div>
      </section>
    </>
  );
};
