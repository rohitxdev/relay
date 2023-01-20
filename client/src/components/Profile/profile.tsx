import styles from "./profile.module.scss";
import UserIcon from "@assets/icons/user.svg";
import { useEffect, useState } from "react";
import { api } from "@helpers";
import { useAppContext, useAuth, useError } from "@hooks";
import { AuthModal } from "@components";

export function Profile() {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setError } = useError();
  const {
    appState: { accessToken },
  } = useAppContext();
  const toggleProfileOptionsVisibility = () => {
    setShowProfileOptions((state) => !state);
  };

  const logOutHandler = async () => {
    try {
      const res = await api.logOut();
      if (!res.ok) {
        throw new Error("Could not log out.");
      }
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

  useEffect(() => {
    window.addEventListener("keydown", escapeHandler);
    return () => {
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [showAuthModal]);

  return (
    <>
      <div className={styles.profile}>
        <button onClick={toggleProfileOptionsVisibility}>
          <UserIcon />
        </button>
        <div className={[styles.options, !showProfileOptions && styles.hide].join(" ")}>
          {accessToken ? (
            <>
              <button>Change username</button>
              <button>Change password</button>
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
