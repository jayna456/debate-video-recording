import axios from "axios";
import swal from "sweetalert";

export const createDebate = (data) => {
  return (dispatch) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}debate/createNewDebate`, data)
      .then((result) => {
        if (result.data.code === 200) {
          dispatch({
            type: "CREATE_DEBATE",
            payload: result.data.data,
          });

          if (data.proposal === "Private Proposal") {
          } else {
            swal("Debate created!", result.data.message, "success").then(
              (returnValue) => {
                // window.location.reload();
              }
            );
          }
        } else {
          dispatch({
            type: "CREATE_DEBATE",
            payload: result.data.message,
          });

          swal(result.data.message, "error").then((returnValue) => {
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        console.log("error in creation... ", error);
        dispatch({
          type: "ERROR",
        });

        swal("Something went wrong!", "error");
      });
  };
};

export const viewDebate = () => {
  return (dispatch) => {
    console.log("view debate in action file");

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/viewDebates?userId=${localStorage.getItem("id")}`
      )
      .then((result) => {
        console.log("result.data.. ", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "VIEW_DEBATE",
            payload: result.data.data,
          });
        }
      })
      .catch((err) => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const callVideoRecording = () => {
  return (dispatch) => {
    console.log("video recording fn called");
    let data = {
      time: "12 minutes",
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}debate/storeDebate`, data)
      .then((result) => {
        console.log("result.data of callVideoRecording.. ", result.data);
      })
      .catch((err) => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const viewFollowersList = () => {
  return (dispatch) => {
    console.log("followers listing ");

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/viewFollowList?userId=${localStorage.getItem("id")}`
      )
      .then((result) => {
        console.log("result.data of callVideoRecording.. ", result.data);
        dispatch({
          type: "VIEW_FOLLOWERS",
          action: result.data.data,
        });
      })
      .catch((err) => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const checkFollowed = (id, name) => {
  return (dispatch) => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/checkFollowingOrNot?userId=${localStorage.getItem(
          "id"
        )}&id=${id}&name=${name}`
      )
      .then((result) => {
        console.log("rseult of check following or not.. ", result.data);
        dispatch({
          type: "CHECK_FOLLOW",
          payload: result.data,
        });
      })
      .catch((error) => {
        console.log("error.. ", error);
        swal("Something went wrong!!", "error");
      });
  };
};

export const followUser = (data) => {
  return (dispatch) => {
    console.log("data in follow user.. ", data);
    axios
      .post(`${process.env.REACT_APP_API_URL}debate/makeFollow`, data)
      .then((result) => {
        console.log("res.data in follow user ", result.data);
        if (result.data.code == 200) {
          dispatch({
            type: "FOLLOW_USER",
            payload: result.data.data,
          });

          window.location.reload();
        } else {
          swal("Something went wrong!!", "error");
        }
      })
      .catch((error) => {
        console.log("error.. ", error);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const sendPrivateProposal = (data) => {
  return (dispatch) => {
    console.log("private proposal... ", data);

    axios
      .post(`${process.env.REACT_APP_API_URL}debate/sendPrivateProposal`, data)
      .then((result) => {
        console.log("result...", result.data);
        if (result.data.code == 200) {
          dispatch({
            type: "PRIVATE-PROPOSAL",
          });

          swal(
            "Debate Request Sent!",
            "Private proposal sent successfully",
            "success"
          ).then((returnValue) => {
            window.location.reload();
          });
        } else {
          swal("Error", result.data.message, "error");
        }
      })
      .catch((error) => {
        console.log("error in private proposal... ", error);
        swal("Error", "Something went wrong!!", "error");
      });
  };
};

export const viewPrivateProposals = () => {
  return (dispatch) => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/viewPrivateRequests?id=${localStorage.getItem("id")}`
      )
      .then((result) => {
        console.log("result.data private ", result.data);
        if (result.data.code == 200) {
          dispatch({
            type: "VIEW_PRIVATE_PROPOSALS",
            payload: result.data.data,
          });
        } else {
          dispatch({
            type: "VIEW_PRIVATE_PROPOSALS",
            payload: result.data,
          });
        }
      })
      .catch((err) => {
        console.log("error in private proposal ", err);
      });
  };
};

export const privateProposalAcceptReject = (data) => {
  //acceptRejectPrivateProposal
  return (dispatch) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}debate/acceptRejectPrivateProposal`,
        data
      )
      .then((result) => {
        console.log("result.... ", result.data);
        if (result.data.code == 200) {
          dispatch({
            type: "PRIVATE_PROPOSAL",
            payload: result.data.data,
          });

          swal("Info", "You rejected private proposal!", "info").then(() => {
            window.location.reload();
          });
        } else {
          dispatch({
            type: "ERROR",
          });
        }
      })
      .catch((err) => {
        console.log("error in accept reject", err);
      });
  };
};

export const debateView = (data) => {
  return (dispatch) => {
    console.log("req.body for debate view... ", data);

    axios
      .get(`${process.env.REACT_APP_API_URL}debate/getDebateForEdit?id=${data}`)
      .then((result) => {
        console.log("result . data", result.data);

        if (result.data.code == 200) {
          dispatch({
            type: "DEBATE_INFO",
            payload: result.data.data,
          });
        } else {
          swal("Error", result.data.message, "error");
        }
      })
      .catch((error) => {
        console.log("error while fetching debate info ", error);
      });
  };
};

export const editDebate = (data) => {
  return (dispatch) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}debate/editCreatedDebate`, data)
      .then((result) => {
        console.log("rseult.data for edit debate... ", result.data);

        if (result.data.code == 200) {
          dispatch({
            type: "EDIT_DEBATE",
            payload: result.data.data,
          });

          swal("Info", "Debate updated successfully!", "info").then(
            (result1) => {
              window.location.reload();
            }
          );
        } else {
          console.log("error... ", result.data);
        }
      })
      .catch((err) => {
        console.log("error in edit debate... ", err);
      });
  };
};

export const deleteDebate = (data) => {
  return (dispatch) => {
    console.log("action called", data);
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}debate/deleteCreatedDebate?id=${data}`
      )
      .then((result) => {
        console.log("delete debate response ", result.data);

        if (result.data.code == 200) {
          dispatch({
            type: "DELETE_DEBATE",
          });

          swal("Info", "Debate deleted successfully!", "info").then(
            (result1) => {
              window.location.reload();
            }
          );
        } else {
          console.log("error... ", result.data);
        }
      })
      .catch((err) => {
        console.log("error... ", err);
      });
  };
};
