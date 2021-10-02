import axios from "axios";
import swal from "sweetalert";

export const createDebate = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}debate/createNewDebate`, data)
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "CREATE_DEBATE",
            payload: result.data.data,
          });

          if (data.proposal === "Private Proposal") {
          } else {
            swal("Debate created!", result.data.message, "success").then(
              returnValue => {
                console.log("retutn... ");
                dispatch({
                  type: "INITIAL_VAL",
                  reload: "currentPageReload",
                });
                // window.location.reload();
              }
            );
          }
        } else {
          dispatch({
            type: "CREATE_DEBATE",
            payload: result.data.message,
          });

          swal(result.data.message, "error").then(returnValue => {
            window.location.reload();
          });
        }
      })
      .catch(error => {
        console.log("error in creation... ", error);
        dispatch({
          type: "ERROR",
        });

        swal("Something went wrong!", "error");
      });
  };
};

export const viewDebate = () => {
  return dispatch => {
    console.log("view debate in action file");

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/viewDebates?userId=${localStorage.getItem("id")}`
      )
      .then(result => {
        console.log("result.data.. ", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "VIEW_DEBATE",
            payload: result.data.data,
          });
        }
      })
      .catch(err => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const callVideoRecording = url => {
  return dispatch => {
    console.log("video recording fn called");
    let fd = new FormData();
    fd.append("file", url);

    axios
      .post(`${process.env.REACT_APP_API_URL}debate/storeDebate`, fd)
      .then(result => {
        console.log("result.data of callVideoRecording.. ", result.data);
      })
      .catch(err => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const viewFollowersList = () => {
  return dispatch => {
    console.log("followers listing ");

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/viewFollowList?userId=${localStorage.getItem("id")}`
      )
      .then(result => {
        console.log("result.data of view follow list.. ", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "VIEW_FOLLOWERS",
            payload: result.data.data,
          });
        } else {
          swal("Info", result.data.message, "error");
        }
      })
      .catch(err => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const checkFollowed = (id, name) => {
  return dispatch => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/checkFollowingOrNot?userId=${localStorage.getItem(
          "id"
        )}&id=${id}&name=${name}`
      )
      .then(result => {
        console.log("rseult of check following or not.. ", result.data);
        dispatch({
          type: "CHECK_FOLLOW",
          payload: result.data,
        });
      })
      .catch(error => {
        console.log("error.. ", error);
        swal("Something went wrong!!", "error");
      });
  };
};

export const followUser = data => {
  return dispatch => {
    console.log("data in follow user.. ", data);
    axios
      .post(`${process.env.REACT_APP_API_URL}debate/makeFollow`, data)
      .then(result => {
        console.log("res.data in follow user ", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "FOLLOW_USER",
            payload: result.data.data,
          });

          window.location.reload();
        } else {
          swal("Something went wrong!!", "error");
        }
      })
      .catch(error => {
        console.log("error.. ", error);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const sendPrivateProposal = data => {
  return dispatch => {
    console.log("private proposal... ", data);

    axios
      .post(`${process.env.REACT_APP_API_URL}debate/sendPrivateProposal`, data)
      .then(result => {
        console.log("result...", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "PRIVATE-PROPOSAL",
          });

          swal(
            "Debate Request Sent!",
            "Private proposal sent successfully",
            "success"
          ).then(returnValue => {
            // window.location.reload();
          });
        } else {
          swal("Error", result.data.message, "error");
        }
      })
      .catch(error => {
        console.log("error in private proposal... ", error);
        swal("Error", "Something went wrong!!", "error");
      });
  };
};

export const viewPrivateProposals = () => {
  return dispatch => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/viewPrivateRequests?id=${localStorage.getItem("id")}`
      )
      .then(result => {
        console.log("result.data private ", result.data);
        if (result.data.code === 200) {
          localStorage.setItem("notificationLength", result.data.data.length);
          dispatch({
            type: "VIEW_PRIVATE_PROPOSALS",
            payload: result.data.data,
          });
        } else {
          dispatch({
            type: "ERROR_PRIVATE_MESSAGE",
            payload: result.data.message,
          });
        }
      })
      .catch(err => {
        console.log("error in private proposal ", err);
      });
  };
};

export const privateProposalAcceptReject = data => {
  //acceptRejectPrivateProposal
  return dispatch => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}debate/acceptRejectPrivateProposal`,
        data
      )
      .then(result => {
        console.log("result.... ", result.data);
        if (result.data.code == 200) {
          dispatch({
            type: "PRIVATE_PROPOSAL",
            payload: result.data.data,
          });

          if (data.status == "reject") {
            swal("Info", "Debate proposal missed!", "info").then(() => {
              window.location.reload();
            });
          } else {
            // redirect to video page where debate will start
          }
        } else {
          dispatch({
            type: "ERROR",
          });
        }
      })
      .catch(err => {
        console.log("error in accept reject", err);
      });
  };
};

export const debateView = data => {
  return dispatch => {
    console.log("req.body for debate view... ", data);

    axios
      .get(`${process.env.REACT_APP_API_URL}debate/getDebateForEdit?id=${data}`)
      .then(result => {
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
      .catch(error => {
        console.log("error while fetching debate info ", error);
      });
  };
};

export const editDebate = data => {
  return dispatch => {
    axios
      .put(`${process.env.REACT_APP_API_URL}debate/editCreatedDebate`, data)
      .then(result => {
        console.log("rseult.data for edit debate... ", result.data);

        if (result.data.code == 200) {
          dispatch({
            type: "EDIT_DEBATE",
            payload: result.data.data,
          });

          swal("Info", "Debate updated successfully!", "info").then(result1 => {
            // window.location.reload();
          });
        } else {
          console.log("error... ", result.data);
        }
      })
      .catch(err => {
        console.log("error in edit debate... ", err);
      });
  };
};

export const deleteDebate = (data, text) => {
  return dispatch => {
    console.log("action called", data);
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}debate/deleteCreatedDebate?id=${data}`
      )
      .then(result => {
        console.log("delete debate response ", result.data);

        if (result.data.code == 200) {
          dispatch({
            type: "DELETE_DEBATE",
          });

          if (text !== "join") {
            swal("Info", "Debate deleted successfully!", "info").then(
              result1 => {
                window.location.reload();
              }
            );
          }
        } else {
          console.log("error... ", result.data);
        }
      })
      .catch(err => {
        console.log("error... ", err);
      });
  };
};

export const followersCount = id => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}debate/getFollowersList?id=${id}`)
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "FOLLOWERS_COUNT",
            payload: result.data.data,
          });
        } else {
          dispatch({
            type: "ERROR",
          });
        }
      })
      .catch(error => {
        console.log("error ", error);
      });
  };
};

export const getDebateVideoList = () => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}debate/getDebateStreamList`)
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "VIDEO_LIST",
            payload: result.data.data,
          });
        }
      })
      .catch(error => {
        console.log("error in fetching data... ", error);
      });
  };
};

export const getUserVideoList = id => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}debate/getUserDebateList?id=${id}`)
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "USER_VIDEO_LIST",
            payload: result.data.data,
          });
        } else {
          dispatch({
            type: "ERR_USER_VIDEO_LIST",
            payload: [],
          });
        }
      })
      .catch(error => {
        console.log("error in get user video list ", error);
      });
  };
};

export const updateWatchCount = data => {
  return dispatch => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}debate/updateWatchCountInVideo`,
        data
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "WATCH_COUNT",
          });
        }
      })
      .catch(error => {
        console.log("error in ..", error);
      });
  };
};

export const applyVoteAndCommentToVideo = data => {
  return dispatch => {
    axios
      .put(`${process.env.REACT_APP_API_URL}debate/applyVoteAndComment`, data)
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "VOTE_COMMENT",
            payload: result.data.data,
          });
        }
      })
      .catch(error => {
        console.log("error in voting", error);
      });
  };
};

export const getDebate = data => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}debate/getDebateInfo?id=${data}`)
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "GET_DEBATE",
            payload: result.data.data,
          });
        }
      })
      .catch(error => {
        console.log("error ", error);
      });
  };
};

export const updateDebateStream = data => {
  return dispatch => {
    axios
      .put(`${process.env.REACT_APP_API_URL}debate/upadateToJoinDebate`, data)
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "JOIN_DEBATE",
          });
        }
      })
      .catch(error => {
        console.log("error ", error);
      });
  };
};

export const remveDebateOnClose = data => {
  return dispatch => {
    axios
      .patch(`${process.env.REACT_APP_API_URL}debate/onCloseRemoveDebate`, data)
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "ONCLOSE_REMOVE_DEBATE",
            payload: result.data.status,
          });
        }
      })
      .catch(error => {
        console.log("errro in on close remove debate", error);
        dispatch({
          type: "error",
        });
      });
  };
};

export const updatePublicToPrivate = data => {
  return dispatch => {
    axios
      .patch(`${process.env.REACT_APP_API_URL}debate/publicToPrivate`, data)
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "PUBLIC_TO_PRIVATE",
            payload: result.data.data,
          });

          swal(
            "Debate request send!",
            "Debate request send successfully",
            "success"
          ).then(returnValue => {
            console.log("retutn... ");
          });
        }
      })
      .catch(error => {
        console.log("error in public to private ", error);
        dispatch({
          type: "error",
        });
        swal("Error", error.toString(), "error");
      });
  };
};

export const unFollowUser = data => {
  return dispatch => {
    axios
      .patch(`${process.env.REACT_APP_API_URL}debate/unFollowUser`, data)
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: "UNFOLLOW",
          });
          window.location.reload();
        }
      })
      .catch(error => {
        console.log("error wihle unfollowing ", error.toString);
      });
  };
};

export const MakeEmptyReducer = () => {
  return dispatch => {
    dispatch({
      type: "VOTE_COMMENT",
      payload: null,
    });
  };
};
