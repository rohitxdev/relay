import { SERVER_URL } from "../pages/index";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContext } from "./AppContext";
import EnterIcon from "../assets/icons/enter-outline.svg";
import BackIcon from "../assets/icons/arrow-back-outline.svg";

export default function JoinRoom() {
  const navigate = useNavigate();
  const { setPage } = useContext(PageContext);
  const [errorMessage, setErrorMessage] = useState("");
  const roomIdRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const invalidRef = useRef<HTMLDivElement>(null);

  const showError = async (error: string) => {
    setErrorMessage(error);
    if (invalidRef.current) {
      invalidRef.current.style.display = "unset";
      invalidRef.current.classList.add("error");
      setTimeout(() => {
        if (invalidRef.current) {
          invalidRef.current.classList.remove("error");
          invalidRef.current.style.display = "none";
        }
      }, 2000);
    }
  };

  const verifyRoomId = async (roomId: string) => {
    const response = await fetch(`${SERVER_URL}/api/verify-room-id?roomId=${roomId}`);
    const isVerified = await response.text();
    if (isVerified === "true") {
      sessionStorage.setItem("spark-vc-room-id", roomId);
      navigate(`/join-room?roomId=${roomId}&username=${usernameRef.current?.value}`);
    } else {
      showError("Invalid Room ID!");
    }
  };

  const handleEnterRoom = async () => {
    if (roomIdRef.current && usernameRef.current?.value !== "") {
      verifyRoomId(roomIdRef.current.value);
    }
    if (roomIdRef.current?.value === "" || usernameRef.current?.value === "") {
      showError("Room ID and Name cannot be empty!");
    }
  };

  const handleBack = async () => {
    if (setPage) {
      setPage("home");
    }
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
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  return (
    <div className="join-room">
      <div className="user-container">
        <div style={{ display: "none" }} ref={invalidRef}>
          <p>{errorMessage}</p>
        </div>
        <div className="enter-room-id">
          <input type="text" maxLength={8} ref={roomIdRef} required />
          <span>Room ID</span>
        </div>
        <div className="enter-username">
          <input type="text" maxLength={15} ref={usernameRef} required />
          <span>Name</span>
        </div>
        <div className="btn-container">
          <button className="btn" onClick={handleEnterRoom}>
            Enter Room <EnterIcon />
          </button>
          <button className="btn" onClick={handleBack}>
            <BackIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
