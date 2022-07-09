import { IRemoteVideoTrack, IRemoteAudioTrack, IAgoraRTCClient, UID } from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import discordJoinedTone from "../assets/audio/call-join.mp3";
import discordLeftTone from "../assets/audio/call-leave.mp3";
import RemoteUser from "./RemoteUser";
export interface ICustomRemoteUser {
  uid: UID;
  username: string | undefined;
  remoteVideoTrack?: IRemoteVideoTrack | undefined;
  remoteAudioTrack?: IRemoteAudioTrack | undefined;
}

export default function RemoteVideo({ client }: { client: IAgoraRTCClient }) {
  const [users, setUsers] = useState<ICustomRemoteUser[]>([]);
  const userLeftTone = new Audio(discordLeftTone);
  const userJoinedTone = new Audio(discordJoinedTone);
  userLeftTone.volume = 0.5;
  userJoinedTone.volume = 0.5;

  const cleanUp = async () => {
    client.removeAllListeners();
  };

  useEffect(() => {
    client.on("user-joined", async (user) => {
      setUsers((users) => {
        return [
          ...users,
          {
            uid: user.uid,
            username: undefined,
            remoteAudioTrack: user.audioTrack,
            remoteVideoTrack: user.videoTrack,
          },
        ];
      });
      await userJoinedTone.play();
    });

    client.on("user-left", async (user) => {
      setUsers((users) => {
        return users.filter((u) => u.uid !== user.uid);
      });
      await userLeftTone.play();
    });

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio") {
        setUsers((users) => {
          return users.map((u) => {
            if (u.uid === user.uid) {
              u.remoteAudioTrack = user.audioTrack;
            }
            return u;
          });
        });
      }
      if (mediaType === "video") {
        setUsers((users) => {
          return users.map((u) => {
            if (u.uid === user.uid) {
              u.remoteVideoTrack = user.videoTrack;
            }
            return u;
          });
        });
      }
    });
    client.on("user-unpublished", async (user, mediaType) => {
      if (mediaType === "audio") {
        setUsers((users) => {
          return users.map((u) => {
            if (u.uid === user.uid) {
              u.remoteAudioTrack = user.audioTrack;
            }
            return u;
          });
        });
      }
      if (mediaType === "video") {
        setUsers((users) => {
          return users.map((u) => {
            if (u.uid === user.uid) {
              u.remoteVideoTrack = user.videoTrack;
            }
            return u;
          });
        });
      }
    });
    return () => {
      cleanUp();
    };
  }, []);

  return (
    <>
      {users.map((user, index) => {
        return (
          <RemoteUser
            remoteAudioTrack={user.remoteAudioTrack}
            remoteVideoTrack={user.remoteVideoTrack}
            key={index}
          />
        );
      })}
    </>
  );
}
