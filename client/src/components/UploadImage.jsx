import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useUserContext } from "../hooks/useUserContext";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";

export const UploadImage = ({ setEditProfilePhoto }) => {
  const { user } = useUserContext();
  const [image, setImage] = useState("");
  const [showRefreshMessage, setShowRefreshMessage] = useState(false);

  function convertToBase64(e) {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      setImage(reader.result);
    };
  }

  const { performFetch, cancelFetch } = useFetch(`/user/${user._id}/image`);

  useEffect(() => {
    return cancelFetch;
  }, []);

  function uploadImage() {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    performFetch({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        photo: image,
      }),
    });
    setShowRefreshMessage(true);
    setTimeout(() => {
      window.location.reload(); // Refresh the page
      window.location.href = "/user/profile";
    }, 1600);
  }
  return (
    <div className="upload-photo-box">
      <MdClose
        className="button-close-update-photo"
        onClick={() => {
          setEditProfilePhoto(false);
        }}
      />
      <input accept="image/*" type="file" onChange={convertToBase64} />
      {image === "" || image === null ? (
        ""
      ) : (
        <img className="view-img" src={image} alt="" />
      )}
      <button onClick={uploadImage}>Upload</button>
      {showRefreshMessage && <p>Image uploaded successfully.</p>}
    </div>
  );
};

UploadImage.propTypes = {
  setEditProfilePhoto: PropTypes.func.isRequired,
};
