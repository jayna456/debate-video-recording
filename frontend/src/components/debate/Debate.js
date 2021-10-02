import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/debate.scss";
import {
  createDebate,
  viewDebate,
  sendPrivateProposal,
  editDebate,
  deleteDebate,
  privateProposalAcceptReject,
  updateDebateStream,
  remveDebateOnClose,
} from "../../Actions/debateAction";
import {
  searchDebeate,
  logout,
  changeUserStatus,
} from "../../Actions/userAction";
import SelectSearch from "react-select-search";
import firebase from "../firebase";

import $ from "jquery";
import swal from "sweetalert";
import moment from "moment";

const Debate = props => {
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [opnion, setOpnion] = useState("");
  const [proposal, setProposal] = useState("");
  const [userList, setUserList] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [storeDebate, setStoreDebate] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [storedDebateInfo, setStoredDebateInfo] = useState({});
  const [debateList, setDebateList] = useState([]);
  const [newCreatedDebate, setNewCreatedDebate] = useState({});

  const dispatch = useDispatch();
  const stateData = useSelector(state => {
    return state.debate;
  });

  const stateUserData = useSelector(state => {
    return state.user;
  });

  const dataToPass = {
    type: "user",
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    if (
      localStorage.getItem("debateAccountToken") &&
      localStorage.getItem("id") &&
      localStorage.getItem("email")
    ) {
      dispatch(viewDebate());
      dispatch(searchDebeate(dataToPass));
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          const receiverRef = firebase.database().ref();
          receiverRef.once("value", snapshot => {
            snapshot.forEach(value => {
              const singleObjValue = value.val();
            });
          });
        }
      });
      window.addEventListener("beforeunload", ev => {
        console.log("stateData.reload ", stateData.reload);
        // if (stateData.reload !== "currentPageReload") {
        const dataToPass = {
          debateId: stateData.newDebate._id,
        };
        dispatch(remveDebateOnClose(dataToPass));
        dispatch(logout());
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            const receiverRef = firebase.database().ref();
            let key1;
            receiverRef.on("value", snapshot => {
              snapshot.forEach(value => {
                const singleObjValue = value.val();
                if (
                  singleObjValue.loginUserId === localStorage.getItem("id") &&
                  (singleObjValue.proposalType == "Public Proposal" ||
                    singleObjValue.proposalType == "public proposal")
                ) {
                  key1 = firebase.database().ref().child(value.key);
                }
              });
              receiverRef.onDisconnect().remove();
            });
          }
        });
        ev.returnValue = "There is pending work. Sure you want to leave?";
        return ev.returnValue;
        // }
      });
    } else {
      props.history.push("/");
    }
  }, [stateData.newDebate || stateData.updatedDebate]);

  useEffect(() => {
    console.log("stateData.... ", stateData);
    if (stateData) {
      if (stateData.debateList) {
        setDebateList(stateData.debateList);
      }
      if (stateData.closedValue) {
        dispatch(viewDebate());
      }
      if (stateData.newDebate) {
        setNewCreatedDebate(stateData.newDebate);
      }
    }
  }, [stateData]);

  const onSubmitDebate = async event => {
    event.preventDefault();
    console.log("val... ", name, time, mode);

    if (name && mode && time && proposal && opnion && language) {
      if (
        time != "Select time option" &&
        mode != "Select debate mode" &&
        opnion != "Select opnion" &&
        proposal != "Select Proposal" &&
        name != " " &&
        language != " "
      ) {
        console.log("all gud");
        if (proposal === "Private Proposal") {
          const dataToPass = {
            userId: localStorage.getItem("id"),
            topicName: name,
            language: language,
            debateTime: time,
            status: "pending",
            debateStatus: mode,
            opnion: opnion,
            proposal: proposal,
            createdDate: moment(),
          };

          await dispatch(createDebate(dataToPass));
          setStoreDebate(true);
        } else {
          const dataToPass = {
            userId: localStorage.getItem("id"),
            topicName: name,
            language: language,
            debateTime: time,
            status: "pending",
            debateStatus: mode,
            opnion: opnion,
            proposal: proposal,
            createdDate: moment(),
          };
          await dispatch(createDebate(dataToPass));
          // if (stateData.newDebate) {
          let members = [];
          members.push(localStorage.getItem("id"));
          const firebaseObj = {
            topicName: name,
            debateTime: time,
            debateStatus: mode,
            opnion: opnion,
            proposalType: proposal,
            loginUserId: localStorage.getItem("id"),
            members: members,
            acceptRequest: false,
            viewed: false,
            debateId: stateData.newDebate ? stateData.newDebate._id : "",
          };
          console.log("firebase obj to push... ", firebaseObj);
          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              let uid = user.uid;
              const senderRef = firebase.database().ref();
              senderRef.push(firebaseObj);
            } else {
              console.log("firebase user sign out");
            }
          });
          // }
          window.$("#exampleModal").modal("hide");
          document.getElementById("createDebateForm").reset();
        }
      } else {
        console.log("fields are not selected properly");
        swal("Error", "Please fill up all fields!", "error");
      }
    } else {
      console.log("something missed");
      swal("Error", "Please fill up all fields!", "error");
    }
  };

  const onPrivateSelection = async event => {
    // console.log("stateUserData", event);
    setProposal(event);
    let list = [];

    if (
      stateUserData &&
      stateUserData.searchList &&
      stateUserData.searchList.length
    ) {
      stateUserData.searchList.forEach(userInfo => {
        list.push({
          name: userInfo.topicName,
          value: userInfo.userId,
        });
      });
      setUserList(list);
    }
  };

  const selectValue = e => {
    setReceiverId(e);
  };

  async function callPrivateProposal() {
    console.log("fn called", receiverId);
    if (stateData.newDebate) {
      let members = [];
      members.push(localStorage.getItem("id"));
      members.push(receiverId);
      const firebaseObj = {
        topicName: stateData.newDebate.topicName,
        debateTime: stateData.newDebate.debateTime,
        debateStatus: stateData.newDebate.debateStatus,
        opnion: stateData.newDebate.opnion,
        proposalType: stateData.newDebate.proposalType,
        loginUserId: receiverId,
        members: members,
        debateId: stateData.newDebate._id,
        acceptRequest: false,
        viewed: false,
      };
      console.log("firebase obj to push for private proposal   ", firebaseObj);
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          const senderRef = firebase.database().ref();
          senderRef.push(firebaseObj);
        } else {
          console.log("firebase user sign out");
        }
      });

      const dataForPrivate = {
        userId: localStorage.getItem("id"),
        receiverId: receiverId,
        debateId: stateData.newDebate._id,
      };

      await dispatch(sendPrivateProposal(dataForPrivate));
      window.$("#exampleModal").modal("hide");
    }
  }

  const showDebate = async debateId => {
    console.log("show debate info.... ", debateId);
    if (debateId.userId === localStorage.getItem("id")) {
      setStoredDebateInfo(debateId);
    }
  };

  const submitUpdate = async e => {
    e.preventDefault();

    const dataToPass = {
      id: storedDebateInfo._id,
      userId: localStorage.getItem("id"),
      topicName: name ? name : storedDebateInfo.topicName,
      language: storedDebateInfo.language,
      debateTime: time ? time : storedDebateInfo.debateTime,
      status: "pending",
      debateStatus: mode ? mode : storedDebateInfo.debateStatus,
      opnion: opnion ? opnion : storedDebateInfo.opnion,
      proposal: proposal ? proposal : storedDebateInfo.proposalType,
      receiverId: receiverId ? receiverId : "",
    };

    await dispatch(editDebate(dataToPass));
    setShowAlert(true);
    window.$("#exampleModal1").modal("hide");
    document.getElementById("updateDebateForm").reset();
    console.log("updatedDebate", stateData.updatedDebate);
    if (stateData.debateList.length) {
      stateData.debateList.forEach(debateInfo => {
        if (debateInfo._id === storedDebateInfo._id) {
          debateInfo.userId = localStorage.getItem("id");
          debateInfo.topicName = name ? name : storedDebateInfo.topicName;
          debateInfo.language = storedDebateInfo.language;
          debateInfo.debateTime = time ? time : storedDebateInfo.debateTime;
          debateInfo.debateStatus = mode ? mode : storedDebateInfo.debateStatus;
          debateInfo.opnion = opnion ? opnion : storedDebateInfo.opnion;
          debateInfo.proposal = proposal
            ? proposal
            : storedDebateInfo.proposalType;
          debateInfo.receiverId = receiverId ? receiverId : "";
        }
      });

      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          const receiverRef = firebase.database().ref();
          let keyPath;
          receiverRef.once("value", snapshot => {
            snapshot.forEach(value => {
              const singleObjValue = value.val();
              if (
                singleObjValue.loginUserId == localStorage.getItem("id") &&
                (singleObjValue.proposalType == "Public Proposal" ||
                  singleObjValue.proposalType == "public proposal")
              ) {
                keyPath = firebase.database().ref().child(value.key);
              }
            });
          });
          console.log("key path.. ", keyPath);
          receiverRef.child(keyPath.path.pieces_[0]).update({
            topicName: name ? name : storedDebateInfo.topicName,
            language: storedDebateInfo.language,
            debateTime: time ? time : storedDebateInfo.debateTime,
            debateStatus: mode ? mode : storedDebateInfo.debateStatus,
            opnion: opnion ? opnion : storedDebateInfo.opnion,
            proposal: proposal ? proposal : storedDebateInfo.proposalType,
          });
        }
      });
    }
  };

  const callDelete = async () => {
    console.log(" delete fn called");
    setShowAlert(false);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let uid = user.uid;
        const receiverRef = firebase.database().ref();
        let key1;
        receiverRef.once("value", snapshot => {
          snapshot.forEach(value => {
            const singleObjValue = value.val();
            if (singleObjValue.debateId == storedDebateInfo._id) {
              key1 = firebase.database().ref().child(value.key);
            }
          });
        });
        receiverRef.remove(key1);
      }
    });

    await dispatch(deleteDebate(storedDebateInfo._id, "button"));
  };

  const closeAlert = () => {
    console.log("close alert fn called");
    setShowAlert(false);
    const dataToPass = {
      debateId: stateData.newDebate._id,
    };
    dispatch(remveDebateOnClose(dataToPass));
  };

  async function joinDebate(debateInfo, e) {
    console.log("join debate fn called");
    e.preventDefault();
    const userId = debateInfo.userId;
    const joinedUser = localStorage.getItem("id");
    setShowAlert(false);
    const receiverRef = firebase.database().ref();
    let members = [];
    let key1;
    let turnValue = {};
    receiverRef.on("value", snapshot => {
      console.log("value from firebase db... ", snapshot);
      snapshot.forEach(function (childSnapshot) {
        console.log(
          "firebase val... ",
          childSnapshot.val(),
          childSnapshot.key,
          childSnapshot.val().topicName,
          debateInfo.topicName
        );
        if (childSnapshot.val().topicName == debateInfo.topicName) {
          setShowAlert(false);
          members = childSnapshot.val().members;
          key1 = childSnapshot.key;
          if (childSnapshot.val().debateStatus === "per turns") {
            turnValue = {
              [userId]: true,
              [joinedUser]: false,
            };
          }
        }
      });
    });
    members.push(localStorage.getItem("id"));
    if (key1) {
      receiverRef.child(key1).update({
        acceptRequest: true,
        viewed: true,
        // loginUserId: debateInfo.userId,
        debateId: debateInfo._id,
        members: members,
        comments: [{userId: ""}],
        turnValue: turnValue,
        joinedTime: moment().toString(),
      });
    }
    props.history.push({
      pathname: "/videoChat",
      state: {
        messageToPass: "makeAnswerRequest",
        debateId: debateInfo._id,
        name: debateInfo.topicName,
        members: members,
      },
    });
    const dataToPass = {
      debateId: debateInfo._id,
    };
    await dispatch(updateDebateStream(dataToPass));
  }

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />
      <div className="main-content">
        {console.log("showAlert  ", showAlert)}
        {stateData.newDebate ? (
          <div
            className="alert alert-warning alert-dismissible"
            role="alert"
            style={{textAlign: "center"}}>
            <a
              className="close"
              data-dismiss="alert"
              aria-label="close"
              onClick={() => closeAlert()}>
              &times;
            </a>
            Looking for an opponent
          </div>
        ) : (
          // ) : null
          <div></div>
        )}
        <button
          type="button"
          className="btn btn-default newModal"
          data-toggle="modal"
          data-target="#exampleModal"
          tabIndex={-1}
          // onClick={openModal}
        >
          Create Debate
        </button>
        <table className="table" style={{border: "none"}}>
          <thead>
            <tr>
              <td>Topic Name</td>
              <td>Time</td>
              <td>Language</td>
              <td>Opinion</td>
              <td>Debate Mode</td>
            </tr>
          </thead>
          <tbody>
            {debateList.length ? (
              debateList.map(debateInfo => (
                <tr
                  key={debateInfo._id}
                  onClick={() => showDebate(debateInfo)}
                  style={{
                    cursor:
                      debateInfo.userId === localStorage.getItem("id")
                        ? "pointer"
                        : "",
                  }}
                  data-toggle={
                    debateInfo.userId === localStorage.getItem("id")
                      ? "modal"
                      : ""
                  }
                  data-target={
                    debateInfo.userId === localStorage.getItem("id")
                      ? "#exampleModal1"
                      : ""
                  }
                  tabIndex={-1}>
                  <td>{debateInfo.topicName}</td>
                  <td>{debateInfo.debateTime}</td>
                  <td>{debateInfo.language}</td>
                  <td>{debateInfo.opnion}</td>
                  <td>{debateInfo.debateStatus}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-default newModal"
                      onClick={e => {
                        joinDebate(debateInfo, e);
                      }}
                      disabled={
                        debateInfo.userId === localStorage.getItem("id")
                          ? true
                          : false
                      }
                      style={{
                        color:
                          debateInfo.userId === localStorage.getItem("id")
                            ? "black"
                            : "",
                      }}>
                      Join Debate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <p style={{textAlign: "center"}}>
                    <b>No debates found</b>
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form
              onSubmit={event => onSubmitDebate(event)}
              id="createDebateForm">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  New Debate
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label
                    htmlFor="exampleFormControlSelect2"
                    className="d-flex align-items-center"
                    style={{alignItems: "center"}}>
                    Choose a time option&nbsp;
                    <p className="tooltip">
                      ?
                      <span className="tooltiptext" style={{width: "290px"}}>
                        Duration time of Debate i.e. 12 minutes, 30 minutes and
                        1 hour and 30 minutes
                      </span>
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect2"
                    onChange={e => setTime(e.target.value)}>
                    <option>Select time option</option>
                    <option value="12 minutes">12 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour and 30 minutes">
                      1 hour and 30 minutes
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="mode"
                    className="d-flex"
                    style={{alignItems: "center"}}>
                    Choose debate mode&nbsp;
                    <p className="tooltip">
                      ?
                      <span className="tooltiptext" style={{width: "290px"}}>
                        Open mode lets both debaters talk simultaneously, while
                        the other one it is per turns and mutes the other user.
                      </span>
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={e => setMode(e.target.value)}>
                    <option>Select debate mode</option>
                    <option value="open mode">open mode</option>
                    <option value="per turns">per turns</option>
                  </select>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="d-flex"
                    style={{alignItems: "center"}}>
                    Enter Debate topic&nbsp;
                    <p className="tooltip">
                      ?
                      <span className="tooltiptext" style={{width: "260px"}}>
                        Topic on which debate will happen
                      </span>
                    </p>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Enter Debate topic"
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lang">Enter Language</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lang"
                    placeholder="Enter Language"
                    onChange={e => setLanguage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="lang"
                    className="d-flex"
                    style={{alignItems: "center"}}>
                    Select opinion&nbsp;
                    <p className="tooltip">
                      ?
                      <span className="tooltiptext" style={{width: "320px"}}>
                        From Debate topic select your opinion like: Agree,
                        Disagree, Some what agree, Some what disagree
                      </span>
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={e => setOpnion(e.target.value)}>
                    <option>Select opinion</option>
                    <option value="AGREE">AGREE</option>
                    <option value="SOMEWHAT AGREE">SOMEWHAT AGREE</option>
                    <option value="SOMEWHAT DISAGREE">SOMEWHAT DISAGREE</option>
                    <option value="DISAGREE">DISAGREE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="lang"
                    className="d-flex"
                    style={{alignItems: "center"}}>
                    Select Proposal&nbsp;
                    <p className="tooltip">
                      ?
                      <span className="tooltiptext" style={{width: "360px"}}>
                        Private proposal lets you allow to send proposal to user
                        directly, where in public proposal anyone can join
                        debate
                      </span>
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={e => onPrivateSelection(e.target.value)}>
                    <option>Select Proposal</option>
                    <option value="Private Proposal">Private Proposal</option>
                    <option value="Public Proposal">Public Proposal</option>
                  </select>
                </div>
                {proposal === "Private Proposal" ? (
                  <div className="form-group">
                    <SelectSearch
                      classNamePrefix="form-control"
                      options={userList}
                      search
                      placeholder="Search User"
                      onChange={e => selectValue(e)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal">
                  Close
                </button>
                {storeDebate ? (
                  <button
                    type="button"
                    className="btn btn-primary newModal"
                    onClick={() => callPrivateProposal()}
                    disabled={stateData.newDebate ? false : true}>
                    Send Private Proposal
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary newModal">
                    Create Debate
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel1"
        aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form id="updateDebateForm">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Debate Detail
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect2" className="d-flex">
                    Choose a time option
                    <p
                      rel="tooltip"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top">
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect2"
                    onChange={e => setTime(e.target.value)}
                    value={time ? time : storedDebateInfo.debateTime || ""}>
                    <option>Select time option</option>
                    <option value="12 minutes">12 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour and 30 minutes">
                      1 hour and 30 minutes
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="mode" className="d-flex">
                    Choose debate mode
                    <p
                      rel="tooltip"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top">
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={e => setMode(e.target.value)}
                    value={mode ? mode : storedDebateInfo.debateStatus || ""}>
                    <option>Select debate mode</option>
                    <option value="open mode">open mode</option>
                    <option value="per turns">per turns</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1" className="d-flex">
                    Enter Debate topic
                    <p
                      rel="tooltip"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top">
                      &nbsp; ?
                    </p>
                  </label>
                  <input
                    type="text"
                    value={name ? name : storedDebateInfo.topicName || ""}
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Enter Debate topic"
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lang">Enter Language</label>
                  <input
                    value={
                      language ? language : storedDebateInfo.language || ""
                    }
                    type="text"
                    className="form-control"
                    id="lang"
                    placeholder="Enter Language"
                    onChange={e => setLanguage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lang" className="d-flex">
                    Select opinion
                    <p
                      rel="tooltip"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top">
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={e => setOpnion(e.target.value)}
                    value={opnion ? opnion : storedDebateInfo.opnion || ""}>
                    <option>Select opinion</option>
                    <option value="AGREE">AGREE</option>
                    <option value="SOMEWHAT AGREE">SOMEWHAT AGREE</option>
                    <option value="SOMEWHAT DISAGREE">SOMEWHAT DISAGREE</option>
                    <option value="DISAGREE">DISAGREE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="lang" className="d-flex">
                    Select Proposal
                    <p
                      rel="tooltip"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top">
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={e => onPrivateSelection(e.target.value)}
                    value={
                      proposal ? proposal : storedDebateInfo.proposalType || ""
                    }>
                    <option>Select Proposal</option>
                    <option value="Private Proposal">Private Proposal</option>
                    <option value="Public Proposal">Public Proposal</option>
                  </select>
                </div>
                {proposal === "Private Proposal" ? (
                  <div className="form-group">
                    <SelectSearch
                      classNamePrefix="form-control"
                      options={userList}
                      search
                      placeholder="SEARCH USER"
                      onChange={e => selectValue(e)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{float: "left"}}
                  onClick={callDelete}>
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal">
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary newModal"
                  onClick={e => submitUpdate(e)}>
                  Update Debate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debate;
