import AddIcon from "@assets/icons/add.svg";
import PeopleIcon from "@assets/icons/people.svg";
import GithubIcon from "@assets/icons/github.svg";
import LinkedInIcon from "@assets/icons/linkedin.svg";
import Illustration from "@assets/images/video-conference-illustration.svg";
import { Link } from "react-router-dom";
import styles from "./home.module.scss";
import { useEffect } from "react";

export const Home = () => {
  useEffect(() => {
    // const mobileRegex = /(android|iphone|ipad|ipod|mini)/gi;
    // const isMobile = "ontouchstart" in window && mobileRegex.test(navigator.userAgent);

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { exact: "environment" } } })
      .then(() => {
        alert("Rear cam exists. ");
      })
      .catch((err) => {
        alert(err);
        alert("Failed getting rear cam.");
      });
  });
  return (
    <div className={styles.home}>
      <div className={styles.banner} role="banner">
        <div className={styles.appName}>
          <p>AstroConnect</p>
          <img src="./logo.png" alt="Logo" />
        </div>
        <p className={styles.appDescription}>Free Video Conferencing for Everyone</p>
      </div>
      <div className={styles.illustrationWrapper}>
        <div className={styles.illustration} data-attribute="https://storyset.com/online">
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
