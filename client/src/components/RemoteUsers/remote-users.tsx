import { memo, useEffect, useRef, useState } from "react";
import { User } from "@components";
import { useAppContext, useRoomContext } from "@hooks";
import callJoinTone from "@assets/audio/call-join.mp3";
import callLeftTone from "@assets/audio/call-leave.mp3";
import { IAgoraRTCClient, IRemoteAudioTrack, IRemoteVideoTrack, UID } from "agora-rtc-sdk-ng";
import { api } from "@helpers";

interface IRemoteUser {
  uid: UID;
  username: string;
  remoteVideoTrack: IRemoteVideoTrack | null;
  remoteAudioTrack: IRemoteAudioTrack | null;
}

export const RemoteUsers = memo(({ client }: { client: IAgoraRTCClient }) => {
  const {
    roomState: { floatClient },
    roomDispatch,
  } = useRoomContext();
  const {
    appState: { username },
  } = useAppContext();
  const screenUid = useRef<UID | null>(null);
  const screenUsername = `${username}'s screen`;
  const [remoteUsers, setRemoteUsers] = useState<IRemoteUser[]>([]);
  const userLeftTone = new Audio(callLeftTone);
  const userJoinedTone = new Audio(callJoinTone);
  userJoinedTone.volume = 0.3;
  userLeftTone.volume = 0.3;

  useEffect(() => {
    client.on("user-joined", async (user) => {
      const res = await api.getUsername(user.uid as string);
      const username = await res.text();
      setRemoteUsers((prevUsers) => [
        ...prevUsers,
        {
          uid: user.uid,
          username,
          remoteAudioTrack: user.audioTrack ? user.audioTrack : null,
          remoteVideoTrack: user.videoTrack ? user.videoTrack : null,
        },
      ]);
      if (username !== screenUsername) {
        await userJoinedTone.play();
      } else {
        screenUid.current = user.uid;
      }
    });

    client.on("user-left", async (user) => {
      setRemoteUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser.uid !== user.uid));
      await api.deleteUsername(user.uid as string);
      if (user.uid !== screenUid.current) {
        await userLeftTone.play();
      }
    });

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio") {
        setRemoteUsers((prevUsers) =>
          prevUsers.map((prevUser) => {
            if (prevUser.uid === user.uid) {
              prevUser.remoteAudioTrack = user.audioTrack ? user.audioTrack : null;
            }
            return prevUser;
          })
        );
      }
      if (mediaType === "video") {
        setRemoteUsers((prevUsers) =>
          prevUsers.map((prevUser) => {
            if (prevUser.uid === user.uid) {
              prevUser.remoteVideoTrack = user.videoTrack ? user.videoTrack : null;
            }
            return prevUser;
          })
        );
      }
    });
    client.on("user-unpublished", async (user, mediaType) => {
      if (mediaType === "audio") {
        setRemoteUsers((prevUsers) =>
          prevUsers.map((prevUser) => {
            if (prevUser.uid === user.uid) {
              prevUser.remoteAudioTrack = null;
            }
            return prevUser;
          })
        );
      }
      if (mediaType === "video") {
        setRemoteUsers((prevUsers) =>
          prevUsers.map((prevUser) => {
            if (prevUser.uid === user.uid) {
              prevUser.remoteVideoTrack = null;
            }
            return prevUser;
          })
        );
      }
    });

    return () => {
      client.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (remoteUsers.length === 1) {
      roomDispatch({ type: "toggleFloatClient", payload: true });
    } else {
      if (floatClient) {
        roomDispatch({ type: "toggleFloatClient", payload: false });
      }
    }
  }, [remoteUsers]);
  return (
    <>
      {remoteUsers.map(({ uid, username, remoteAudioTrack, remoteVideoTrack }) => {
        if (username === screenUsername) return null;
        return <User key={uid} username={username} audioTrack={remoteAudioTrack} videoTrack={remoteVideoTrack} />;
      })}
    </>
  );
});
