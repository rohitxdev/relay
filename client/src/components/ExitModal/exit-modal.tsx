import styles from "./exit-modal.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const ExitModal = ({ toggleExitModal }: { toggleExitModal: () => void }) => {
  const navigate = useNavigate();

  const exitRoom = async () => {
    navigate("/");
  };

  const escapeKeyHandler = (e: globalThis.KeyboardEvent) => {
    if (e.key === "Escape") {
      toggleExitModal();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", escapeKeyHandler);
    return () => {
      window.removeEventListener("keydown", escapeKeyHandler);
    };
  });

  return (
    <div className={styles.exitModalContainer}>
      <section aria-label="Exit modal" role="alertdialog" className={styles.exitModal}>
        <p>Are you sure you want to leave the room?</p>
        <div className={styles.options}>
          <button className={styles.stayBtn} onClick={toggleExitModal}>
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
