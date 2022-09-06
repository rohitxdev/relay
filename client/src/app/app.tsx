import "./global.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home, JoinRoom, Room } from "@pages";
import { AppContextProvider } from "../context/app-context";
import { useError } from "@utils/hooks";

export const App = () => {
  const [error, setError] = useError();
  return (
    <AppContextProvider value={{ error, setError }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/room" element={<Room />} />
          <Route path="*" element={<Navigate to="/" state={{ error: "Error: Invalid route" }} />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
};
