import styles from "./profile.module.scss";
import UserIcon from "@assets/icons/user.svg";
import { useEffect, useState } from "react";
import { api } from "@helpers";
import { useApi, useAppContext, useAuthContext, useError } from "@hooks";
import { AuthModal } from "@components";

export function Profile() {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setError } = useError();
  const {
    authState: { accessToken, isLoggedIn },
    authDispatch,
  } = useAuthContext();
  const {
    appState: { username },
  } = useAppContext();

  const { changeUsername } = useApi();
  const toggleProfileOptionsVisibility = () => {
    setShowProfileOptions((state) => !state);
  };

  const logOutHandler = async () => {
    try {
      const res = await api.logOut();
      if (!res.ok) {
        throw new Error("Could not log out.");
      }
      authDispatch({ type: "setIsLoggedIn", payload: false });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };
  const escapeHandler = (e: KeyboardEvent) => {
    if (showAuthModal && e.key === "Escape") {
      setShowAuthModal(false);
    }
  };

  const changeUsernameHandler = async () => {
    // const res = await changeUsername("");
    // if (!res.ok) {
    //   throw new Error("Could not change username.");
    // }
  };

  const resetPasswordHandler = async () => {};

  useEffect(() => {
    window.addEventListener("keydown", escapeHandler);
    return () => {
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [showAuthModal]);

  useEffect(() => {
    setShowProfileOptions(false);
  }, [isLoggedIn]);

  return (
    <>
      <div className={styles.profile}>
        <button onClick={toggleProfileOptionsVisibility}>
          <UserIcon />
        </button>
        <div className={[styles.options, !showProfileOptions && styles.hide].join(" ")}>
          {isLoggedIn ? (
            <>
              <p className={styles.username}>{username}</p>
              <button onClick={changeUsernameHandler}>Change username</button>
              <button onClick={resetPasswordHandler}>Change password</button>
              <button onClick={logOutHandler}>Log out</button>
            </>
          ) : (
            <button onClick={() => setShowAuthModal(true)}>Log In / Sign Up</button>
          )}
        </div>
      </div>
      <AuthModal showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
    </>
  );
}
