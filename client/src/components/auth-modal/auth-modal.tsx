import { useState } from "react";
import styles from "./auth-modal.module.scss";
import EyeIcon from "@assets/icons/eye.svg";
import EyeOffIcon from "@assets/icons/eye-off.svg";

export function AuthModal({ type }: { type: "log-in" | "sign-up" }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (formData.password !== formData["confirm-password"]) {
      return alert("Passwords dont match");
    }
    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.text();
      if (!res.ok) {
        throw new Error(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return (
    <form className={styles.authModal} onSubmit={formSubmitHandler} autoComplete="off">
      <div className={styles.inputComponent}>
        <input type="text" name="username" required />
        <span>Username</span>
      </div>
      <div className={styles.inputComponent}>
        <input type="text" name="email" required />
        <span>Email</span>
      </div>
      <div className={styles.inputComponent}>
        <input type={showPassword ? "text" : "password"} name="password" required />
        <span>Password</span>
        <button type="button" onClick={() => setShowPassword((state) => !state)}>
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
      <div className={styles.inputComponent}>
        <input type={showConfirmPassword ? "text" : "password"} name="confirm-password" required />
        <span>Confirm Password</span>
        <button type="button" onClick={() => setShowConfirmPassword((state) => !state)}>
          {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
}
