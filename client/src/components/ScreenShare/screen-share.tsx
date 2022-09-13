import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import { useRoomContext, useAppDispatch, useError } from "@utils/hooks";
import { toggleScreenShare } from "@store";
import { User } from "@components";
import { api } from "@services";

export const ScreenShare = () => {
  const dispatch = useAppDispatch();
  const [_, setError] = useError();
  const { roomId, screenUsername } = useRoomContext();
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
        setError(err.message);
        dispatch(toggleScreenShare());
      }
    }
  };

  const joinRoomAsUser = async () => {
    if (screenClient.current.connectionState !== "CONNECTED") {
      const response = await api.getAccessToken(roomId, screenUsername);
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
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (screenVideoTrack) {
      shareScreen();
    }
  }, [screenVideoTrack]);

  useEffect(() => {
    acquireTracks();

    return () => {
      screenVideoTrack?.close();
      screenAudioTrack?.close();
      if (screenClient.current.connectionState === "CONNECTED") {
        screenClient.current.leave();
      }
    };
  }, []);

  return <>{screenVideoTrack && <User username={screenUsername} audioTrack={null} videoTrack={screenVideoTrack} />}</>;
};
