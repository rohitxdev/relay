import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import { useAppContext, useError, useRoomContext } from "../../hooks";
import { User } from "@components";
import { api } from "@helpers";

export const ScreenShare = () => {
  const {
    appState: { roomId, username },
  } = useAppContext();
  const { roomDispatch } = useRoomContext();
  const { setErrorMessage } = useError();
  const screenUsername = `${username}'s screen`;
  const [isPublished, setIsPublished] = useState(false);
  const screenClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [screenVideoTrack, setScreenVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [screenAudioTrack, setScreenAudioTrack] = useState<ILocalAudioTrack | null>(null);

  const acquireTracks = async () => {
    try {
      const mediaTracks = await AgoraRTC.createScreenVideoTrack(
        { optimizationMode: "detail", encoderConfig: "1080p_2" },
        "auto"
      );
      if (Array.isArray(mediaTracks)) {
        setScreenVideoTrack(mediaTracks[0]);
        setScreenAudioTrack(mediaTracks[1]);
      } else {
        setScreenVideoTrack(mediaTracks);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setErrorMessage(err.message);
        roomDispatch({ type: "toggleScreenShare" });
      }
    }
  };

  const joinRoomAsUser = async () => {
    if (roomId && screenClient.current.connectionState !== "CONNECTED") {
      const response = await api.getAgoraAccessToken(roomId, screenUsername);
      const { appId, uid, accessToken } = await response.json();
      await screenClient.current.join(appId, roomId, accessToken, uid);
    }
  };

  const publishTracks = async () => {
    if (!isPublished) {
      if (screenVideoTrack) {
        await screenClient.current.publish(screenVideoTrack);
      }
      if (screenAudioTrack) {
        await screenClient.current.publish(screenAudioTrack);
      }
      setIsPublished(true);
    }
  };

  const shareScreen = async () => {
    try {
      await joinRoomAsUser();
      await publishTracks();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setErrorMessage(err.message);
      }
    }
  };

  useEffect(() => {
    if (screenVideoTrack) {
      shareScreen();
    }
    return () => {
      screenVideoTrack?.close();
      screenAudioTrack?.close();
    };
  }, [screenVideoTrack]);

  useEffect(() => {
    acquireTracks();

    return () => {
      if (screenClient.current.connectionState === "CONNECTED") {
        screenClient.current.leave();
      }
    };
  }, []);

  return <>{screenVideoTrack && <User username={screenUsername} audioTrack={null} videoTrack={screenVideoTrack} />}</>;
};
