import { useContext, useRef, useState } from "react";
import RenderIf from "./RenderIf";
import { PageContext } from "./AppContext";
import CopyIcon from "../assets/icons/copy-outline.svg";
import BackIcon from "../assets/icons/arrow-back-outline.svg";
import LoaderIcon from "../assets/icons/double-ring-loader.svg";
export default function CreateRoom() {
  const [roomId, setRoomId] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const { setPage } = useContext(PageContext);
  const tooltipRef = useRef<HTMLSpanElement | null>(null);

  const getRoomId = async () => {
    setShowLoading(true);
    const response = await fetch(`/api/get-room-id`);
    const roomId = await response.text();
    setTimeout(() => {
      setRoomId(roomId);
      setShowLoading(false);
    }, 500);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(roomId);
    if (tooltipRef.current) {
      tooltipRef.current.style.display = "unset";
      setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
        }
      }, 2000);
    }
  };

  const handleBack = async () => {
    if (setPage) {
      setPage("home");
    }
  };

  return (
    <div className="create-room">
      <div className="btn-container">
        <RenderIf isTrue={showLoading === false && roomId === ""}>
          <div style={{ height: "3em", margin: "2em 0" }}></div>
        </RenderIf>
        <RenderIf isTrue={showLoading === true}>
          <span className="loader">
            <LoaderIcon />
          </span>
        </RenderIf>
        <RenderIf isTrue={showLoading === false && roomId !== ""}>
          <div className="room-id">
            <p>{roomId}</p>
            <span className="tooltip" ref={tooltipRef}></span>
            <div style={{ display: "flex" }} onClick={copyToClipboard}>
              <CopyIcon />
            </div>
          </div>
        </RenderIf>
        <button className="btn" onClick={getRoomId}>
          Generate Room ID
        </button>
        <button className="btn" onClick={handleBack}>
          <BackIcon />
        </button>
      </div>
    </div>
  );
}
