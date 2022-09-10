import styles from "./error-alert.module.scss";
import ErrorIcon from "@assets/icons/error.svg";
import { useError } from "@utils/hooks";

export const ErrorAlert = () => {
  const [error, _] = useError();
  return (
    <>
      {error && (
        <section role="alert" aria-label="Error" aria-describedby="error-msg" className={styles.error}>
          <ErrorIcon />
          <p id="error-msg">{error}</p>
        </section>
      )}
    </>
  );
};
