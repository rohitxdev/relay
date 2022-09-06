import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EnterIcon from "@assets/icons/enter.svg";
import BackIcon from "@assets/icons/arrow-back.svg";
import styles from "./join-room.module.scss";
import { api } from "@services";
import { useAppContext } from "@utils/hooks";

export const JoinRoom = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const { error, setError } = useAppContext();
  const roomIdRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const verifyRoomId = async (roomId: string) => {
    try {
      const response = await api.verifyRoomId(roomId);
      if (response.ok) {
        sessionStorage.setItem("roomId", roomId);
        sessionStorage.setItem("username", usernameRef.current?.value ?? "");
        navigate(`/room?room-id=${roomId}`);
      } else {
        throw new Error("Invalid Room ID!");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error(err);
    }
  };

  const handleEnterRoom = async () => {
    if (roomIdRef.current?.value && usernameRef.current?.value) {
      verifyRoomId(roomIdRef.current.value);
    } else {
      setError("Room ID and Name cannot be empty!");
    }
  };

  const handleBack = () => {
    history.back();
  };

  const handleEnter = async (e: KeyboardEvent) => {
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
    window.addEventListener("keydown", handleEnter);
    return () => {
      window.removeEventListener("keydown", handleEnter);
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
          <input type="text" maxLength={6} ref={roomIdRef} required />
          <span>Room ID</span>
        </div>
        <div className={styles.enterUsername}>
          <input type="text" maxLength={24} ref={usernameRef} required />
          <span>Name</span>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btn} onClick={handleBack}>
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
