import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";

function LandingPageSidebar(props) {
  const [chkLoginUserSidebar, setChkLoginUserSidebar] = useState(false);
  console.log("props... ", props.match.path);
  const history = useHistory();

  useEffect(() => {
    if (
      localStorage.getItem("debateAccountToken") &&
      localStorage.getItem("id") &&
      localStorage.getItem("email")
    ) {
      setChkLoginUserSidebar(true);
    } else {
      setChkLoginUserSidebar(false);
    }
  }, []);

  const debateClick = () => {
    history.push("/debate");
  };

  const goToHome = () => {
    props.history.push("/");
  };

  const goToFollow = () => {
    props.history.push("/follow");
  };

  return (
    <div>
      <div className="left_sidebar">
        <div
          className={`side_content ${
            props.match.path == "/" ||
            props.match.path == "/userProfile" ||
            props.match.path == "/videoChat"
              ? "active"
              : ""
          }`}
          onClick={goToHome}
        >
          {props.match.path == "/" ||
          props.match.path == "/userProfile" ||
          props.match.path == "/videoChat" ? (
            <img src={`../assets/images/home_active.png`} />
          ) : (
            <img src={`../assets/images/home.png`} />
          )}

          <div>Home</div>
        </div>

        {chkLoginUserSidebar ? (
          <div
            className={`side_content ${
              props.match.path == "/debate" ? "active" : ""
            }`}
            onClick={() => debateClick()}
          >
            {props.match.path == "/debate" ? (
              <img src="../assets/images/debates_active.png" />
            ) : (
              <img src={`../assets/images/debates.png`} />
            )}
            <div>Debate</div>
          </div>
        ) : null}

        {chkLoginUserSidebar ? (
          <div
            className={`side_content ${
              props.match.path == "/follow" ? "active" : ""
            }`}
            onClick={goToFollow}
          >
            {props.match.path == "/follow" ? (
              <img src="../assets/images/following_active.png" />
            ) : (
              <img src={`../assets/images/following.png`} />
            )}

            <div>following</div>
          </div>
        ) : null}
        <div className="side_content">
          <img src={`../assets/images/premium.png`} />
          <div>pieramo premium</div>
        </div>
        <div className="side_content">
          <img src={`../assets/images/term_cond.png`} />
          <div>terms and conditions</div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LandingPageSidebar);
