import React from "react";
import { viewFollowersList } from "../../Actions/debateAction";
import { useSelector, useDispatch } from "react-redux";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";

function follower() {
  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />
    </div>
  );
}

export default follower;
