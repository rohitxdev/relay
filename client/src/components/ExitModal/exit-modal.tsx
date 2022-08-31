import { useNavigate } from "react-router-dom";
import styles from "./exit-modal.module.scss";

export const ExitModal = ({ dispatch }: { dispatch: React.Dispatch<RoomAction> }) => {
  const navigate = useNavigate();

  const stayInRoom = () => {
    dispatch({ type: "TOGGLE_EXIT_MODAL" });
  };

  const exitRoom = async () => {
    navigate("/");
  };

  return (
    <div className={styles.exitModalContainer}>
      <section aria-label="Exit modal" role="alertdialog" className={styles.exitModal}>
        <p>Are you sure you want to leave the room?</p>
        <div className={styles.options}>
          <button className={styles.stayBtn} onClick={stayInRoom}>
            Stay
          </button>
          <button className={styles.leaveBtn} onClick={exitRoom}>
            Leave
          </button>
        </div>
      </section>
    </div>
  );
};
