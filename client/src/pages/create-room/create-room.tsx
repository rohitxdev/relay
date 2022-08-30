import { useEffect, useState } from "react";
import CopyIcon from "@assets/icons/copy.svg";
import BackIcon from "@assets/icons/arrow-back.svg";
import LoaderIcon from "@assets/icons/loader.svg";
import ShareIcon from "@assets/icons/share.svg";
import styles from "./create-room.module.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api-service";

export const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const shareData: ShareData = {
    title: "Relay: Free video conferencing for everyone",
    text: `You've been invited to join a room on Relay!\n
    Room ID is ${roomId}.\n
    Link:${window.location.hostname}/join-room?roomId=${roomId}`,
  };

  const showError = (error: string) => {
    setError(error);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const getRoomId = async () => {
    try {
      setIsLoading(true);
      const response = await api.getRoomID();
      if (response.ok) {
        const roomId = await response.text();
        setTimeout(() => {
          setRoomId(roomId);
          setIsLoading(false);
        }, 400);
      } else {
        throw new Error("Error: could not get room ID");
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  };

  const copyToClipboard = async () => {
    if (roomId) {
      await navigator.clipboard.writeText(roomId);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    }
  };

  const shareRoomId = async () => {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.log(error);
    }
  };

  const goToPreviousPage = () => {
    navigate("/");
  };

  useEffect(() => {
    if (navigator.canShare(shareData)) {
      setCanShare(true);
    }
  }, []);

  return (
    <div className={styles.createRoom}>
      {error && (
        <div className={styles.error} role="error" aria-labelledby="error-msg">
          <p id="error-msg">{error}</p>
        </div>
      )}
      <main className={styles.mainContainer}>
        {!isLoading && roomId ? (
          <div className={styles.roomIdContainer}>
            <div className={styles.roomId}>
              <p>{roomId}</p>
              <button
                aria-label="Copy to clipboard"
                className={styles.copyBtn}
                onClick={copyToClipboard}
              >
                {showTooltip && <span className={styles.tooltip}>Copied!</span>}
                <CopyIcon />
              </button>
            </div>
            {canShare && (
              <button aria-label="Share room ID" className={styles.shareBtn} onClick={shareRoomId}>
                <ShareIcon />
              </button>
            )}
          </div>
        ) : (
          <div className={[styles.loaderContainer, !isLoading && styles.hide].join(" ")}>
            <LoaderIcon />
          </div>
        )}
        <div style={{ display: "flex" }}>
          <button aria-label="Get room ID" className={styles.btn} onClick={getRoomId}>
            Get Room ID
          </button>
          <button
            aria-label="Go back to previous page"
            className={styles.btn}
            onClick={goToPreviousPage}
          >
            <BackIcon />
          </button>
        </div>
      </main>
    </div>
  );
};
