import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./NavMain.css";
import { useLogout } from "../../hooks/useLogout";

const Navbar = () => {
  const { logout } = useLogout();
  const handleClick = () => {
    logout();
  };

  return (
    <nav>
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/user/profile">
            <FontAwesomeIcon className="profile-icon" icon={faUser} />
          </Link>
          <Link to="/ask">
            <button className="btn-ask-question">Add a Question</button>
          </Link>
          <Link className="btn-private-chat" to="/private-chat">
            Private Chat
          </Link>
          <button className="btn-logout" onClick={handleClick}>
            <span className="icon-logout">
              <i className="fas fa-sign-out-alt"></i>
            </span>
          </button>
        </div>
        <div className="navbar-right">
          <Link to="/questions">
            <h6 className="categories-title">Categories</h6>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
