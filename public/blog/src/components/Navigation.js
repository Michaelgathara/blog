import React from "react"
import { Link } from "gatsby"

const Navigation = () => (
  <div>
    <div className="hamburger-menu">
      <button className="burger" data-state="closed">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <div className="modeChoice">
      <div className="tumbler__wrapper">
        <div className="tumbler"></div>
      </div>
    </div>
    <nav data-state="closed">
      <ul>
        <li>
          <Link to="https://michaelgathara.com">Main</Link>
        </li>
        <li>
          <Link to="https://michaelgathara.com/about">About</Link>
        </li>
        <li>
          <Link to="https://michaelgathara.com/projects">Projects</Link>
        </li>
      </ul>
      <p style={{ textAlign: "center", fontWeight: 800, fontSize: "1.7em" }}>
        Social
      </p>
      <ul className="socialLinks">
        <li>
          <Link
            to="https://michaelgathara.com/instagram"
            className="fa fa-instagram"
            target="_blank"
          >
            Instagram
          </Link>
        </li>
        <li>
          <Link
            to="https://michaelgathara.com/Linkedin"
            className="fa fa-linkedin"
            target="_blank"
          >
            Linkedin
          </Link>
        </li>
        <li>
          <Link
            to="https://michaelgathara.com/twitter"
            className="fa fa-twitter"
            target="_blank"
          >
            Twitter
          </Link>
        </li>
        <li>
          <Link
            to="https://michaelgathara.com/github"
            className="fa fa-github"
            target="_blank"
          >
            Github
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link
            to="mailto:michael@michaelgathara.com?subject=Web"
            className="fa fa-envelope"
          >
            Email
          </Link>
        </li>
      </ul>
      <br />
    </nav>
    <div className="mobileNavigation"></div>
  </div>
)

export default Navigation
