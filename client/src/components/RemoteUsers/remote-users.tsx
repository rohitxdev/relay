import { IRemoteVideoTrack, IRemoteAudioTrack, UID, IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { memo, useEffect, useState } from "react";
import discordJoinedTone from "@assets/audio/call-join.mp3";
import discordLeftTone from "@assets/audio/call-leave.mp3";
import { RemoteUser } from "./remote-video";
import { fetchData } from "@utils/helpers/fetchData";
import { useRoomContext } from "@utils/hooks/useRoomContext";

export interface IRemoteUser {
  uid: UID;
  username: string;
  remoteVideoTrack?: IRemoteVideoTrack;
  remoteAudioTrack?: IRemoteAudioTrack;
}
export const RemoteUsers = memo(() => {
  const [remoteUsers, setRemoteUsers] = useState<IRemoteUser[]>([]);
  const { client, screenUsername } = useRoomContext();
  const userLeftTone = new Audio(discordLeftTone);
  const userJoinedTone = new Audio(discordJoinedTone);

  useEffect(() => {
    client.on("user-joined", async (user) => {
      const res = await fetchData(`/api/get-username/${user.uid}`);
      const username = await res.text();
      if (username !== screenUsername) {
        setRemoteUsers((prevUsers) => [
          ...prevUsers,
          {
            uid: user.uid,
            username: username,
            remoteAudioTrack: user.audioTrack,
            remoteVideoTrack: user.videoTrack,
          },
        ]);
      }
      await userJoinedTone.play();
    });

    client.on("user-left", async (user) => {
      const res = await fetchData(`/api/delete-username/${user.uid}`);
      setRemoteUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser.uid !== user.uid));
      await userLeftTone.play();
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
      {remoteUsers.map((remoteUser, index) => {
        return (
          <RemoteUser
            remoteAudioTrack={remoteUser.remoteAudioTrack}
            remoteVideoTrack={remoteUser.remoteVideoTrack}
            username={remoteUser.username}
            key={index}
          />
        );
      })}
    </>
  );
});
