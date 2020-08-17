import React, { useEffect, useState } from "react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/edit_profile.css";
import {
  getUserProfileInfo,
  onImageChange,
  editProfile,
} from "../../Actions/userAction";
import { useSelector, useDispatch } from "react-redux";

function Profile() {
  const dispatch = useDispatch();
  const stateData = useSelector((state) => {
    return state.user;
  });

  const [name, setNameProfile] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    dispatch(getUserProfileInfo(localStorage.getItem("id")));
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();
    const dataToPass = {
      userId: localStorage.getItem("id"),
      userName: name,
      birthDate: birthDate,
      contactNo: contact,
    };

    await dispatch(editProfile(dataToPass));
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />

      <div
        className="main_editprofile_contents d-flex"
        style={{ marginTop: "80px" }}
      >
        <div className="edit_image">
          <img
            src={
              stateData.image
                ? `${stateData.image}`
                : `${stateData.userProfileInfo.profilePic}`
            }
          />
          <label className="choose_profile_pic custom-file-upload">
            <input
              type="file"
              onChange={(e) => {
                dispatch(onImageChange(e, localStorage.getItem("id")));
              }}
            />
            Choose Profile Photo
          </label>

          <div className="edit_input">
            <label>Winning Point: </label>
            <p>
              {stateData.userProfileInfo
                ? stateData.userProfileInfo.winningPoint
                  ? stateData.userProfileInfo.winningPoint
                  : 0
                : 0}
            </p>
          </div>
        </div>
        <div className="edit_details">
          <form onSubmit={(e) => submitForm(e)}>
            <div className="edit_input">
              <label>Username</label>
              <input
                type="text"
                defaultValue={
                  stateData.userProfileInfo
                    ? stateData.userProfileInfo.userName
                    : null
                }
                name="userName"
                onChange={(e) => setNameProfile(e.target.value)}
              />
            </div>
            <div className="edit_input">
              <label>Email</label>
              <input
                type="email"
                defaultValue={
                  stateData && stateData.userProfileInfo
                    ? stateData.userProfileInfo.email
                    : ""
                }
                readOnly
              />
            </div>
            <div className="edit_input">
              <label>Contact No</label>
              <input
                type="text"
                onChange={(e) => setContact(e.target.value)}
                defaultValue={
                  stateData && stateData.userProfileInfo
                    ? stateData.userProfileInfo.contactNo
                    : ""
                }
                // name="contact"
              />
            </div>
            <div className="edit_input">
              <label>Birth Date</label>
              <input
                type="date"
                onChange={(e) => setBirthDate(e.target.value)}
                defaultValue={
                  stateData && stateData.userProfileInfo
                    ? stateData.userProfileInfo.birthDate
                    : ""
                }
                name="birthDate"
              />
            </div>
            <div className="edit_input">
              <label>Password</label>
              <input
                type="password"
                defaultValue={
                  stateData && stateData.userProfileInfo
                    ? stateData.userProfileInfo.password
                    : ""
                }
                readOnly
              />
            </div>
            <button type="submit" className="submit_edit_profile">
              Edit Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
