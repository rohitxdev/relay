import "./global.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, JoinRoom, PageNotFound, Room } from "@pages";
import { Provider } from "react-redux";
import { store } from "@store";

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/room" element={<Room />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};
