import "./app.scss";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppContextProvider, RoomContextProvider } from "@context";
import { ErrorAlert } from "@components";
import { Home } from "./home/home";
import { JoinRoom } from "./join-room/join-room";
import { Room } from "./room/room";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/join-room", element: <JoinRoom /> },
  {
    path: "/room",
    element: (
      <RoomContextProvider>
        <Room />
      </RoomContextProvider>
    ),
  },
  { path: "*", element: <Navigate to="/" state={{ error: "Error: Invalid route" }} /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppContextProvider>
    <ErrorAlert />
    <RouterProvider router={router} />
  </AppContextProvider>
);
