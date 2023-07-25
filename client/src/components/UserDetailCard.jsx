import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import PropTypes from "prop-types";
import { MdClose } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./UserDetailCard.css";

export const UserDetailCard = ({ userId, setShowUserDetails }) => {
  const [user, setUser] = useState({});

  const { performFetch, cancelFetch } = useFetch(
    `/user/${userId}`,
    (jsonResult) => {
      setUser(jsonResult.result);
    }
  );
  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  return (
    <div className="user-detail-card">
      {" "}
      <MdClose
        className="button-close-update-photo"
        onClick={() => {
          setShowUserDetails(false);
        }}
      />
      {user.image ? (
        <img className="profile-photo-container" src={user.image} />
      ) : (
        <FontAwesomeIcon className="avatar-container" icon={faUser} />
      )}
      <div>
        {user.firstName} {user.lastName}
      </div>
      <div>{user.role}</div>
      {user.hyfClass && <div>Class {user.hyfClass}</div>}
      <div>{user.email}</div>
      {user.country && <div>{user.country}</div>}
      {user.about_me && <div>{user.about_me}</div>}
    </div>
  );
};

UserDetailCard.propTypes = {
  userId: PropTypes.string.isRequired,
  setShowUserDetails: PropTypes.func.isRequired,
};
