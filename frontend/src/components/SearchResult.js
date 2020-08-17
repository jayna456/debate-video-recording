import React, { useEffect } from "react";
import "../assets/css/socialHeader.scss";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageSidebar from "./LandingPageSidebar";
import { searchDebeate } from "../Actions/userAction";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function SearchResult(props) {
  console.log("props .. ", props);
  const history = useHistory();
  // const dispatch = useDispatch();
  // const stateData = useSelector((state) => {
  //   return state.user;
  // });

  // useEffect(() => {
  //   const data = {
  //     name: props.location.state,
  //   };
  //   dispatch(searchDebeate(data));
  //   console.log("statedata.. ", stateData);
  // }, []);

  const goToProfile = (topic) => {
    console.log("fn called");
    history.push("/userProfile", topic);
  };

  return (
    <div>
      {/* <LandingPageHeader />
      <LandingPageSidebar />
      <div className="row">
        <div className="col-12">
          <table className="table dt-responsive">
            <tbody>
              {stateData.searchList ? (
                stateData.searchList.length ? (
                  stateData.searchList.map((topic) => (
                    <tr key={topic._id}>
                      <td>{topic.topicName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <b>No debeate found </b>
                      </p>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td>
                    <p style={{ textAlign: "center" }}>
                      <b>Loading...</b>
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <table
                className="table dt-responsive"
                style={{ boxSizing: "inherit" }}
              >
                <tbody>
                  {props.value ? (
                    props.value.length ? (
                      props.value.map((topic, index) => (
                        <tr key={index} onClick={() => goToProfile(topic)}>
                          <td style={{ cursor: "pointer" }}>
                            {topic.topicName}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <p style={{ textAlign: "center" }}>
                            <b>No debeate found </b>
                          </p>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <b>Loading...</b>
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
