import styles from "./home.module.scss";
import { useLocation } from "react-router-dom";
import { CSSProperties, useEffect, useState } from "react";
import { api } from "@helpers";
import AddIcon from "@assets/icons/add.svg";
import PeopleIcon from "@assets/icons/people.svg";
import GithubIcon from "@assets/icons/github.svg";
import ShareIcon from "@assets/icons/share.svg";
import CopyIcon from "@assets/icons/copy.svg";
import LoaderIcon from "@assets/icons/loader.svg";
import Illustration from "@assets/images/video-conference.svg";
import { useError, useAppContext, useViewportSize } from "@hooks";
import { AuthModal, JoinRoomModal, Profile } from "@components";

export const Home = () => {
  const {
    appState: { canShareLink, canCopyToClipboard },
    appDispatch,
  } = useAppContext();
  const { setError } = useError();
  const { vh, vw } = useViewportSize();

  const { state } = useLocation() as { state: { error?: string } };
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  const shareData: ShareData = {
    title: "Relay: Free Video Conferencing",
    text: `You've been invited to join a room on Relay!\n\nRoom ID is ${roomId}.\n\n`,
    url: `${window.location.href}join-room?roomId=${roomId}`,
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
      const res = await api.getRoomID();
      if (!res.ok) throw new Error("Could not get room ID.");
      const roomId = await res.text();
      setRoomId(roomId);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJoinRoomModal = () => {
    return setShowJoinRoomModal((state) => !state);
  };

  useEffect(() => {
    if (state?.error) {
      setError(state.error);
      history.replaceState({}, document.title);
    }
    appDispatch({ type: "setCanShareLink", payload: "share" in navigator && navigator.canShare(shareData) });
    appDispatch({
      type: "setCanShareScreen",
      payload: "mediaDevices" in navigator && "getDisplayMedia" in navigator.mediaDevices,
    });
    appDispatch({
      type: "setCanCopyToClipboard",
      payload: "clipboard" in navigator && "writeText" in navigator.clipboard,
    });
    if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: { exact: "environment" } },
          audio: false,
        })
        .then((tracks) => {
          tracks.getVideoTracks().forEach((track) => {
            track.stop();
          });
          appDispatch({ type: "setCanUseRearCamera", payload: true });
        })
        .catch(() => {
          appDispatch({ type: "setCanUseRearCamera", payload: false });
        });
    }
  }, []);

  return (
    <div className={styles.home} style={{ "--vh": vh + "px", "--vw": vw + "px" } as CSSProperties}>
      <a
        aria-label="Link to Github profile"
        href="https://github.com/rohitman47"
        target="_blank"
        className={styles.githubLink}
      >
        <GithubIcon />
      </a>
      <Profile />
      <section className={styles.banner} role="banner" aria-label="Page banner">
        <div className={styles.appName}>
          <p>Relay</p>
          <img src="./relay-256x256.png" alt="Logo" />
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
                  {canCopyToClipboard && (
                    <button aria-label="Copy room ID to clipboard" className={styles.copyBtn} onClick={copyToClipboard}>
                      <span className={[styles.tooltip, !showTooltip && styles.hide].join(" ")}>Copied!</span>
                      <CopyIcon />
                    </button>
                  )}
                </div>
                {canShareLink && (
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
          <button className={styles.btn} onClick={toggleJoinRoomModal}>
            Join Room <PeopleIcon />
          </button>
        </main>
      </div>
      <JoinRoomModal showModal={showJoinRoomModal} setShowModal={setShowJoinRoomModal} />
    </div>
  );
};
