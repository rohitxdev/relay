import styles from "./error-dialog.module.scss";
import ErrorIcon from "@assets/icons/error.svg";
import { useAppContext } from "@hooks";

export const ErrorDialog = () => {
  const {
    appState: { error },
  } = useAppContext();
  return (
    <>
      {error && (
        <section role="alert-dialog" aria-label="Error" aria-describedby="error-msg" className={styles.error}>
          <ErrorIcon />
          <p id="error-msg">{error}</p>
        </section>
      )}
    </>
  );
};
