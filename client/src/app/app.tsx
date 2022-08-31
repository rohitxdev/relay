import "./global.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, CreateRoom, JoinRoom, Room } from "@pages";
import { AppContextProvider } from "@context";
import { useEffect, useState } from "react";

export const App = () => {
  const [isRearCameraAvailable, setRearCameraAvailability] = useState(false);
  const [isScreenShareAvailable, setScreenShareAvailability] = useState(false);
  const checkForRearCamera = async () => {
    if (localStorage.getItem("rear-camera")) {
      setRearCameraAvailability(true);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
        });
        localStorage.setItem("rear-camera", "available");
        setRearCameraAvailability(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.name, error.message);
        }
      }
    }
  };

  const checkForScreenShare = () => {
    if ("getDisplayMedia" in navigator.mediaDevices) {
      setScreenShareAvailability(true);
    } else {
      console.warn("Screensharing is not available on this device.");
    }
  };

  useEffect(() => {
    checkForScreenShare();
    checkForRearCamera();
  }, []);

  return (
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
  );
};
