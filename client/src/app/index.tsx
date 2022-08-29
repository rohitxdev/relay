import "./global.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, CreateRoom, JoinRoom, Room } from "@pages";
import { registerServiceWorker } from "./register-service-worker";
registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
