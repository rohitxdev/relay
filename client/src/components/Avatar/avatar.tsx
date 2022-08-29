import { useRoomContext } from "@utils/hooks/useRoomContext";
import styles from "./avatar.module.scss";

export const Avatar = ({ username }: { username?: string }) => {
  const { username: clientUsername } = useRoomContext();
  const initials = (username ? username : clientUsername)
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.avatarContainer}>
      <div className={styles.avatar}>
        <p>{initials}</p>
      </div>
    </div>
  );
};
