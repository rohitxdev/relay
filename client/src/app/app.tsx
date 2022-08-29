import "./global.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, CreateRoom, JoinRoom, Room } from "@pages";
import { registerServiceWorker } from "./register-service-worker";
import { AppContextProvider } from "@context";
import { useEffect, useState } from "react";

export const App = () => {
  const [isRearCameraAvailable, setIsRearCameraAvailable] = useState(false);
  const [isScreenShareAvailable, setIsScreenShareAvailable] = useState(false);

  const checkForRearCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      });
      setIsRearCameraAvailable(true);
    } catch (error) {
      console.error("REAR CAMERA NOT AVAILABLE");
    }
  };
  const checkForScreenShare = async () => {
    if ("getDisplayMedia" in navigator.mediaDevices) {
      setIsScreenShareAvailable(true);
    } else {
      console.error("SCREENSHARING NOT AVAILABLE");
    }
  };

  useEffect(() => {
    registerServiceWorker();
    checkForScreenShare();
    checkForRearCamera();
  }, []);

  return (
    <>
      <AppContextProvider value={{ isRearCameraAvailable, isScreenShareAvailable }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/room" element={<Room />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </>
  );
};
