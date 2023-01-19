import styles from "./join-room-modal.module.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import EnterIcon from "@assets/icons/enter.svg";
import BackIcon from "@assets/icons/arrow-back.svg";
import CrossIcon from "@assets/icons/cross.svg";
import { useAppContext, useError } from "@hooks";
import { api } from "@helpers";
import { useEffect } from "react";

export const JoinRoomModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    appState: { roomId },
    appDispatch,
  } = useAppContext();
  const { setError } = useError();
  const navigate = useNavigate();
  const [searchParams, _setSearchParams] = useSearchParams();

  const toggleJoinRoomModal = () => {
    setShowModal((state) => !state);
  };

  const handleEnterRoom: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
    const { roomId, username } = formData as Record<string, string>;
    try {
      const res = await api.verifyRoomId(roomId);
      if (!res.ok) {
        throw new Error("Invalid Room ID.");
      }
      appDispatch({ type: "setRoomId", payload: roomId });
      appDispatch({ type: "setUsername", payload: username });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const escapeHandler = (e: KeyboardEvent) => {
      if (showModal && e.key === "Escape") {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", escapeHandler);

    return () => {
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [showModal]);

  useEffect(() => {
    if (roomId) {
      navigate("/room");
    }
  }, [roomId]);

  return (
    <div className={[styles.container, !showModal && styles.hide].join(" ")} onClick={toggleJoinRoomModal}>
      <form
        className={styles.joinRoom}
        onSubmit={handleEnterRoom}
        onClick={(e) => e.stopPropagation()}
        autoComplete="off"
      >
        <button aria-label="Go back" className={styles.closeBtn} type="button" onClick={toggleJoinRoomModal}>
          <CrossIcon />
        </button>
        <div className={styles.enterInfo}>
          <div className={styles.enterRoomId}>
            <input
              aria-label="Enter room ID"
              type="text"
              name="roomId"
              maxLength={6}
              defaultValue={searchParams.get("roomId")?.slice(0, 6) ?? ""}
              required
            />
            <span>Room ID</span>
          </div>
          <div className={styles.enterUsername}>
            <input aria-label="Enter username" type="text" name="username" maxLength={24} required />
            <span>Name</span>
          </div>
          <div className={styles.btnContainer}>
            <button className={styles.btn} type="submit">
              Enter Room <EnterIcon />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
