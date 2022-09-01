import "./global.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, ReactNode, Suspense } from "react";
const Home = lazy(() => import("../pages/home"));
const CreateRoom = lazy(() => import("../pages/create-room"));
const JoinRoom = lazy(() => import("../pages/join-room"));
const Room = lazy(() => import("../pages/room"));

const SuspenseFallback = () => {
  return <div className="suspense-fallback"></div>;
};

const LazyPage = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LazyPage>
              <Home />
            </LazyPage>
          }
        />
        <Route
          path="/create-room"
          element={
            <LazyPage>
              <CreateRoom />
            </LazyPage>
          }
        />
        <Route
          path="/join-room"
          element={
            <LazyPage>
              <JoinRoom />
            </LazyPage>
          }
        />
        <Route
          path="/room"
          element={
            <LazyPage>
              <Room />
            </LazyPage>
          }
        />
        <Route path="*" element={<Navigate to="/" state={{ error: "Error: Invalid route" }} />} />
      </Routes>
    </BrowserRouter>
  );
};
