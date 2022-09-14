import styles from "./room.module.scss";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useRef } from "react";
import { ClientUser, Controls, RemoteUsers, ScreenShare } from "@components";
import { RoomContextProvider } from "@context";
import { useAppDispatch, useAppSelector, useError } from "@utils/hooks";
import { rearCameraIsAvailable, resetState, screenSharingIsAvailable } from "@store";
import { useNavigate } from "react-router-dom";
import { api } from "@services";

export const Room = () => {
  const navigate = useNavigate();
  const [_, setError] = useError();
  const dispatch = useAppDispatch();
  const roomId = sessionStorage.getItem("roomId");
  const username = sessionStorage.getItem("username");
  const screenUsername = `${username}'s screen`;
  const isVideoOn = useAppSelector((state) => state.room.isVideoOn);
  const isMicOn = useAppSelector((state) => state.room.isMicOn);
  const isSharingScreen = useAppSelector((state) => state.room.isSharingScreen);
  const facingMode = useAppSelector((state) => state.room.facingMode);
  const floatClient = useAppSelector((state) => state.room.floatClient);
  const { current: client } = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));

  const checkDeviceCapabilities = async () => {
    try {
      if ("getDisplayMedia" in navigator.mediaDevices) {
        dispatch(screenSharingIsAvailable());
      } else {
        console.info("💻 Screensharing is not available on this device.");
      }
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

  const enterRoom = async () => {
    try {
      if (roomId && username) {
        const response = await api.getAccessToken(roomId, username);
        const { appId, uid, accessToken } = await response.json();
        await client.join(appId, roomId, accessToken, uid);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (!roomId || !username) {
      navigate(-1);
    }
    checkDeviceCapabilities().then(() => {
      if (client.connectionState !== "CONNECTED" && client.connectionState !== "CONNECTING") {
        enterRoom();
      }
    });

    return () => {
      client.leave();
      console.clear();
      dispatch(resetState());
    };
  }, []);

  return (
    <>
      {roomId && username && (
        <RoomContextProvider value={{ username, screenUsername, client, roomId }}>
          <div className={styles.room}>
            <div className={[styles.userGrid, floatClient && styles.floatingClient].join(" ")}>
              {isSharingScreen && <ScreenShare />}
              <ClientUser isVideoOn={isVideoOn} isMicOn={isMicOn} facingMode={facingMode} />
              <RemoteUsers />
            </div>
            <Controls />
          </div>
        </RoomContextProvider>
      )}
    </>
  );
};

export default Room;
