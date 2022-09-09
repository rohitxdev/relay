import styles from "./error-alert.module.scss";
import ErrorIcon from "@assets/icons/error.svg";

export const ErrorAlert = ({ error }: { error: string | null }) => {
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
