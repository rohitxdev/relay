import "../styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Room from "./room";
export const SERVER_URL = import.meta.env.PROD
  ? "https://spark-vc-backend.herokuapp.com"
  : "http://localhost:4000";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join-room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
