import React, { useEffect, useState } from "react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/user-profile.css";
import { useSelector, useDispatch } from "react-redux";
import { checkFollowed, followUser } from "../../Actions/debateAction";
import swal from "sweetalert";
import { sendPrivateProposal } from "../../Actions/debateAction";

function UserProfile(props) {
  console.log("props... ", props.location.state);
  const [checkDisable, setCheckDisable] = useState(false);

  const dispatch = useDispatch();

  const stateData = useSelector((state) => {
    console.log("state... ", state);
    return state.debate;
  });

  useEffect(() => {
    dispatch(
      checkFollowed(props.location.state.userId, props.location.state.topicName)
    );
  }, []);

  const clickToFollow = async () => {
    if (stateData.checkFollowed.message == "Not following anyone") {
      const dataToPass = {
        name: props.location.state.topicName,
        id: props.location.state.userId,
        userId: localStorage.getItem("id"),
      };
      await dispatch(followUser(dataToPass));
    } else {
      setCheckDisable(true);
      swal("Info", "You are already following!", "info");
    }
  };

  const sendProposal = async () => {
    console.log("send propposal fn called..");
    // const dataForPrivate = {
    //   userId: localStorage.getItem("id"),
    //   receiverId: props.location.state.userId,
    //   debateId: stateData.newDebate._id,
    // };
    // await dispatch(sendPrivateProposal(dataForPrivate));
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />

      <div className="main_profile_contents">
        <div className="user_header d-flex justify-content-between align-items-center">
          <div className="user_container d-flex align-items-center">
            <img src={`../assets/images/profile_user.jpg`} />
            <div className="prof_details">
              <div className="prof_name">{props.location.state.topicName}</div>
              <div className="follower_counted">
                <span>10.5M</span> Followers
              </div>
            </div>
          </div>
          <div className="user_actions">
            <button className="send_props" onClick={sendProposal}>
              Send a Proposal
            </button>
            <button
              className="follow_btn position-relative"
              onClick={clickToFollow}
              disabled={checkDisable}
            >
              <img src={`../assets/images/following_profile.png`} />
              {stateData.checkFollowed &&
              stateData.checkFollowed.message &&
              stateData.checkFollowed.message == "Not following anyone"
                ? "Follow"
                : "Following"}
            </button>
          </div>
        </div>
        <div className="title_of_videos">Videos</div>
        <div className="videos_container">
          <div className="Profile_vid">
            <div className="featured_image position-relative">
              <div className="video position-relative">
                <button className="play" onClick="playPause('video1')">
                  <img src={`../assets/images/play1.png`} />
                </button>
                <video id="video1">
                  <source src="images/-Video-52.mp4" type="video/mp4" />
                  <source src="mov_bbb.ogg" type="video/ogg" />
                </video>
              </div>
            </div>
            <div className="d-flex feat_vid_desc video_desc_user flex-column">
              <div className="d-flex">
                <div className="watched">
                  <div className="feat_vid_desc_title">watched</div>
                  <div className="watched_desc" />
                  <div>2.5K</div>
                  <img src={`../assets/images/eye.png`} />
                </div>
              </div>
              <div className="votes">
                <div className="feat_vid_desc_title">Votes</div>
                <div className="votes_desc">
                  <div className="feat_user1">
                    <img src={`../assets/images/user1.png`} />
                    <div>359</div>
                  </div>
                  <div className="grey_pipe"></div>
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="with_user">
              with <span>user28</span>
            </div>
          </div>
          <div className="Profile_vid">
            <div className="featured_image position-relative">
              <div className="video position-relative">
                <button className="play" onClick="playPause('video1')">
                  <img src={`../assets/images/play1.png`} />
                </button>
                <video id="video1">
                  <source src="images/-Video-52.mp4" type="video/mp4" />
                  <source src="mov_bbb.ogg" type="video/ogg" />
                </video>
              </div>
            </div>
            <div className="d-flex feat_vid_desc video_desc_user flex-column">
              <div className="d-flex">
                <div className="watched">
                  <div className="feat_vid_desc_title">watched</div>
                  <div className="watched_desc" />
                  <div>2.5K</div>
                  <img src={`../assets/images/eye.png`} />
                </div>
              </div>
              <div className="votes">
                <div className="feat_vid_desc_title">Votes</div>
                <div className="votes_desc">
                  <div className="feat_user1">
                    <img src={`../assets/images/user1.png`} />
                    <div>359</div>
                  </div>
                  <div className="grey_pipe"></div>
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="with_user">
              with <span>user28</span>
            </div>
          </div>
          <div className="Profile_vid">
            <div className="featured_image position-relative">
              <div className="video position-relative">
                <button className="play" onClick="playPause('video1')">
                  <img src={`../assets/images/play1.png`} />
                </button>
                <video id="video1">
                  <source src="images/-Video-52.mp4" type="video/mp4" />
                  <source src="mov_bbb.ogg" type="video/ogg" />
                </video>
              </div>
            </div>
            <div className="d-flex feat_vid_desc video_desc_user flex-column">
              <div className="d-flex">
                <div className="watched">
                  <div className="feat_vid_desc_title">watched</div>
                  <div className="watched_desc" />
                  <div>2.5K</div>
                  <img src={`../assets/images/eye.png`} />
                </div>
              </div>
              <div className="votes">
                <div className="feat_vid_desc_title">Votes</div>
                <div className="votes_desc">
                  <div className="feat_user1">
                    <img src={`../assets/images/user1.png`} />
                    <div>359</div>
                  </div>
                  <div className="grey_pipe"></div>
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="with_user">
              with <span>user28</span>
            </div>
          </div>
          <div className="Profile_vid">
            <div className="featured_image position-relative">
              <div className="video position-relative">
                <button className="play" onClick="playPause('video1')">
                  <img src={`../assets/images/play1.png`} />
                </button>
                <video id="video1">
                  <source src="images/-Video-52.mp4" type="video/mp4" />
                  <source src="mov_bbb.ogg" type="video/ogg" />
                </video>
              </div>
            </div>
            <div className="d-flex feat_vid_desc video_desc_user flex-column">
              <div className="d-flex">
                <div className="watched">
                  <div className="feat_vid_desc_title">watched</div>
                  <div className="watched_desc" />
                  <div>2.5K</div>
                  <img src={`../assets/images/eye.png`} />
                </div>
              </div>
              <div className="votes">
                <div className="feat_vid_desc_title">Votes</div>
                <div className="votes_desc">
                  <div className="feat_user1">
                    <img src={`../assets/images/user1.png`} />
                    <div>359</div>
                  </div>
                  <div className="grey_pipe"></div>
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="with_user">
              with <span>user28</span>
            </div>
          </div>
          <div className="Profile_vid">
            <div className="featured_image position-relative">
              <div className="video position-relative">
                <button className="play" onClick="playPause('video1')">
                  <img src={`../assets/images/play1.png`} />
                </button>
                <video id="video1">
                  <source src="images/-Video-52.mp4" type="video/mp4" />
                  <source src="mov_bbb.ogg" type="video/ogg" />
                </video>
              </div>
            </div>
            <div className="d-flex feat_vid_desc video_desc_user flex-column">
              <div className="d-flex">
                <div className="watched">
                  <div className="feat_vid_desc_title">watched</div>
                  <div className="watched_desc" />
                  <div>2.5K</div>
                  <img src={`../assets/images/eye.png`} />
                </div>
              </div>
              <div className="votes">
                <div className="feat_vid_desc_title">Votes</div>
                <div className="votes_desc">
                  <div className="feat_user1">
                    <img src={`../assets/images/user1.png`} />
                    <div>359</div>
                  </div>
                  <div className="grey_pipe"></div>
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="with_user">
              with <span>user28</span>
            </div>
          </div>
          <div className="Profile_vid">
            <div className="featured_image position-relative">
              <div className="video position-relative">
                <button className="play" onClick="playPause('video1')">
                  <img src={`../assets/images/play1.png`} />
                </button>
                <video id="video1">
                  <source src="images/-Video-52.mp4" type="video/mp4" />
                  <source src="mov_bbb.ogg" type="video/ogg" />
                </video>
              </div>
            </div>
            <div className="d-flex feat_vid_desc video_desc_user flex-column">
              <div className="d-flex">
                <div className="watched">
                  <div className="feat_vid_desc_title">watched</div>
                  <div className="watched_desc" />
                  <div>2.5K</div>
                  <img src={`../assets/images/eye.png`} />
                </div>
              </div>
              <div className="votes">
                <div className="feat_vid_desc_title">Votes</div>
                <div className="votes_desc">
                  <div className="feat_user1">
                    <img src={`../assets/images/user1.png`} />
                    <div>359</div>
                  </div>
                  <div className="grey_pipe"></div>
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="with_user">
              with <span>user28</span>
            </div>
          </div>
          <div className="Profile_vid">
            <div className="featured_image position-relative">
              <div className="video position-relative">
                <button className="play" onClick="playPause('video1')">
                  <img src={`../assets/images/play1.png`} />
                </button>
                <video id="video1">
                  <source src="images/-Video-52.mp4" type="video/mp4" />
                  <source src="mov_bbb.ogg" type="video/ogg" />
                </video>
              </div>
            </div>
            <div className="d-flex feat_vid_desc video_desc_user flex-column">
              <div className="d-flex">
                <div className="watched">
                  <div className="feat_vid_desc_title">watched</div>
                  <div className="watched_desc" />
                  <div>2.5K</div>
                  <img src={`../assets/images/eye.png`} />
                </div>
              </div>
              <div className="votes">
                <div className="feat_vid_desc_title">Votes</div>
                <div className="votes_desc">
                  <div className="feat_user1">
                    <img src={`../assets/images/user1.png`} />
                    <div>359</div>
                  </div>
                  <div className="grey_pipe"></div>
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="with_user">
              with <span>user28</span>
            </div>
          </div>
          <div className="Profile_vid">
            <div className="featured_image position-relative">
              <div className="video position-relative">
                <button className="play" onClick="playPause('video1')">
                  <img src={`../assets/images/play1.png`} />
                </button>
                <video id="video1">
                  <source src="images/-Video-52.mp4" type="video/mp4" />
                  <source src="mov_bbb.ogg" type="video/ogg" />
                </video>
              </div>
            </div>
            <div className="d-flex feat_vid_desc video_desc_user flex-column">
              <div className="d-flex">
                <div className="watched">
                  <div className="feat_vid_desc_title">watched</div>
                  <div className="watched_desc" />
                  <div>2.5K</div>
                  <img src={`../assets/images/eye.png`} />
                </div>
              </div>
              <div className="votes">
                <div className="feat_vid_desc_title">Votes</div>
                <div className="votes_desc">
                  <div className="feat_user1">
                    <img src={`../assets/images/user1.png`} />
                    <div>359</div>
                  </div>
                  <div className="grey_pipe"></div>
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="with_user">
              with <span>user28</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
