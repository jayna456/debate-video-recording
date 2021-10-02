import React, { useState } from "react";
import "../assets/css/register.css";
import { submitRegisterHandlar } from "../Actions/userAction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";

function UserRegister(props) {
  // console.log(props);
  const dispatch = useDispatch();

  const [termsConditionChk, setTermsConditionChk] = useState(false);

  const [emailError, setEmailError] = useState();

  const onCheckedChange = e => {
    const chkBoxVal = e.target.checked;
    setTermsConditionChk(chkBoxVal);
  };

  const [inputs, setInputs] = useState({});
  const onInputChangeHandlar = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const redirectToLogin = () => {
    props.history.push("/login");
  };

  const submitRegForm = async e => {
    e.preventDefault();
    console.log("fn ccalled", termsConditionChk);

    if (
      inputs.userName === undefined &&
      inputs.email === undefined &&
      inputs.password === undefined &&
      inputs.confpass === undefined
    ) {
      swal("Error", "Please fillup all fields!", "info");
    } else if (inputs.password !== inputs.confpass) {
      console.log("not mathch");
      swal("Error", "Password and confirm password not match!", "info");
    } else if (termsConditionChk === false) {
      swal("Error", "Please accept terms and condition!", "info");
    } else {
      const frmRegData = {
        userName: inputs.userName,
        email: inputs.email,
        password: inputs.password,
        userType: "endUser",
      };

      await dispatch(submitRegisterHandlar(frmRegData, props));
    }
  };

  const emailValidation = event => {
    console.log(
      "dddss ",
      /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        event.target.value
      )
    );
    if (
      /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        event.target.value
      )
    ) {
      console.log("true");
      setEmailError("");
    } else {
      setEmailError("Please enter proper email address");
    }
  };

  const goToHome = () => {
    props.history.push("/");
  };

  return (
    <div className="register">
      <div>
        <i
          className="back_register fa fa-arrow-left"
          onClick={goToHome}
          style={{ cursor: "pointer" }}
        ></i>
      </div>
      <header className="register-header">
        <div
          className="logo_container-register"
          onClick={goToHome}
          style={{ cursor: "pointer" }}
        >
          <div className="logo-register">pieramo</div>
          <div className="sub_tag_line-register">your opinion matters.</div>
        </div>
      </header>
      <div className="form-register">
        <form className="frm-reg">
          <div className="title-register">Create your account</div>
          {/* <div class="form_content">
            <label>First Name</label>
            <input type="text">
				</div>
            <div class="form_content">
                <label>Last Name</label>
                <input type="text">
				</div> */}
          {/* <div className="row" style={{ border: "solid 1px black" }}>
            <div className="col-6">
              <label className="btn newModal custom-file-upload">
                <input
                  type="file"
                  id="fileImage"
                  onChange={(e) => onImageChange(e)}
                />
                Choose Profile Photo
              </label>
            </div>
            <div className="col-6">
              <img
                id="target"
                src={image}
                style={{ maxWidth: "50%", height: "50%" }}
                className="img-fluid img-thumbnail"
              />
            </div>
          </div> */}
          <div className="form_content-register">
            <label>Username *</label>
            <input
              type="text"
              name="userName"
              placeholder="Enter a user name"
              onChange={event => onInputChangeHandlar(event)}
              required
            />
          </div>
          <div className="form_content-register">
            <label>E-mail *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter a valid email address"
              onChange={event => {
                onInputChangeHandlar(event);
                emailValidation(event);
              }}
              required
            />
            <small style={{ color: "red" }}>{emailError}</small>
          </div>
          <div className="form_content-register">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Enter a password"
              onChange={event => onInputChangeHandlar(event)}
              required
            />
          </div>
          <div className="form_content-register">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confpass"
              placeholder="Enter a confirm password"
              onChange={event => onInputChangeHandlar(event)}
              required
            />
          </div>
          <div className="checkbox-register">
            <input
              className="checkbox-register"
              type="checkbox"
              name="termsCondition"
              onChange={e => onCheckedChange(e)}
            />
            <div>Accept terms and conditions</div>
          </div>
          <button
            type="submit"
            className="confirm_ac"
            name="register"
            onClick={e => submitRegForm(e)}
          >
            Submit
          </button>
          <div className="form_content-register">
            <a onClick={redirectToLogin}>Already have an account? Login Now</a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UserRegister;
