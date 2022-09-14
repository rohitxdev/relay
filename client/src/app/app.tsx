import "./global.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@store";
import { ErrorAlert } from "@components";
import { lazy, Suspense } from "react";
const Home = lazy(() => import("../pages/home/home"));
const JoinRoom = lazy(() => import("../pages/join-room/join-room"));
const Room = lazy(() => import("../pages/room/room"));

export const App = () => {
  return (
    <Provider store={store}>
      <ErrorAlert />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Suspense children={<Home />} />} />
          <Route path="/join-room" element={<Suspense children={<JoinRoom />} />} />
          <Route path="/room" element={<Suspense children={<Room />} />} />
          <Route path="*" element={<Navigate to="/" state={{ error: "Error: Invalid route" }} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};
