import React, {useState} from "react";
import "../assets/css/forgot.css";
import {forgotPassword} from "../Actions/userAction";
import {useDispatch} from "react-redux";

const ForgotPassword = props => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch();

  function loginToRegister() {
    props.history.push("/login");
  }

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
      setEmail(event.target.value);
    } else {
      setEmailError("Please enter proper email address");
    }
  };

  const getLinkForgotPassword = async event => {
    event.preventDefault();

    const dataToPass = {
      email,
    };

    await dispatch(forgotPassword(dataToPass));
  };

  return (
    <div>
      <div className="forgot-section">
        <div className="Loader" style={{display: "none"}}></div>
        <header className="login-header">
          <div className="logo_container-login">
            <div className="logo-login">pieramo</div>
            <div className="sub_tag_line-login">your opinion matters.</div>
          </div>
        </header>
        <div className="frogot-form-login">
          <form
            className="forgot-frm-login"
            onSubmit={e => getLinkForgotPassword(e)}>
            <div className="forgot-title-login">Forgot password</div>

            <div className="forgot-form_content-login">
              <label>Enter your registered Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter registered email"
                required
                onChange={e => emailValidation(e)}
              />
              <small style={{color: "red"}}>{emailError}</small>
            </div>

            <button type="submit" className="confirm_forgot-login">
              Submit
            </button>
            <div className="forgot-form_content-login">
              <a onClick={() => loginToRegister()}>Go to Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
