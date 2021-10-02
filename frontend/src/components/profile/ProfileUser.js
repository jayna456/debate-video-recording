import React, {useState, useEffect, useRef} from "react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/user-profile.css";
import {useDispatch, useSelector} from "react-redux";
import {getUserVideoList, followersCount} from "../../Actions/debateAction";
import {getUserProfileInfo} from "../../Actions/userAction";

function ProfileUser(props) {
  const dispatch = useDispatch();
  const stateData = useSelector(state => state.debate);
  const stateUser = useSelector(state => state.user);

  const userVideo = useRef();

  const [user, setUser] = useState({});
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    dispatch(getUserVideoList(localStorage.getItem("id")));
    dispatch(followersCount(localStorage.getItem("id")));
    dispatch(getUserProfileInfo(localStorage.getItem("id")));
  }, []);

  useEffect(() => {
    if (stateUser) {
      if (stateUser.userProfileInfo) {
        setUser(stateUser.userProfileInfo);
      }
    }
  }, [stateUser]);

  useEffect(() => {
    console.log("state data... ", stateData);
    if (stateData) {
      if (stateData.uploadedVideoList) {
        setVideoList(stateData.uploadedVideoList);
      }
    }
  }, [stateData]);

  const checkEnd = async id => {
    console.log("ended event ");
    // const dataToPass = {
    //   userId: localStorage.getItem("id"),
    //   streamId: id,
    // };
    // await dispatch(updateWatchCount(dataToPass));
    // const userId = localStorage.getItem("id");
    // stateData.uploadedVideoList.forEach(videoInfo => {
    //   if (id === videoInfo._id) {
    //     videoInfo.watched.push({userId});
    //   }
    // });
  };

  const seekMethod = () => {
    console.log("video calling seek mtd... ");
  };

  const goToProfile = user => {
    console.log("go to profile fn called... ", user);
    const dataToPass = {
      userId: user.userId,
      topicName: user.memberName,
      profilePic: user.profilePic,
    };

    if (user.userId === localStorage.getItem("id")) {
    } else {
      props.history.push("/userProfile", dataToPass);
    }
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />

      <div className="main_profile_contents">
        <div className="user_header d-flex justify-content-between align-items-center">
          <div className="user_container d-flex align-items-center">
            <img src={user.profilePic} alt="profilePic" />
            <div className="prof_details">
              <div className="prof_name">{user.userName}</div>
              <div className="follower_counted">
                <span>
                  {stateData.followersCount ? stateData.followersCount : 0}
                </span>{" "}
                Followers
              </div>
            </div>
          </div>
        </div>
        <div className="title_of_videos">Videos</div>
        <div className="videos_container">
          {videoList.length ? (
            stateData.uploadedVideoList.map((video, i) => {
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
                                    onClick={() => goToProfile(member)}
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
                                    onClick={() => goToProfile(member.userId)}
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
                      {video.daysLeft >= 7
                        ? "The voting week has expired"
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
            <p>{videoList.length === 0 ? "No videos of this user" : ""}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileUser;
