import React, {useEffect, useState, useRef} from "react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/user-profile.css";
import {useSelector, useDispatch} from "react-redux";
import {
  checkFollowed,
  followUser,
  sendPrivateProposal,
  viewDebate,
  followersCount,
  getUserVideoList,
  updateWatchCount,
  applyVoteAndCommentToVideo,
  updatePublicToPrivate,
  unFollowUser,
  MakeEmptyReducer,
} from "../../Actions/debateAction";
// import { logout, changeUserStatus } from "../../Actions/userAction";
import swal from "sweetalert";
import firebase from "../firebase";
import moment from "moment";

function UserProfile(props) {
  console.log("props... ", props.location.state);
  const [sendDisable, setSendDisable] = useState(false);
  const [voteCount, setVoteCount] = useState({
    userId: "",
    count: 0,
    videoId: "",
  });
  const [videoList, setVideoList] = useState([]);
  const [voteList, setVoteList] = useState({});
  const userVideo = useRef();
  const _isMounted = useRef(true); // Initial value _isMounted = true

  const dispatch = useDispatch();

  const stateData = useSelector(state => {
    return state.debate;
  });

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    dispatch(
      checkFollowed(props.location.state.userId, props.location.state.topicName)
    );
    dispatch(viewDebate());
    dispatch(followersCount(props.location.state.userId));
    if (_isMounted) dispatch(getUserVideoList(props.location.state.userId));
    return () => {
      // ComponentWillUnmount in Class Component
      _isMounted.current = false;
    };
  }, [props.location.state.userId || stateData.unfollowResponse]);

  useEffect(() => {
    if (stateData) {
      if (stateData.uploadedVideoList && stateData.uploadedVideoList.length) {
        setVideoList(stateData.uploadedVideoList);
      }
      if (stateData.currentVotes) {
        setVoteList(stateData.currentVotes);
      }
    }
  }, [stateData]);

  const clickToFollow = async () => {
    if (stateData.checkFollowed.message == "Not following anyone") {
      if (props.location.state.userId == localStorage.getItem("id")) {
        swal("Error", "Cannot follow!", "error");
      } else {
        const dataToPass = {
          name: props.location.state.topicName,
          id: props.location.state.userId,
          userId: localStorage.getItem("id"),
        };
        await dispatch(followUser(dataToPass));
      }
    } else {
      const dataToPass = {
        userId: localStorage.getItem("id"),
        idToUnfollow: props.location.state.userId,
      };

      await dispatch(unFollowUser(dataToPass));
    }
  };

  const sendProposal = async debateInfo => {
    console.log("send propposal fn called..");
    setSendDisable(true);
    const dataForPrivate = {
      userId: localStorage.getItem("id"),
      receiverId: props.location.state.userId,
      debateId: debateInfo._id,
    };
    let members = [];
    members.push(localStorage.getItem("id"));
    members.push(props.location.state.userId);

    const receiverRef = firebase.database().ref();
    receiverRef.on("value", snapshot => {
      snapshot.forEach(value => {
        const singleObjValue = value.val();

        if (singleObjValue.loginUserId === localStorage.getItem("id")) {
          receiverRef.child(value.key).update({
            loginUserId: props.location.state.userId,
            members: members,
            proposalType: "Private Proposal",
            debateId: debateInfo._id,
          });
        }
      });
    });

    await dispatch(updatePublicToPrivate(dataForPrivate));
    window.$("#exampleModal").modal("hide");
  };

  const checkEnd = async id => {
    console.log("ended event ");
    const dataToPass = {
      userId: localStorage.getItem("id"),
      streamId: id,
    };
    await dispatch(updateWatchCount(dataToPass));
    const userId = localStorage.getItem("id");
    stateData.uploadedVideoList.forEach(videoInfo => {
      if (id === videoInfo._id) {
        videoInfo.watched.push({userId});
      }
    });
  };

  const seekMethod = () => {
    console.log("video calling seek mtd... ");
  };

  const applyVote = async (video, userId) => {
    if (localStorage.getItem("id")) {
      console.log("apply vote fn called in profile page", video, userId);
      const storedDate = moment(video.createdDate).format("YYYY-MM-DD");
      const currentDate = moment().format("YYYY-MM-DD");
      if (moment(currentDate).diff(storedDate, "days") <= 7) {
        const isAlreadyVote = video.votes.filter(
          element => element.voterId === localStorage.getItem("id")
        );
        if (isAlreadyVote.length == 0) {
          console.log("vote list.. ", voteList, video);

          const dataToPass = {
            id: video._id,
            userId,
            loginId: localStorage.getItem("id"),
            vote: 1,
          };
          await dispatch(applyVoteAndCommentToVideo(dataToPass));
          videoList.forEach(videoInfo => {
            if (video._id === videoInfo._id) {
              videoInfo.votes.push({
                userId,
                voterId: localStorage.getItem("id"),
              });
            }
          });
          setVoteCount({
            userId,
            count: (video.votes.filter(
              ({userId}) => userId === userId
            ).length += 1),
            videoId: video._id,
          });
        } else {
          swal("Info", "You can give vote only one time", "info");
        }
      } else {
        swal("Info", "You cannot give vote after 1 week", "error");
      }
    } else {
      swal("Login Required", "Please do login to give vote!", "error")
        .then(() => {
          props.history.push("/login");
        })
        .catch(e => {
          props.history.push("/");
        });
    }
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />

      <div className="main_profile_contents">
        <div className="user_header d-flex justify-content-between align-items-center">
          <div className="user_container d-flex align-items-center">
            <img src={props.location.state.profilePic} alt="profilePic" />
            <div className="prof_details">
              <div className="prof_name">{props.location.state.topicName}</div>
              <div className="follower_counted">
                <span>
                  {stateData.followersCount ? stateData.followersCount : 0}
                </span>{" "}
                Followers
              </div>
            </div>
          </div>
          <div className="user_actions">
            <button
              className="send_props"
              data-toggle="modal"
              data-target="#exampleModal"
              tabIndex={-1}
              disabled={sendDisable}>
              Send a Proposal
            </button>
            <button
              className="follow_btn position-relative"
              onClick={clickToFollow}>
              <img
                src={`../assets/images/following_profile.png`}
                alt="follow_profile"
              />
              {stateData.checkFollowed &&
              stateData.checkFollowed.message &&
              stateData.checkFollowed.message === "Not following anyone"
                ? "Follow"
                : "Following"}
            </button>
          </div>
        </div>
        <div className="title_of_videos">Videos</div>
        <div className="videos_container">
          {videoList.length ? (
            videoList.map((video, i) => {
              return (
                <div className="Profile_vid" key={video._id}>
                  <div className="featured_image position-relative">
                    <div className="video position-relative">
                      <video
                        ref={userVideo}
                        controls
                        onEnded={() => {
                          checkEnd(video._id);
                        }}
                        onSeeking={seekMethod}>
                        <source src={video.videoPath} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                  <div className="d-flex feat_vid_desc video_desc_user flex-column">
                    <div className="d-flex">
                      <div className="watched">
                        <div className="feat_vid_desc_title">watched</div>
                        <div className="watched_desc" />
                        <div>{video.watched.length}</div>
                        <img src={`../assets/images/eye.png`} alt="eye" />
                      </div>
                      <div className="votes">
                        <div className="feat_vid_desc_title">Votes</div>
                        {video.usersProfile.map((member, i) => {
                          if (
                            member.videoId == video._id &&
                            member.userId !== video.userId
                          )
                            return (
                              <div className="votes_desc" key={i}>
                                <div className="feat_user1">
                                  <img
                                    src={member.profilePic}
                                    height="30"
                                    width="30"
                                    style={{
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      applyVote(video, member.userId)
                                    }
                                  />
                                  <div>
                                    {video.votes.length
                                      ? video.votes.filter(
                                          ({userId}) => userId === member.userId
                                        ).length
                                      : video.votes.length}
                                  </div>
                                </div>
                                <div className="grey_pipe"></div>
                                <div className="feat_user1">
                                  <img
                                    src={video.uploadedUserprofilePic}
                                    height="30"
                                    width="30"
                                    style={{
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      applyVote(video, video.userId)
                                    }
                                  />
                                  <div>
                                    {video.votes.length
                                      ? video.votes.filter(
                                          ({userId}) => userId === video.userId
                                        ).length
                                      : video.votes.length}
                                  </div>
                                </div>
                              </div>
                            );
                        })}
                        &nbsp;&nbsp;&nbsp;
                      </div>
                    </div>
                    <p>
                      {video.daysLeft > 7
                        ? "The voting week has expired"
                        : video.daysLeft === 0
                        ? "Uploaded today"
                        : video.daysLeft + " days left"}{" "}
                    </p>
                  </div>
                  <div className="with_user">
                    with <span>{video.userName}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p>
              {videoList && videoList.length
                ? videoList
                : "No videos of this user"}
            </p>
          )}
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Debate List
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
                <table className="table" style={{border: "none"}}>
                  <thead>
                    <tr>
                      <th>Topic Name</th>
                      <th>Time</th>
                      <th>Language</th>
                      <th>Opinion</th>
                      <th>Debate Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stateData.debateList ? (
                      stateData.debateList.length ? (
                        stateData.debateList.map(debateInfo => (
                          <tr
                            key={debateInfo._id}
                            style={{cursor: "pointer"}}
                            data-toggle="modal">
                            <td>{debateInfo.topicName}</td>
                            <td>{debateInfo.debateTime}</td>
                            <td>{debateInfo.language}</td>
                            <td>{debateInfo.opnion}</td>
                            <td>{debateInfo.debateStatus}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-default newModal"
                                onClick={() => sendProposal(debateInfo)}>
                                Send Private Proposal Request
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
                      )
                    ) : (
                      <tr>
                        <td colSpan="5">
                          <p style={{textAlign: "center"}}>
                            <b>Loading...</b>
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
