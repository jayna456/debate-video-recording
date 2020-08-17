import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import "../assets/css/login.css";
import { loginSubmit } from "../Actions/userAction";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSelector, useDispatch } from "react-redux";

function UserLogin(props) {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({});
  const [emailError, setEmailError] = useState("");
  const [saveUser, setSaveUser] = useState(true);

  const myRef = useRef(null);
  const stateData = useSelector((state) => {
    return state.auth;
  });

  const onInputChangeHandlar = async (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const emailValidation = (event) => {
    console.log(
      "dddss ",
      /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(event.target.value)
    );
    if (/^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(event.target.value)) {
      console.log("true");
      setEmailError("");
    } else {
      setEmailError("Please enter proper email address");
    }
  };

  const submitLoginForm = async (e) => {
    e.preventDefault();
    const loginInfo = {
      email: inputs.email,
      password: inputs.password,
      saveUser: saveUser,
    };

    if (inputs.email === "" || inputs.password === "") {
      swal("Info", "Please fillup all fields!", "info");
    } else {
      const getCallBack = await dispatch(loginSubmit(loginInfo));
      console.log(myRef.current);
      console.log("caa", stateData.isLogin);
    }
  };

  const loginToRegister = () => {
    props.history.push("/register");
  };

  const goToForgot = async () => {
    props.history.push("/forgotPassword");
  };

  return (
    <div>
      <div className="login">
        <div className="Loader" style={{ display: "none" }} ref={myRef}></div>
        <header className="login-header">
          <div className="logo_container-login">
            <div className="logo-login">pieramo</div>
            <div className="sub_tag_line-login">your opinion matters.</div>
          </div>
        </header>
        <div className="form-login">
          <form className="frm-login">
            <div className="title-login">Login your account</div>

            <div className="form_content-login">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your registerd email address"
                onChange={(event) => {
                  onInputChangeHandlar(event);
                  emailValidation(event);
                }}
                required
              />
              <small style={{ color: "red" }}>{emailError}</small>
            </div>
            <div className="form_content-login">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={(event) => onInputChangeHandlar(event)}
                required
              />
            </div>
            <div
              className="form_content-login"
              style={{ flexDirection: "row", alignItems: "flex-end" }}
            >
              <input
                type="checkbox"
                checked
                onChange={setSaveUser(!saveUser)}
              />
              <label style={{ paddingLeft: "10px" }}>Remember this user</label>
            </div>
            <button
              type="submit"
              className="confirm_ac-login"
              name="login"
              onClick={(e) => submitLoginForm(e)}
            >
              Login
            </button>

            <div className="form_content-login">
              <a onClick={() => loginToRegister()}>
                Don't have an account? Register Now
              </a>
              <a onClick={goToForgot}>Forgot Password</a>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default UserLogin;
