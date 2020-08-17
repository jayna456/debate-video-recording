import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";

import Slider1 from "./Slider1";
import Slider2 from "./Slider2";

function LandingPageContent(props) {
  return (
    <div>
      <div className="main_container d-flex">
        <div className="featured_containers">
          <div className="featured_container">
            <div className="featured_image position-relative">
              <img
                className="featured_main_image"
                src={`../assets/images/soulmate.png`}
              />
              <img className="featured" src={`../assets/images/featured.png`} />
              <div className="featured_texts">
                <div className="featured_title">
                  Why Finding Your Soulmate Is All You Need!
                </div>
                <div className="featured_users">
                  <div className="user1">Dave, Austria</div>
                  <div className="pipe_orange" />
                  <div className="user2">Nancy, India</div>
                </div>
              </div>
            </div>
            <div className="feat_vid_desc">
              <div className="watched">
                <div className="feat_vid_desc_title">watched</div>
                <div className="watched_desc">
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
                  <div className="grey_pipe" />
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="featured_container">
            <div className="featured_image position-relative">
              <img
                className="featured_main_image"
                src={`../assets/images/nusa.png`}
              />
              <img className="featured" src={`../assets/images/featured.png`} />
              <div className="featured_texts">
                <div className="featured_title">
                  Nusa Penida is the best in The World!!
                </div>
                <div className="featured_users">
                  <div className="user1">Dave, Austria</div>
                  <div className="pipe_orange" />
                  <div className="user2">Nancy, India</div>
                </div>
              </div>
            </div>
            <div className="feat_vid_desc">
              <div className="watched">
                <div className="feat_vid_desc_title">watched</div>
                <div className="watched_desc">
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
                  <div className="grey_pipe" />
                  <div className="feat_user1">
                    <img src={`../assets/images/user2.png`} />
                    <div>15</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main_vids_cat">
          <div className="tabs_of_vids">
            <div className="tab active">Recommended</div>
            <div className="tab">Favorites</div>
            <div className="tab">Playlists</div>
          </div>
          <div className="category_vids">
            <div className="cat_title">Politics</div>

            <Slider1 />
          </div>
          <div className="category_vids">
            <div className="cat_title">Psychology</div>
            <Slider1 /> <br />
            <Slider1 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LandingPageContent);
