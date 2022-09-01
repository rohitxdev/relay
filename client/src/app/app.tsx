import "./global.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, ReactNode, Suspense } from "react";
const Home = lazy(() => import("../pages/home"));
const CreateRoom = lazy(() => import("../pages/create-room"));
const JoinRoom = lazy(() => import("../pages/join-room"));
const Room = lazy(() => import("../pages/room"));

const LazyPage = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div style={{ background: "var(--color-dark-200)", height: "100vh", width: "100vw" }}></div>
      }
    >
      {children}
    </Suspense>
  );
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
