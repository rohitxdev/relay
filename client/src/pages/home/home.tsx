import styles from "./home.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api-service";
import AddIcon from "@assets/icons/add.svg";
import PeopleIcon from "@assets/icons/people.svg";
import GithubIcon from "@assets/icons/github.svg";
import ShareIcon from "@assets/icons/share.svg";
import CopyIcon from "@assets/icons/copy.svg";
import LoaderIcon from "@assets/icons/loader.svg";
import Illustration from "@assets/images/video-conference.svg";
import { useError } from "@utils/hooks";

export const Home = () => {
  const navigate = useNavigate();
  const [error, setError] = useError();
  const [canShare, setCanShare] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  const shareData: ShareData = {
    title: "Relay: Free video conferencing for everyone",
    text: `\n\nYou've been invited to join a room on Relay!\n\nRoom ID is ${roomId}.`,
    url: `\n\n${window.location.href}join-room?roomId=${roomId}`,
  };

  const shareRoomId = async () => {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(err);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      if (roomId && !showTooltip) {
        await navigator.clipboard.writeText(roomId);
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
        }, 2000);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(err);
      }
    }
  };

  const getRoomId = async () => {
    try {
      setIsLoading(true);
      const response = await api.getRoomID();
      if (!response.ok) throw new Error("Could not get room ID!");
      const roomId = await response.text();
      setTimeout(() => {
        setRoomId(roomId);
        setIsLoading(false);
      }, 400);
    } catch (err) {
      if (err instanceof Error) {
        setIsLoading(false);
        setError(err.message);
        console.error(err);
      }
    }
  };

  const goToJoinRoom = () => {
    navigate("/join-room");
  };

  useEffect(() => {
    if ("share" in navigator && navigator.canShare(shareData)) {
      setCanShare(true);
    }
  }, []);

  return (
    <div className={styles.home}>
      {error && (
        <p className="error" role="error">
          {error}
        </p>
      )}
      <a
        aria-label="Link to Github profile"
        href="https://github.com/rohitman47"
        target="_blank"
        className={styles.githubLink}
      >
        <GithubIcon />
      </a>
      <section className={styles.banner} role="banner" aria-label="Page banner">
        <div className={styles.appName}>
          <p>Relay</p>
          <img src="./relay-logo.png" alt="Logo" />
        </div>
        <p className={styles.appDescription}>Free Video Conferencing for Everyone</p>
      </section>
      <div className={styles.mainContainer}>
        <div className={styles.illustration} data-attribution="https://storyset.com/web">
          <Illustration />
        </div>
        <main className={[styles.btnContainer, styles.animateBtns].join(" ")}>
          <div className={styles.roomIdContainer}>
            {!isLoading && roomId ? (
              <>
                <div className={styles.roomId}>
                  <p>{roomId}</p>
                  <button aria-label="Copy room ID to clipboard" className={styles.copyBtn} onClick={copyToClipboard}>
                    {showTooltip && <span className={styles.tooltip}>Copied!</span>}
                    <CopyIcon />
                  </button>
                </div>
                {canShare && (
                  <button aria-label="Share room ID" className={styles.shareBtn} onClick={shareRoomId}>
                    <ShareIcon />
                  </button>
                )}
              </>
            ) : (
              <div className={styles.loader}>{isLoading && <LoaderIcon />}</div>
            )}
          </div>
          <button className={styles.btn} onClick={getRoomId}>
            Create Room <AddIcon />
          </button>
          <button className={styles.btn} onClick={goToJoinRoom}>
            Join Room <PeopleIcon />
          </button>
        </main>
      </div>
    </div>
  );
};
