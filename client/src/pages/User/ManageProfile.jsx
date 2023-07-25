import React, { useState, useEffect } from "react";
import Navbar from "../../components/NavBars/NavMain";
import "./ManageProfile.css";
import { useUserContext } from "../../hooks/useUserContext";
import useFetch from "../../hooks/useFetch";
import { MdEdit } from "react-icons/md";
import { UploadImage } from "../../components/UploadImage";

export const ManageProfile = () => {
  const { user } = useUserContext();
  const [isSaved, setIsSaved] = useState(false);
  const [editProfilePhoto, setEditProfilePhoto] = useState(false);
  const [formData, setFormData] = useState({
    country: user.country ? user.country : "",
    dob: user.date_of_birth ? user.date_of_birth : "",
    telephone: user.telephone_number ? user.telephone_number : "",
    about: user.about_me ? user.about_me : "",
  });

  const { performFetch, cancelFetch } = useFetch(`/user/${user._id}/profile`);

  useEffect(() => {
    return cancelFetch();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.getItem("auth")).token;

    performFetch({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      window.location.reload();
    }, 2000);

    // setFormData({
    //   country: "",
    //   dob: "",
    //   telephone: "",
    //   about: "",
    // });
  };

  return (
    <>
      <Navbar />
      <div className="manage-profile-page-container">
        {editProfilePhoto && (
          <UploadImage setEditProfilePhoto={setEditProfilePhoto} />
        )}
        <div className="profile-photo-container-manage-profile">
          <img className="profile-photo" src={user.image} alt="" />
          <MdEdit
            className="profile-photo-edit"
            onClick={() => {
              setEditProfilePhoto(!editProfilePhoto);
            }}
          />
          <div className="display-user-info">
            <div>
              <span className="display-user-info-title">Country: </span>
              {user.country ? user.country : "-"}
            </div>
            <div>
              <span className="display-user-info-title">Date of Birth: </span>
              {formData.dob.split("T")[0]}
            </div>
            <div>
              <span className="display-user-info-title">Telephone: </span>
              {user.telephone_number ? user.telephone_number : "-"}
            </div>
            <div>
              <span className="display-user-info-title">About: </span>
              {user.about_me ? user.about_me : "-"}
            </div>
          </div>
        </div>
        <div className="user-info">
          <h2>Manage Profile</h2>
          {isSaved && <p className="changes-saved">Changes saved.</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label-manage-profile" htmlFor="country">
                Country:
              </label>
              <input
                className="input-manage-profile"
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={(event) =>
                  setFormData({ ...formData, country: event.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="label-manage-profile" htmlFor="dob">
                Date of Birth:
              </label>
              <input
                className="input-manage-profile"
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={(event) =>
                  setFormData({ ...formData, dob: event.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="label-manage-profile" htmlFor="telephone">
                Telephone Number:
              </label>
              <input
                className="input-manage-profile"
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={(event) =>
                  setFormData({ ...formData, telephone: event.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="label-manage-profile" htmlFor="about">
                About Me:
              </label>
              <textarea
                className="input-manage-profile"
                id="about"
                name="about"
                rows="4"
                value={formData.about}
                onChange={(event) =>
                  setFormData({ ...formData, about: event.target.value })
                }
              ></textarea>
            </div>
            <button className="button-save-changes" type="submit">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
