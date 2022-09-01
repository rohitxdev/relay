import "./global.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home, CreateRoom, JoinRoom, Room } from "@pages";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/room" element={<Room />} />
        <Route path="*" element={<Navigate to="/" state={{ error: "Error: Invalid route" }} />} />
      </Routes>
    </BrowserRouter>
  );
};
