import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EnterIcon from "@assets/icons/enter.svg";
import BackIcon from "@assets/icons/arrow-back.svg";
import styles from "./join-room.module.scss";
import { api } from "@services";

export const JoinRoom = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const roomIdRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const showError = (error: string) => {
    setError(error);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const verifyRoomId = async (roomId: string) => {
    const res = await api.verifyRoomId(roomId);
    if (res.status === 200) {
      sessionStorage.setItem("roomId", roomId);
      sessionStorage.setItem("username", "" + usernameRef.current?.value);
      navigate(`/room?room-id=${roomId}`);
    } else {
      showError("Invalid Room ID!");
    }
  };

  const handleEnterRoom = async () => {
    if (roomIdRef.current?.value && usernameRef.current?.value) {
      verifyRoomId(roomIdRef.current.value);
    } else {
      showError("Room ID and Name cannot be empty!");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleKeyPress = async (e: KeyboardEvent) => {
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
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className={styles.joinRoom}>
      <div className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.enterRoomId}>
          <input type="text" maxLength={6} ref={roomIdRef} required />
          <span>Room ID</span>
        </div>
        <div className={styles.enterUsername}>
          <input type="text" maxLength={24} ref={usernameRef} required />
          <span>Name</span>
        </div>
        <div className={"btn-container"}>
          <button className={"btn"} onClick={handleEnterRoom}>
            Enter Room <EnterIcon />
          </button>
          <button className={"btn"} onClick={handleBack}>
            <BackIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
