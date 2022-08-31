import { useRoomContext } from "@utils/hooks/useRoomContext";
import styles from "./user-icon.module.scss";

export const UserIcon = ({ username }: { username?: string }) => {
  const { username: clientUsername } = useRoomContext();
  const initials = (username ? username : clientUsername)
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.userIconContainer}>
      <div className={styles.userIcon}>
        <p>{initials}</p>
      </div>
    </div>
  );
};
