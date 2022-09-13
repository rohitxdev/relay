import "./global.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home, JoinRoom, Room } from "@pages";
import { Provider } from "react-redux";
import { store } from "@store";
import { ErrorAlert } from "@components";

export const App = () => {
  return (
    <Provider store={store}>
      <ErrorAlert />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/room" element={<Room />} />
          <Route path="*" element={<Navigate to="/" state={{ error: "Error: Invalid route" }} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};
