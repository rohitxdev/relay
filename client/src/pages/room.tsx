import AgoraRTC from "agora-rtc-sdk-ng";
import { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LocalVideo from "../components/LocalVideo";
import RemoteVideo from "../components/RemoteVideo";

export default function Room() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const username = searchParams.get("username");
  const client = useMemo(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp9" }), []);

  const enterRoom = async (roomId: string) => {
    const response = await fetch(`/api/get-access-token?roomId=${roomId}&username=${username}`);
    const { appId, uid, accessToken } = await response.json();
    await client.join(appId, roomId, accessToken, uid);
  };

  const cleanUp = async () => {
    console.log("CLIENT LEFT");
    await client.leave();
  };

  useLayoutEffect(() => {
    if (sessionStorage.getItem("spark-vc-room-id") !== roomId) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (roomId) {
      enterRoom(roomId);
    }
    return () => {
      cleanUp();
    };
  }, []);

  return (
    <div className="room">
      <div className="video-grid">
        <RemoteVideo client={client} />
        <LocalVideo client={client} />
      </div>
    </div>
  );
}
