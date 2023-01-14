import styles from "./join-room.module.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import EnterIcon from "@assets/icons/enter.svg";
import BackIcon from "@assets/icons/arrow-back.svg";
import { useAppContext, useError } from "@hooks";
import { api } from "@helpers";

export const JoinRoom = () => {
  const { appDispatch } = useAppContext();
  const { setErrorMessage } = useError();
  const navigate = useNavigate();
  const [searchParams, _setSearchParams] = useSearchParams();

  const handleEnterRoom: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
    const { roomId, username } = formData as Record<string, string>;
    try {
      const res = await api.verifyRoomId(roomId);
      if (!res.ok) {
        throw new Error("Invalid Room ID.");
      }
      appDispatch({ type: "setRoomId", payload: roomId });
      appDispatch({ type: "setUsername", payload: username });
      setTimeout(() => {
        navigate(`/room`);
      }, 0);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        console.error(err);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <form className={styles.joinRoom} onSubmit={handleEnterRoom} autoComplete="off">
        <div className={styles.enterInfo}>
          <div className={styles.enterRoomId}>
            <input
              aria-label="Enter room ID"
              type="text"
              name="roomId"
              maxLength={6}
              defaultValue={searchParams.get("roomId")?.slice(0, 6) ?? ""}
              required
            />
            <span>Room ID</span>
          </div>
          <div className={styles.enterUsername}>
            <input aria-label="Enter username" type="text" name="username" maxLength={24} required />
            <span>Name</span>
          </div>
          <div className={styles.btnContainer}>
            <button aria-label="Go back" className={styles.btn} type="button" onClick={handleBack}>
              <BackIcon />
            </button>
            <button className={styles.btn} type="submit">
              Enter Room <EnterIcon />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
