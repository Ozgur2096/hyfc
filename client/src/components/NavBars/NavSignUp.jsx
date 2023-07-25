import React from "react";
import { Link } from "react-router-dom";
import "./NavSignUp.css";
import { Image } from "cloudinary-react";

const NavSignUp = () => {
  return (
    <ul className="nav-sign-up">
      <Link to="/">
        <Image
          className="logoImgg anim-logo"
          cloudName="dfzxe70hs"
          publicId="9_htabcp.png"
          alt="1"
        />
      </Link>
      <li className="nav-sign-up-btn">
        <a className="about-us-link" href="https://www.hackyourfuture.net/">
          About Us
        </a>
      </li>
    </ul>
  );
};

export default NavSignUp;
