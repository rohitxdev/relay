import { memo, useEffect, useRef, useState } from "react";
import { RemoteVideo } from "@components";
import { useRoomContext } from "@utils/hooks/useRoomContext";
import callJoinTone from "@assets/audio/call-join.mp3";
import callLeftTone from "@assets/audio/call-leave.mp3";
import { UID } from "agora-rtc-sdk-ng";
import { api } from "@services";

export const RemoteUsers = memo(() => {
  const screenUid = useRef<UID | null>(null);
  const { client, screenUsername } = useRoomContext();
  const [remoteUsers, setRemoteUsers] = useState<IRemoteUser[]>([]);
  const userLeftTone = new Audio(callLeftTone);
  const userJoinedTone = new Audio(callJoinTone);
  userJoinedTone.volume = 0.4;
  userLeftTone.volume = 0.4;

  useEffect(() => {
    client.on("user-joined", async (user) => {
      const res = await api.getUsername(user.uid as string);
      const username = await res.text();
      setRemoteUsers((prevUsers) => [
        ...prevUsers,
        {
          uid: user.uid,
          username: username,
          remoteAudioTrack: user.audioTrack,
          remoteVideoTrack: user.videoTrack,
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
              prevUser.remoteAudioTrack = user.audioTrack;
            }
            return prevUser;
          })
        );
      }
      if (mediaType === "video") {
        setRemoteUsers((prevUsers) =>
          prevUsers.map((prevUser) => {
            if (prevUser.uid === user.uid) {
              prevUser.remoteVideoTrack = user.videoTrack;
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
              delete prevUser.remoteAudioTrack;
            }
            return prevUser;
          })
        );
      }
      if (mediaType === "video") {
        setRemoteUsers((prevUsers) =>
          prevUsers.map((prevUser) => {
            if (prevUser.uid === user.uid) {
              delete prevUser.remoteVideoTrack;
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

  return (
    <>
      {remoteUsers.map((remoteUser) => {
        if (remoteUser.username === screenUsername) return null;
        return (
          <RemoteVideo
            remoteAudioTrack={remoteUser.remoteAudioTrack}
            remoteVideoTrack={remoteUser.remoteVideoTrack}
            username={remoteUser.username}
            key={remoteUser.uid}
          />
        );
      })}
    </>
  );
});
