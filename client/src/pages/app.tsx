import "./app.scss";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppContextProvider, RoomContextProvider } from "@context";
import { ErrorDialog } from "@components";
import { Home } from "./home/home";
import { Room } from "./room/room";

const router = createBrowserRouter([
  { index: true, element: <Home /> },
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
    <>
      <ErrorDialog />
      <RouterProvider router={router} />
    </>
  </AppContextProvider>
);
