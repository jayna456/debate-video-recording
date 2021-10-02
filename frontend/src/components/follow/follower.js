import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {viewFollowersList} from "../../Actions/debateAction";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/follower.css";

const Follower = props => {
  const [folloersList, setFolloersList] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const stateData = useSelector(state => {
    console.log("staste. debate111 ", state.debate);
    return state.debate;
  });

  const goToProfile = user => {
    console.log("fn called", user);
    var token = {
      profilePic: user.profilePic,
      topicName: user.userName,
      userId: user.userId,
    };
    history.push("/userProfile", token);
  };

  useEffect(() => {
    dispatch(viewFollowersList());
  }, []);

  useEffect(() => {
    if (stateData) {
      if (stateData.followerList && stateData.followerList.length) {
        setFolloersList(stateData.followerList);
      }
    }
  }, [stateData]);

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />

      <div className="main_profile_contents_follow">
        <div className="user_header_follow d-flex justify-content-between align-items-center">
          {folloersList.length ? (
            folloersList.map((user, i) => {
              return (
                <div
                  className="image_container_follow d-flex"
                  key={i}
                  onClick={() => {
                    goToProfile(user);
                  }}>
                  <img
                    src={
                      user.profilePic
                        ? `${user.profilePic}`
                        : `../assets/images/profile_user.jpg`
                    }
                    alt="profileImg"
                  />
                  <div className="prof_details_follow">
                    <div className="prof_name_follow">{user.userName}</div>
                    <div className="follower_counted_follow">
                      <span>{user.followList}</span> Followers
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="align-items-center justify-content-center">
              <strong>Not following anyone</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Follower;
