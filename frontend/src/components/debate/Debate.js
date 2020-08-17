import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/debate.scss";
import {
  createDebate,
  viewDebate,
  sendPrivateProposal,
  editDebate,
  deleteDebate,
} from "../../Actions/debateAction";
import { searchDebeate } from "../../Actions/userAction";
import SelectSearch from "react-select-search";

import $ from "jquery";
import swal from "sweetalert";

const Debate = (props) => {
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [opnion, setOpnion] = useState("");
  const [proposal, setProposal] = useState("");
  const [userList, setUserList] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [storeDebate, setStoreDebate] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [storedDebateInfo, setStoredDebateInfo] = useState({});

  const timeOption = useRef();
  const dispatch = useDispatch();
  const stateData = useSelector((state) => {
    console.log("debate.. ", state.debate.newDebate);
    return state.debate;
  });

  const stateUserData = useSelector((state) => {
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
      // $('[data-toggle="tooltip"]').tooltip();
    } else {
      props.history.push("/");
    }
  }, [stateData.newDebate]);

  const onSubmitDebate = async (event) => {
    event.preventDefault();
    console.log("val... ", name, time, mode);

    if (name && mode && time && proposal && opnion && language) {
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
        };

        await dispatch(createDebate(dataToPass));
        setStoreDebate(true);
      } else {
        const dataToPass = {
          userId: localStorage.getItem("id"),
          topicName: name,
          // debateDate: date,
          language: language,
          debateTime: time,
          status: "pending",
          debateStatus: mode,
          opnion: opnion,
          proposal: proposal,
        };

        await dispatch(createDebate(dataToPass));
      }
      window.$("#exampleModal").modal("hide");
    } else {
      console.log("something missed");
      swal("Error", "Please fillup all fields!", "error");
    }
  };

  const onPrivateSelection = async (event) => {
    // console.log("stateUserData", event);
    setProposal(event);
    let list = [];

    if (
      stateUserData &&
      stateUserData.searchList &&
      stateUserData.searchList.length
    ) {
      stateUserData.searchList.forEach((userInfo) => {
        list.push({
          name: userInfo.topicName,
          value: userInfo.userId,
        });
      });
      setUserList(list);
    }
  };

  const selectValue = (e) => {
    setReceiverId(e);
  };

  const callPrivateProposal = async () => {
    console.log("fn called", receiverId);
    const dataForPrivate = {
      userId: localStorage.getItem("id"),
      receiverId: receiverId,
      debateId: stateData.newDebate._id,
    };

    await dispatch(sendPrivateProposal(dataForPrivate));
  };

  const showDebate = async (debateId) => {
    console.log("show debate info.... ", debateId);
    setEditModel(true);
    setStoredDebateInfo(debateId);
  };

  const submitUpdate = async (e) => {
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
  };

  const callDelete = async () => {
    console.log(" delete fn called");

    await dispatch(deleteDebate(storedDebateInfo._id));
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />
      <div className="main-content">
        {console.log("stateData.newDebate ", stateData.newDebate == undefined)}
        {stateData ? (
          stateData.newDebate != undefined ? (
            <div
              className="alert alert-warning"
              role="alert"
              style={{ textAlign: "center" }}
            >
              Looking for an opponent
            </div>
          ) : null
        ) : null}
        <button
          type="button"
          className="btn btn-default newModal"
          data-toggle="modal"
          data-target="#exampleModal"
          tabIndex={-1}
        >
          Create Debate
        </button>
        <table className="table" style={{ border: "none" }}>
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
            {stateData.debateList ? (
              stateData.debateList.length ? (
                stateData.debateList.map((debateInfo) => (
                  <tr
                    key={debateInfo._id}
                    onClick={() => showDebate(debateInfo)}
                    style={{ cursor: "pointer" }}
                    data-toggle="modal"
                    data-target="#exampleModal1"
                    tabIndex={-1}
                  >
                    <td>{debateInfo.topicName}</td>
                    {/* <td>{debateInfo.debateDate}</td> */}
                    <td>{debateInfo.debateTime}</td>
                    <td>{debateInfo.language}</td>
                    <td>{debateInfo.opnion}</td>
                    <td>{debateInfo.debateStatus}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-default newModal"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        tabIndex={-1}
                      >
                        Join Debate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <p style={{ textAlign: "center" }}>
                      <b>No debates found</b>
                    </p>
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="5">
                  <p style={{ textAlign: "center" }}>
                    <b>Loading...</b>
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
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={(event) => onSubmitDebate(event)}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  New Debate
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
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
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect2"
                    onChange={(e) => setTime(e.target.value)}
                  >
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
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => setMode(e.target.value)}
                  >
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
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Enter Debate topic"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lang">Enter Language</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lang"
                    placeholder="Enter Language"
                    onChange={(e) => setLanguage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lang" className="d-flex">
                    Select opinion
                    <p
                      rel="tooltip"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => setOpnion(e.target.value)}
                  >
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
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => onPrivateSelection(e.target.value)}
                  >
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
                      onChange={(e) => selectValue(e)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                {storeDebate ? (
                  <button
                    type="button"
                    className="btn btn-primary newModal"
                    onClick={callPrivateProposal}
                  >
                    Send Private Proposal
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary newModal">
                    Create Debate
                  </button>
                )}
                {/* <button type="submit" className="btn btn-primary newModal">
                  {storeDebate ? "Send Private Proposal" : "Create Debate"}
                </button> */}
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
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={(event) => onSubmitDebate(event)}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Debate Detail
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
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
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect2"
                    onChange={(e) => setTime(e.target.value)}
                    value={time ? time : storedDebateInfo.debateTime || ""}
                  >
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
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => setMode(e.target.value)}
                    value={mode ? mode : storedDebateInfo.debateStatus || ""}
                  >
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
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <input
                    type="text"
                    value={name ? name : storedDebateInfo.topicName || ""}
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Enter Debate topic"
                    onChange={(e) => setName(e.target.value)}
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
                    onChange={(e) => setLanguage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lang" className="d-flex">
                    Select opinion
                    <p
                      rel="tooltip"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => setOpnion(e.target.value)}
                    value={opnion ? opnion : storedDebateInfo.opnion || ""}
                  >
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
                      title="Tooltip on top"
                    >
                      &nbsp; ?
                    </p>
                  </label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => onPrivateSelection(e.target.value)}
                    value={
                      proposal ? proposal : storedDebateInfo.proposalType || ""
                    }
                  >
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
                      onChange={(e) => selectValue(e)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ float: "left" }}
                  onClick={callDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary newModal"
                  onClick={(e) => submitUpdate(e)}
                >
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
