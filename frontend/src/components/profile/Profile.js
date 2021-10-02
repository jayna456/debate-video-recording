import React, {useEffect, useState} from "react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/edit_profile.css";
import {
  getUserProfileInfo,
  onImageChange,
  editProfile,
  // logout
} from "../../Actions/userAction";
import {useSelector, useDispatch} from "react-redux";
import swal from "sweetalert";

function Profile() {
  const dispatch = useDispatch();
  const stateData = useSelector(state => {
    return state.user;
  });

  const [name, setNameProfile] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [contact, setContact] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    dispatch(getUserProfileInfo(localStorage.getItem("id")));
  }, []);

  useEffect(() => {
    console.log("stateb data... ", stateData);
    if (stateData.userProfileInfo) {
      setUser(stateData.userProfileInfo);
    }
  }, [stateData]);

  const submitForm = async event => {
    event.preventDefault();
    if (changePassword && oldPassword !== "") {
      if (newPassword.trim() === confirmPassword.trim()) {
        const dataToPass = {
          userId: localStorage.getItem("id"),
          userName: name,
          birthDate: birthDate,
          contactNo: contact,
          newPassword: newPassword,
          oldPassword: oldPassword,
        };

        await dispatch(editProfile(dataToPass));
      } else {
        swal(
          "Error",
          "Change password and confirm password must be same!!",
          "error"
        ).then(() => {
          console.log("psw clear");
          setNewPassword("");
          setConfirmPassword("");
        });
      }
    } else {
      const dataToPass = {
        userId: localStorage.getItem("id"),
        userName: name,
        birthDate: birthDate,
        contactNo: contact,
      };

      await dispatch(editProfile(dataToPass));
    }
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />

      <div
        className="main_editprofile_contents d-flex"
        style={{marginTop: "80px"}}>
        <div className="edit_image">
          <img
            src={stateData.image ? `${stateData.image}` : `${user.profilePic}`}
            alt="profile"
          />
          <label className="choose_profile_pic custom-file-upload">
            <input
              type="file"
              onChange={e => {
                dispatch(onImageChange(e, localStorage.getItem("id")));
              }}
            />
            Choose Profile Photo
          </label>

          <div className="edit_input">
            <label>Points: </label>
            <p>{user ? (user.winningPoint ? user.winningPoint : 0) : 0}</p>
          </div>
        </div>
        <div className="edit_details">
          <form onSubmit={e => submitForm(e)}>
            <div className="edit_input">
              <label>Username</label>
              <input
                type="text"
                defaultValue={user ? user.userName : null}
                name="userName"
                onChange={e => setNameProfile(e.target.value)}
              />
            </div>
            <div className="edit_input">
              <label>Email</label>
              <input type="email" defaultValue={user.email} disabled />
            </div>
            <div className="edit_input">
              <label>Contact No</label>
              <input
                type="number"
                onChange={e => setContact(e.target.value)}
                defaultValue={user.contactNo}
                // name="contact"
              />
            </div>
            <div className="edit_input">
              <label>Birth Date</label>
              <input
                type="date"
                onChange={e => setBirthDate(e.target.value)}
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
                disabled
              />
              <small>
                <a
                  style={{cursor: "pointer", color: "#ff921d"}}
                  onClick={() => setChangePassword(!changePassword)}>
                  Change Password?
                </a>
              </small>
            </div>
            {changePassword ? (
              <div>
                <div className="edit_input">
                  <label>Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    onChange={e => setOldPassword(e.target.value)}
                    value={oldPassword}
                  />
                </div>
                <div className="edit_input">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    onChange={e => setNewPassword(e.target.value)}
                    value={newPassword}
                  />
                </div>
                <div className="edit_input">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    onChange={e => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
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
