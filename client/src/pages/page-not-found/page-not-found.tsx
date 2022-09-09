import styles from "./page-not-found.module.scss";
import Illustration404 from "@assets/images/404-lost-in-space.svg";
import { useNavigate } from "react-router-dom";

export const PageNotFound = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/");
  };
  return (
    <div className={styles.page}>
      <div className={styles.illustration} data-attribution="https://storyset.com/web">
        <Illustration404 />
      </div>
      <button className={styles.backBtn} onClick={goToHomePage}>
        Go to home page
      </button>
    </div>
  );
};
