import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {withRouter} from "react-router-dom";

function LandingPageSidebar(props) {
  const [chkLoginUserSidebar, setChkLoginUserSidebar] = useState(false);
  console.log("props... ", props.match.path);
  const history = useHistory();
  const stateData = useSelector(state => {
    return state.user;
  });

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

  const goToPremium = () => {
    props.history.push("/premium");
  };

  return (
    // <div>
    <div className="left_sidebar">
      <div
        className={`side_content ${
          props.match.path === "/" ||
          props.match.path === "/userProfile" ||
          props.match.path === "/profile-video" ||
          props.match.path === "/profile" ||
          props.match.path === "/videoChat"
            ? "active"
            : ""
        }`}
        style={{
          cursor: `${props.match.path === "/videoChat" ? "no-drop" : ""}`,
          pointerEvents: `${props.match.path === "/videoChat" ? "none" : ""}`,
        }}
        onClick={goToHome}>
        {props.match.path === "/" ||
        props.match.path === "/userProfile" ||
        props.match.path === "/profile-video" ||
        props.match.path === "/profile" ||
        props.match.path === "/videoChat" ? (
          <img src={`../assets/images/home_active.png`} alt="homeActive" />
        ) : (
          <img src={`../assets/images/home.png`} alt="home" />
        )}

        <div>Home</div>
      </div>

      {chkLoginUserSidebar ? (
        <div
          className={`side_content ${
            props.match.path === "/debate" ? "active" : ""
          }`}
          style={{
            cursor: `${props.match.path === "/videoChat" ? "no-drop" : ""}`,
            pointerEvents: `${props.match.path === "/videoChat" ? "none" : ""}`,
          }}
          onClick={debateClick}>
          {props.match.path == "/debate" ? (
            <img src="../assets/images/debates_active.png" alt="debateActive" />
          ) : (
            <img src={`../assets/images/debates.png`} alt="debate" />
          )}
          <div>Debate</div>
        </div>
      ) : null}

      {chkLoginUserSidebar ? (
        <div
          className={`side_content ${
            props.match.path === "/follow" ? "active" : ""
          }`}
          style={{
            cursor: `${props.match.path === "/videoChat" ? "no-drop" : ""}`,
            pointerEvents: `${props.match.path === "/videoChat" ? "none" : ""}`,
          }}
          onClick={goToFollow}>
          {props.match.path == "/follow" ? (
            <img
              src="../assets/images/following_active.png"
              alt="followActive"
            />
          ) : (
            <img src={`../assets/images/following.png`} alt="follow" />
          )}

          <div>following</div>
        </div>
      ) : null}
      <div
        className={`side_content ${
          props.match.path === "/premium" ? "active" : ""
        }`}
        style={{
          cursor: `${props.match.path == "/videoChat" ? "no-drop" : ""}`,
          pointerEvents: `${props.match.path === "/videoChat" ? "none" : ""}`,
        }}
        onClick={goToPremium}>
        {props.match.path === "/premium" ? (
          <img
            src={`../assets/images/premium_active.png`}
            alt="premiumActive"
          />
        ) : (
          <img src={`../assets/images/premium.png`} alt="premium" />
        )}

        <div>pieramo premium</div>
      </div>
      <div
        className="side_content"
        style={{
          cursor: `${props.match.path === "/videoChat" ? "no-drop" : ""}`,
          pointerEvents: `${props.match.path === "/videoChat" ? "none" : ""}`,
        }}>
        <img src={`../assets/images/term_cond.png`} alt="terms" />
        <div>terms and conditions</div>
      </div>
    </div>
    /* </div> */
  );
}

export default withRouter(LandingPageSidebar);
