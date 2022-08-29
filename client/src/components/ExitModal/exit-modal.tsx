import { useRoomContext } from "@utils/hooks/useRoomContext";
import { useNavigate } from "react-router-dom";
import styles from "./exit-modal.module.scss";

export const ExitModal = ({ roomDispatch }: { roomDispatch: React.Dispatch<RoomAction> }) => {
  const navigate = useNavigate();
  const { client } = useRoomContext();

  const stayInRoom = () => {
    roomDispatch({ type: "TOGGLE_EXIT_MODAL" });
  };

  const exitRoom = async () => {
    await client.leave();
    navigate("/");
  };

  return (
    <div className={styles.exitModalParent}>
      <div className={styles.exitModal} role="alert">
        <p>Are you sure you want to leave the room?</p>
        <div>
          <button className={styles.stayBtn} onClick={stayInRoom}>
            Stay
          </button>
          <button className={styles.leaveBtn} onClick={exitRoom}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};
