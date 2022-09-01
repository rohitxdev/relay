import AddIcon from "@assets/icons/add.svg";
import PeopleIcon from "@assets/icons/people.svg";
import GithubIcon from "@assets/icons/github.svg";
import LinkedInIcon from "@assets/icons/linkedin.svg";
import Illustration from "@assets/images/video-conference-illustration.svg";
import { Link, useLocation } from "react-router-dom";
import styles from "./home.module.scss";
import { useEffect } from "react";

const Home = () => {
  const { state } = useLocation() as any;

  useEffect(() => {
    if (state?.error) {
      history.replaceState({}, "");
    }
  }, []);
  return (
    <div className={styles.home}>
      {state?.error && (
        <p className="error" role="error">
          {state?.error}
        </p>
      )}{" "}
      <div className={styles.banner} role="banner">
        <div className={styles.appName}>
          <p>Relay</p>
          <img src="./relay-logo.png" alt="Logo" />
        </div>
        <p className={styles.appDescription}>Free Video Conferencing for Everyone</p>
      </div>
      <div className={styles.illustrationWrapper}>
        <div className={styles.illustration} data-attribution="https://storyset.com/online">
          <Illustration />
        </div>
        <div className={[styles.btnContainer, styles.animateBtns].join(" ")}>
          <Link to={"/create-room"} className="router-link">
            <button className={styles.btn}>
              Create Room <AddIcon />
            </button>
          </Link>
          <Link to={"/join-room"} className="router-link">
            <button className={styles.btn}>
              Join Room <PeopleIcon />
            </button>
          </Link>
          <section aria-label="Links to my social media profiles" className={styles.links}>
            <a href="https://github.com/rohitman47" target="_blank" title="Link to Github profile">
              <GithubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/rohit-reddy-36256920a/"
              target="_blank"
              title="Link to LinkedIn Profile"
            >
              <LinkedInIcon />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
