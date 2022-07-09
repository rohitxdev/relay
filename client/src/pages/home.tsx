import { useState } from "react";
import RenderIf from "../components/RenderIf";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { PageContext } from "../components/AppContext";
import AddIcon from "../assets/icons/add-outline.svg";
import PeopleIcon from "../assets/icons/people-sharp.svg";
import GithubLogo from "../assets/icons/logo-github.svg";
import LinkedInLogo from "../assets/icons/logo-linkedin.svg";
import SparkLogo from "../assets/icons/spark-logo.svg";

export default function Home() {
  const [inPage, setPage] = useState("home");

  const handleCreateRoom = async () => {
    setPage("create-room");
  };

  const handleJoinRoom = async () => {
    setPage("join-room");
  };

  return (
    <PageContext.Provider value={{ inPage, setPage }}>
      <div className="background"></div>
      <RenderIf isTrue={inPage === "create-room"}>
        <CreateRoom />
      </RenderIf>
      <RenderIf isTrue={inPage === "join-room"}>
        <JoinRoom />
      </RenderIf>
      <RenderIf isTrue={inPage === "home"}>
        <div className="home">
          <div className="home-info">
            <h1>
              Spark{" "}
              <span className="spark-logo">
                <SparkLogo />
              </span>
            </h1>
            <h3>Free Video Conferencing & Streaming</h3>
          </div>
          <div className="btn-container">
            <button className="btn" onClick={handleCreateRoom}>
              Create Room <AddIcon />
            </button>
            <button className="btn" onClick={handleJoinRoom}>
              Join Room <PeopleIcon />
            </button>
          </div>
          <div className="links">
            <a href="https://github.com/rohitman47" target="_blank">
              <GithubLogo />
            </a>
            <a href="https://www.linkedin.com/in/rohit-reddy-36256920a/" target="_blank">
              <LinkedInLogo />
            </a>
          </div>
        </div>
      </RenderIf>
    </PageContext.Provider>
  );
}
