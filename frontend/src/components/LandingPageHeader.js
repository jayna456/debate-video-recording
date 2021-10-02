import React, {useState, useEffect} from "react";
import {withRouter} from "react-router-dom";
import "../assets/css/socialHeader.scss";
import {searchDebeate} from "../Actions/userAction";
import {useSelector, useDispatch} from "react-redux";
import SearchResult from "./SearchResult";
import {getUserProfileInfo, logout} from "../Actions/userAction";
import {
  viewPrivateProposals,
  privateProposalAcceptReject,
} from "../Actions/debateAction";
import firebase from "./firebase";
import {changeUserStatus} from "../Actions/userAction";
import moment from "moment";

function LandingPageHeader(props) {
  const [chkLoginUser, setChkLoginUser] = useState(false);
  const [settingDropDown, setSettingDropDown] = useState(false);
  const [searchInfo, setSearchInfo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const [proposalList, setProposalList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUSer] = useState({});
  const [searchList, setSearchList] = useState([]);

  const menuClass = `dropdown-menu dropdown-menu-right${isOpen ? " show" : ""}`;

  const menuClass1 = `dropdown-menu dropdown-menu-right${
    isNotificationOpen ? " show" : ""
  }`;

  const dispatch = useDispatch();
  const stateData = useSelector(state => {
    return state.user;
  });

  const stateDebate = useSelector(state => {
    console.log("debate.. ", state.debate);
    return state.debate;
  });

  useEffect(() => {
    if (
      localStorage.getItem("debateAccountToken") &&
      localStorage.getItem("id") &&
      localStorage.getItem("email")
    ) {
      setChkLoginUser(true);
      dispatch(getUserProfileInfo(localStorage.getItem("id")));
      dispatch(viewPrivateProposals());
      const receiverRef = firebase.database().ref();
      receiverRef.on("value", snapshot => {
        snapshot.forEach(function (childSnapshot) {
          const childData = childSnapshot.val();
          if (
            childData.members &&
            childData.members.length &&
            childData.members.includes(localStorage.getItem("id"))
          ) {
            setViewed(true);
            if (childData.acceptRequest === true) {
              setTimeout(() => {
                props.history.push({
                  pathname: "/videoChat",
                  state: {
                    messageToPass: "makeAnswerRequest",
                    id: childData.loginUserId,
                    name: childData.topicName,
                    members: childData.members,
                  },
                });
              }, 15000);
            }
          }
        });
      });
      const dataToPass = {
        userId: localStorage.getItem("id"),
      };
      dispatch(changeUserStatus(dataToPass));
    } else {
      setChkLoginUser(false);
    }
  }, []);

  useEffect(() => {
    if (stateDebate) {
      if (stateDebate.proposalList) {
        setProposalList(stateDebate.proposalList);
      }
      if (stateDebate.errorMessage) {
        setErrorMsg(stateDebate.errorMessage);
      }
    }
  }, [stateDebate]);

  useEffect(() => {
    if (stateData) {
      if (stateData.userProfileInfo) {
        setUSer(stateData.userProfileInfo);
      }
      if (stateData.searchList) {
        setSearchList(stateData.searchList);
      }
    }
  }, [stateData]);

  const openSettingDropDownMenu = e => {
    e.preventDefault();
    if (settingDropDown) {
      setSettingDropDown(false);
    } else {
      setSettingDropDown(true);
    }
  };

  const searchData = async value => {
    // props.history.push("/searchData", value);
    setSearchInfo(value);
    if (props.location.pathname === "/debate") {
      const data = {
        name: value,
        type: "debate",
      };
      await dispatch(searchDebeate(data));
    } else {
      const data = {
        name: value,
      };
      await dispatch(searchDebeate(data));
    }
  };

  const goToLogin = () => {
    props.history.push("/login");
  };

  const toggleValue = () => {
    console.log("fn click");
    setIsOpen(!isOpen);
    setIsNotificationOpen(false);
  };

  if (isOpen || searchInfo || isNotificationOpen) {
    window.addEventListener("click", function (e) {
      if (isOpen) {
        setIsOpen(false);
      }
      if (isNotificationOpen) {
        setIsNotificationOpen(!isNotificationOpen);
      }
      if (searchInfo !== "") {
        setSearchInfo("");
      }
    });
  }

  const toggleNotiValue = async () => {
    console.log("fn click");
    setTimeout(function () {
      setIsNotificationOpen(!isNotificationOpen);
    }, 0);
    setIsNotificationOpen(!isNotificationOpen);
    setIsOpen(false);
    setViewed(false);
    await dispatch(viewPrivateProposals());
  };

  const loggedout = async () => {
    console.log("loggeed out fn called");
    await dispatch(logout());
    localStorage.clear();
    if (props.match.path === "/") {
      window.location.reload();
    } else {
      props.history.push("/");
    }
  };

  const goToHome = () => {
    props.history.push("/");
  };

  const goToDebate = () => {
    props.history.push("/debate");
  };

  const goToProfile = () => {
    props.history.push("/profile");
  };

  const goToProfileVideo = () => {
    console.log("go to video profile fn called");

    props.history.push("/profile-video");
  };

  const declineRequest = async data => {
    setReceiverId(data.userId);
    const dataToPass = {
      userId: localStorage.getItem("id"),
      status: "reject",
      id: data._id,
    };

    const receiverRef = firebase.database().ref();
    let key1;
    receiverRef.on("value", snapshot => {
      snapshot.forEach(value => {
        const singleObjValue = value.val();
        if (data.debateName === singleObjValue.topicName) {
          firebase.database().ref().child(value.key).remove();
        }
      });
    });
    console.log("key... ", key1);
    if (key1) {
      receiverRef.remove(key1);
    }

    await dispatch(privateProposalAcceptReject(dataToPass));
  };

  async function acceptRequest(data, e) {
    console.log("data for accept prposal", data);

    e.preventDefault();
    setReceiverId(data.userId);
    let members = [];
    let turnValue = {};
    let key1;
    let dbComments = [];
    const userId = data.userId;
    const joinedUser = localStorage.getItem("id");
    const dataToPass = {
      userId: localStorage.getItem("id"),
      status: "accept",
      id: data._id,
    };

    const receiverRef = firebase.database().ref();
    receiverRef.once("value", snapshot => {
      snapshot.forEach(value => {
        const singleObjValue = value.val();

        console.log(
          "private accept....",
          singleObjValue.loginUserId,
          localStorage.getItem("id")
        );
        if (singleObjValue.loginUserId === localStorage.getItem("id")) {
          console.log("inside if..");
          members = singleObjValue.members;
          key1 = value.key;
          dbComments = value.comments;
          if (singleObjValue.debateStatus === "per turns") {
            turnValue = {
              [userId]: true,
              [joinedUser]: false,
            };
          }
        }
      });
    });

    console.log("db comments... ", dbComments);
    receiverRef.child(key1).update({
      acceptRequest: true,
      viewed: true,
      // loginUserId: data.userId,
      comments:
        dbComments === undefined
          ? [{userId: ""}]
          : dbComments.length && dbComments[0].userId !== ""
          ? [{userId: ""}]
          : dbComments,
      turnValue: turnValue,
      joinedTime: moment().toString(),
    });

    await dispatch(privateProposalAcceptReject(dataToPass));
    props.history.push({
      pathname: "/videoChat",
      state: {
        messageToPass: "makeCreateRequest",
        id: localStorage.getItem("id"),
        name: data.debateName,
        members: members,
      },
    });
  }

  return (
    <div>
      <header>
        <div
          className="logo_container"
          style={{
            cursor: `${props.match.path === "/videoChat" ? "no-drop" : ""}`,
            pointerEvents: `${props.match.path === "/videoChat" ? "none" : ""}`,
          }}
          onClick={goToHome}>
          <div className="logo">pieramo</div>
          <div className="sub_tag_line">your opinion matters.</div>
        </div>

        <div className="main_header">
          <div className="search_field">
            <img
              className="search_icon"
              src={`../assets/images/search.png`}
              style={{cursor: "pointer"}}
              onClick={goToDebate}
              alt="searchIcon"
            />
            <input
              type="text"
              placeholder="Search For Debates"
              name="searchDebeate"
              onChange={e => searchData(e.target.value)}
              style={{
                cursor: `${props.match.path == "/videoChat" ? "no-drop" : ""}`,
                pointerEvents: `${
                  props.match.path === "/videoChat" ? "none" : ""
                }`,
              }}
            />
          </div>

          {searchInfo ? (
            <div
              className="upperDiv"
              style={{
                width: "56%",
                cursor: `${props.match.path == "/videoChat" ? "no-drop" : ""}`,
                pointerEvents: `${
                  props.match.path === "/videoChat" ? "none" : ""
                }`,
              }}>
              <SearchResult value={searchList} />
            </div>
          ) : (
            <div></div>
          )}

          {/* <div className="side_content">
            <img src={`../assets/images/my_sc.png`} />
            <div>my account</div>
          </div> */}

          <div className="header_items">
            {/* {chkLoginUser ? (
              <div
                className="setting_img"
                onClick={(e) => openSettingDropDownMenu(e)}
              >
                <a href="#">
                  <img
                    className="settings"
                    src={`../assets/images/settings.png`}
                  />
                </a>
              </div>
            ) : null} */}

            {/* {settingDropDown ? (
              <div class="landingPage-header-setting">
                <ul>
                  <li>Option 1</li>
                  <li>Option 2</li>
                  <li>Option 3</li>
                  <li>Option 4</li>
                </ul>
              </div>
            ) : null} */}

            {/* <div className="setting_img">
              <a href="#">
                <img
                  className="settings"
                  src={`../assets/images/settings.png`}
                />
              </a>
            </div> */}

            <div className="contry_box">
              <div className="form-group">
                <div id="basic" data-input-name="country" />
              </div>
            </div>

            {chkLoginUser ? (
              ""
            ) : (
              <div
                className="side_content"
                style={{
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={goToLogin}>
                <p style={{margin: "0"}}>LOGIN</p>
              </div>
            )}

            {chkLoginUser ? (
              <div>
                {viewed ? (
                  <div className="bell-icon">
                    <i
                      className="fa fa-bell fa-lg"
                      aria-hidden="true"
                      id="dropdownMenuButton1"
                      onClick={toggleNotiValue}
                      style={{
                        cursor: `${
                          props.match.path == "/videoChat"
                            ? "no-drop"
                            : "pointer"
                        }`,
                        pointerEvents: `${
                          props.match.path === "/videoChat" ? "none" : ""
                        }`,
                      }}></i>
                  </div>
                ) : (
                  <div
                    style={{
                      cursor: `${
                        props.match.path == "/videoChat" ? "no-drop" : "pointer"
                      }`,
                      pointerEvents: `${
                        props.match.path === "/videoChat" ? "none" : ""
                      }`,
                      marginRight: "13px",
                    }}>
                    <i
                      className="fa fa-bell fa-lg"
                      aria-hidden="true"
                      id="dropdownMenuButton1"
                      onClick={toggleNotiValue}></i>
                  </div>
                )}

                <div
                  className={menuClass1}
                  aria-labelledby="dropdownMenuButton1"
                  style={{width: "30%"}}>
                  <ul>
                    <li className="dropdown-item menu">
                      <div>
                        {proposalList.length ? (
                          proposalList.map(request => (
                            <div key={request._id}>
                              {request.proposalStatus == "reject" ? null : (
                                <div style={{textAlign: "left"}}>
                                  <p
                                    style={{
                                      textAlign: "left",
                                      margin: "5px",
                                    }}>
                                    {request.message}
                                    <br />
                                    <small>at {request.createdDate}</small>
                                  </p>
                                  <button
                                    className="btn btn-primary"
                                    style={{
                                      backgroundColor: "#ff921d",
                                      border: "solid 1px #ff921d",
                                      marginRight: "3px",
                                      cursor: `${
                                        props.match.path == "/videoChat"
                                          ? "no-drop"
                                          : ""
                                      }`,
                                      pointerEvents: `${
                                        props.match.path === "/videoChat"
                                          ? "none"
                                          : ""
                                      }`,
                                    }}
                                    onClick={e => acceptRequest(request, e)}>
                                    Accept
                                  </button>
                                  <button
                                    className="btn"
                                    onClick={() => declineRequest(request)}
                                    style={{
                                      cursor: `${
                                        props.match.path == "/videoChat"
                                          ? "no-drop"
                                          : ""
                                      }`,
                                      pointerEvents: `${
                                        props.match.path === "/videoChat"
                                          ? "none"
                                          : ""
                                      }`,
                                    }}>
                                    Decline
                                  </button>
                                  <hr />
                                </div>
                              )}
                            </div>
                          ))
                        ) : errorMsg ? (
                          <p>{errorMsg}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}

            {chkLoginUser ? (
              <div
                className="side_content"
                style={{
                  border: "none",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}>
                <img
                  src={
                    user.profilePic
                      ? `${user.profilePic}`
                      : `../assets/images/my_sc.png`
                  }
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  id="dropdownMenuButton"
                  onClick={toggleValue}
                  style={{
                    borderRadius: "70%",
                    cursor: `${
                      props.match.path == "/videoChat" ? "no-drop" : ""
                    }`,
                    pointerEvents: `${
                      props.match.path === "/videoChat" ? "none" : ""
                    }`,
                  }}
                />
                <p
                  style={{
                    marginBottom: "0px",
                    marginLeft: "10px",
                    fontWeight: "500",
                    pointerEvents: `${
                      props.match.path === "/videoChat" ? "none" : ""
                    }`,
                  }}
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  id="dropdownMenuButton"
                  onClick={toggleValue}>
                  {user.userName}
                </p>

                <img
                  src={`../../assets/images/logo.png`}
                  height="15"
                  width="15"
                  style={{
                    objectFit: "contain",
                    height: "20px",
                    width: "20px",
                    display:
                      JSON.stringify(user.premium) !== "true" ? "none" : "",
                  }}
                />

                <div className={menuClass} aria-labelledby="dropdownMenuButton">
                  <ul>
                    <li
                      className="dropdown-item menu"
                      onClick={goToProfileVideo}>
                      <i
                        className="fa fa-address-book"
                        aria-hidden="true"
                        style={{
                          paddingRight: "5px",
                          pointerEvents: `${
                            props.match.path === "/videoChat" ? "none" : ""
                          }`,
                        }}></i>
                      Profile
                    </li>
                    <li className="dropdown-item menu" onClick={goToProfile}>
                      <i
                        className="fa fa-user"
                        aria-hidden="true"
                        style={{
                          paddingRight: "5px",
                          pointerEvents: `${
                            props.match.path === "/videoChat" ? "none" : ""
                          }`,
                        }}></i>
                      Edit Profile
                    </li>
                    <li className="dropdown-item menu" onClick={loggedout}>
                      <i
                        className="fa fa-power-off"
                        aria-hidden="true"
                        style={{
                          paddingRight: "5px",
                          pointerEvents: `${
                            props.match.path === "/videoChat" ? "none" : ""
                          }`,
                        }}></i>
                      Log Out
                    </li>
                    {/* <li className="dropdown-item menu">Link 3</li> */}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
}

export default withRouter(LandingPageHeader);
