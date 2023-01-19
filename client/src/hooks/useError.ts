import { useEffect } from "react";
import { useAppContext } from "./useAppContext";

export function useError(timer: number = 3000) {
  const {
    appState: { error },
    appDispatch,
  } = useAppContext();

  const setError = (err: string | null) => {
    if (!error) {
      appDispatch({ type: "setError", payload: err });
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        appDispatch({ type: "setError", payload: null });
      }, timer);
    }
  }, [error]);

  return { error, setError };
}
