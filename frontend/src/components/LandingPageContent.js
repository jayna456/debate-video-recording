import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {getDebateVideoList} from "../Actions/debateAction";
import {logout, changeUserStatus} from "../Actions/userAction";
import {
  applyVoteAndCommentToVideo,
  updateWatchCount,
} from "../Actions/debateAction";
import moment from "moment";
import swal from "sweetalert";

import "../assets/css/home.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function LandingPageContent(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [voteCount, setVoteCount] = useState({
    userId: "",
    count: 0,
    videoId: "",
  });
  const [debateVideoList, setDebateVideoList] = useState([]);
  const [voteList, setVoteList] = useState({});

  const stateData = useSelector(state => {
    return state.debate;
  });
  const stateuser = useSelector(state => {
    return state.user;
  });

  useEffect(() => {
    dispatch(getDebateVideoList());
    if (localStorage.getItem("id")) {
      const dataToPass = {
        userId: localStorage.getItem("id"),
      };
      dispatch(changeUserStatus(dataToPass));
    }
  }, []);

  useEffect(() => {
    console.log("state data... ", stateData);
    if (stateData) {
      if (stateData.videoStreamList) {
        setDebateVideoList(stateData.videoStreamList);
      }
      if (stateData.currentVotes) {
        setVoteList(stateData.currentVotes);
      }
    }
  }, [stateData, voteList]);

  const applyVote = async (video, userId) => {
    if (localStorage.getItem("id")) {
      console.log("apply vote fn called", video, userId);
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
          debateVideoList.forEach(videoInfo => {
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
          history.push("/login");
        })
        .catch(e => {
          history.push("/");
        });
    }
  };

  const checkEnd = async id => {
    console.log("ended event ");
    const dataToPass = {
      userId: localStorage.getItem("id"),
      streamId: id,
    };
    await dispatch(updateWatchCount(dataToPass));
    const userId = localStorage.getItem("id");
    debateVideoList.forEach(videoInfo => {
      if (id === videoInfo._id) {
        videoInfo.watched.push({userId});
      }
    });
  };

  return (
    <div>
      <div className="main_container d-flex">
        <div className="main_vids_cat">
          <div className="tabs_of_vids">
            <div className="tab active">Debate Lists</div>
            {/* <div className="tab">Favorites</div>
            <div className="tab">Playlists</div> */}
          </div>
          <div className="category_vids">
            <div className="cat_title">Available Lists</div>
            <div className="grid_container">
              {debateVideoList.length
                ? debateVideoList.map((videoObj, i) => {
                    return (
                      <div key={i}>
                        <div
                          className="video position-relative"
                          key={i}
                          onContextMenu={e => e.preventDefault()}>
                          <video
                            width="100%"
                            controls
                            preload="auto"
                            controlsList={
                              JSON.stringify(
                                stateuser.userProfileInfo.premium
                              ) === "true"
                                ? ""
                                : "nodownload"
                            }
                            onEnded={() => {
                              checkEnd(videoObj._id);
                            }}>
                            <source
                              src={videoObj.videoPath}
                              type='video/webm;codecs:"vp9"'
                            />
                          </video>
                        </div>
                        <div className="d-flex landing_feat_vid_desc video_desc_user flex-column">
                          <div className="d-flex">
                            <div className="watched">
                              <div className="landing_feat_vid_desc_title">
                                watched
                              </div>
                              <div className="watched_desc">
                                <div>{videoObj.watched.length}</div>
                                <img
                                  src={`../assets/images/eye.png`}
                                  alt="eye"
                                />
                              </div>
                            </div>
                            <div className="votes">
                              <div className="landing_feat_vid_desc_title">
                                Votes
                              </div>
                              <div className="landing_votes_desc">
                                <div className="feat_user1">
                                  <img
                                    src={videoObj.debateMember[0].profilePic}
                                    height="30"
                                    width="30"
                                    style={{
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      applyVote(
                                        videoObj,
                                        videoObj.debateMember[0]._id
                                      )
                                    }
                                  />
                                  <div>
                                    {videoObj.votes.length
                                      ? videoObj.votes.filter(
                                          ({userId}) =>
                                            userId ===
                                            videoObj.debateMember[0]._id
                                        ).length
                                      : videoObj.votes.length}
                                  </div>
                                </div>
                                <div className="grey_pipe"></div>
                                <div className="feat_user1">
                                  <img
                                    src={videoObj.debateMember[1].profilePic}
                                    height="30"
                                    width="30"
                                    style={{
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      applyVote(
                                        videoObj,
                                        videoObj.debateMember[1]._id
                                      )
                                    }
                                  />
                                  <div>
                                    {videoObj.votes.length
                                      ? videoObj.votes.filter(
                                          ({userId}) =>
                                            userId ===
                                            videoObj.debateMember[1]._id
                                        ).length
                                      : videoObj.votes.length}{" "}
                                  </div>
                                </div>
                              </div>
                              &nbsp;&nbsp;&nbsp;
                            </div>
                          </div>
                          <p>
                            {videoObj.daysLeft > 7
                              ? "The voting week has expired"
                              : videoObj.daysLeft === 0
                              ? "Uploaded today"
                              : videoObj.daysLeft + " days left"}{" "}
                          </p>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          {/* <div className="category_vids">
            <div className="cat_title">Psychology</div>
            {/* <Slider1 /> <br />
            <Slider1 /> 
            <OwlCarousel
              owl-theme="true"
              className="owl-two"
              margin={20}
              items={3}
              stagePadding={50}
              owl-carousel="true"
              loop={true}
              autoWidth={false}
              style={{ width: "790px" }}
            >
              <div className="video position-relative">
                <button className="play">
                  <img src={`../assets/images/play12.png`} />{" "}
                </button>
                <video id="video2">
                  <source src={`../assets/video/test2.mp4`} type="video/mp4" />
                  <source src={`mov_bbb.ogg" type="video/ogg"`} />
                </video>
              </div>
            </OwlCarousel>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LandingPageContent;
