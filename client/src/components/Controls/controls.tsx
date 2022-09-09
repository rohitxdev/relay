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
import { useAppDispatch, useAppSelector } from "@utils/hooks";
import { toggleVideo, toggleMic, toggleFacingMode, toggleScreenShare } from "@store";

export const Controls = () => {
  const dispatch = useAppDispatch();
  const [showExitModal, setShowExitModal] = useState(false);
  const isVideoOn = useAppSelector((state) => state.room.isVideoOn);
  const isMicOn = useAppSelector((state) => state.room.isMicOn);
  const isSharingScreen = useAppSelector((state) => state.room.isSharingScreen);
  const facingMode = useAppSelector((state) => state.room.facingMode);
  const isRearCameraAvailable = useAppSelector((state) => state.room.isRearCameraAvailable);
  const isScreenSharingAvailable = useAppSelector((state) => state.room.isScreenSharingAvailable);

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
              dispatch(toggleScreenShare());
            }}
            className={isSharingScreen ? styles.btnOn : styles.btnOff}
            disabled={!isScreenSharingAvailable}
          >
            {isSharingScreen ? <ScreenShareOnIcon /> : <ScreenShareOffIcon />}
          </button>
          <button
            aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
            onClick={() => {
              dispatch(toggleVideo());
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
              dispatch(toggleMic());
            }}
            className={isMicOn ? styles.btnOn : styles.btnOff}
          >
            {isMicOn ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          <button
            aria-label={facingMode === "environment" ? "Switch to front camera" : "Switch to rear camera"}
            onClick={() => {
              dispatch(toggleFacingMode());
            }}
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
