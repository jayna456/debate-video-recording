import React, { useState } from "react";
import "../assets/css/login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyUser } from "../Actions/userAction";
import { useDispatch } from "react-redux";

function VerifiedUser(props) {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const callVerify = () => {
    console.log("call verify called", props);

    if (code.trim().length === 6) {
      const dataToPass = {
        id: props.location.search.split("=")[1],
        code: code.trim(),
      };

      dispatch(verifyUser(dataToPass));
    } else {
      toast.error("Code must be 6 digit");
    }
  };

  return (
    <div>
      <div className="login">
        <div className="Loader" style={{ display: "none" }}></div>
        <header className="login-header">
          <div className="logo_container-login">
            <div className="logo-login">pieramo</div>
            <div className="sub_tag_line-login">your opinion matters.</div>
          </div>
        </header>
        <div className="form-login">
          <form className="frm-login">
            <div className="title-login">Verified your account</div>

            <div className="form_content-login">
              <label>Enter Verification Code:</label>
              <input
                type="text"
                name="verifyCode"
                placeholder="Enter your 6 digit code from your email"
                required
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="confirm_ac-login"
              onClick={callVerify}
            >
              Verify
            </button>
            <div className="form_content-login"></div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default VerifiedUser;
