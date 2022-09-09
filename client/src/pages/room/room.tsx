import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ClientVideo, Controls, ErrorAlert, RemoteUsers, ScreenShare } from "@components";
import { RoomContextProvider } from "@context";
import { useAppDispatch, useAppSelector, useError } from "@utils/hooks";
import { rearCameraIsAvailable, resetState, screenSharingIsAvailable } from "@store";
import { api } from "@services";

export const Room = () => {
  const {
    state: { roomId, username },
  } = useLocation() as { state: RoomLocationState };
  const navigate = useNavigate();
  const screenUsername = `${username}'s screen`;
  const dispatch = useAppDispatch();
  const [error, setError] = useError();
  const isVideoOn = useAppSelector((state) => state.room.isVideoOn);
  const isMicOn = useAppSelector((state) => state.room.isMicOn);
  const isSharingScreen = useAppSelector((state) => state.room.isSharingScreen);
  const facingMode = useAppSelector((state) => state.room.facingMode);
  const { current: client } = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));

  const checkDeviceCapabilities = async () => {
    if ("getDisplayMedia" in navigator.mediaDevices) {
      dispatch(screenSharingIsAvailable());
    } else {
      console.info("💻 Screensharing is not available on this device.");
    }
    try {
      const tracks = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
        audio: false,
      });
      tracks.getVideoTracks().forEach((track) => {
        track.stop();
      });
      dispatch(rearCameraIsAvailable());
    } catch (err) {
      console.info("📷 Rear camera is not available on this device.");
    }
  };

  const enterRoom = async (roomId: string, username: string) => {
    try {
      const response = await api.getAccessToken(roomId, username);
      const { appId, uid, accessToken } = await response.json();
      await client.join(appId, roomId, accessToken, uid);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (roomId && username) {
      checkDeviceCapabilities().finally(() => {
        enterRoom(roomId, username);
      });
    } else {
      navigate("/");
    }

    return () => {
      client.leave();
      dispatch(resetState());
    };
  }, []);

  if (!roomId || !username) {
    return <Navigate to="/" replace={true} state={null} />;
  }

  return (
    <RoomContextProvider value={{ roomId, username, screenUsername, client }}>
      <div className={styles.room}>
        <ErrorAlert error={error} />
        <div className={styles.userGrid}>
          {isSharingScreen && <ScreenShare />}
          <ClientVideo isVideoOn={isVideoOn} isMicOn={isMicOn} facingMode={facingMode} />
          <RemoteUsers />
        </div>
        <Controls />
      </div>
    </RoomContextProvider>
  );
};
