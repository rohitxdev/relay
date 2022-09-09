import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EnterIcon from "@assets/icons/enter.svg";
import BackIcon from "@assets/icons/arrow-back.svg";
import styles from "./join-room.module.scss";
import { useError } from "@utils/hooks";
import { api } from "@services";

export const JoinRoom = () => {
  const navigate = useNavigate();
  const [error, setError] = useError();
  const [searchParams, _] = useSearchParams();
  const roomIdRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const verifyRoomId = async (roomId: string, username: string) => {
    try {
      const response = await api.verifyRoomId(roomId);
      if (!response.ok) {
        throw new Error("Invalid Room ID!");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(err);
      }
    }
  };

  const handleEnterRoom = async () => {
    try {
      if (roomIdRef.current?.value && usernameRef.current?.value) {
        await verifyRoomId(roomIdRef.current.value, usernameRef.current.value);
        navigate(`/room?roomId=${roomIdRef.current?.value}`, {
          state: { roomId: roomIdRef.current?.value, username: usernameRef.current?.value },
        });
      } else {
        setError("Room ID and Name cannot be empty!");
      }
    } catch (err) {
      if (err instanceof Error) {
        navigate("/");
        console.error(err);
        setError(err.message);
      }
    }
  };

  const handleBack = () => {
    history.back();
  };

  const enterKeyListener = async (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (roomIdRef.current?.value === "") {
        roomIdRef.current.focus();
      } else if (usernameRef.current?.value === "") {
        usernameRef.current.focus();
      } else if (roomIdRef.current?.value && usernameRef.current?.value) {
        handleEnterRoom();
      }
    }
  };

  useEffect(() => {
    if (roomIdRef.current) {
      roomIdRef.current.value = searchParams.get("roomId") ?? "";
    }
    window.addEventListener("keydown", enterKeyListener);
    return () => {
      window.removeEventListener("keydown", enterKeyListener);
      setError(null);
    };
  }, []);

  return (
    <div className={styles.joinRoom}>
      {error && (
        <p className="error" role="error">
          {error}
        </p>
      )}
      <div className={styles.enterInfo}>
        <div className={styles.enterRoomId}>
          <input aria-label="Enter room ID" type="text" maxLength={6} ref={roomIdRef} required />
          <span>Room ID</span>
        </div>
        <div className={styles.enterUsername}>
          <input aria-label="Enter username" type="text" maxLength={24} ref={usernameRef} required />
          <span>Name</span>
        </div>
        <div className={styles.btnContainer}>
          <button aria-label="Go back" className={styles.btn} onClick={handleBack}>
            <BackIcon />
          </button>
          <button className={styles.btn} onClick={handleEnterRoom}>
            Enter Room <EnterIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
