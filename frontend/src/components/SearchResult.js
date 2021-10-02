import React from "react";
import "../assets/css/socialHeader.scss";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { hideData } from "../Actions/headerAction";

function SearchResult(props) {
  const history = useHistory();
  console.log("props .. ", props);
  const dispatch = useDispatch();

  const goToProfile = topic => {
    console.log("fn called", topic);
    history.push("/userProfile", topic);
    // window.location.reload();
  };

  return (
    <div>
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
                        <tr
                          key={index}
                          onClick={() => {
                            goToProfile(topic);
                            dispatch(hideData());
                          }}
                        >
                          <td style={{ cursor: "pointer" }}>
                            {topic.topicName}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <p style={{ textAlign: "center" }}>
                            <b>No debeates found </b>
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
