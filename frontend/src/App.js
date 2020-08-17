import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/UserLogin";
import Debate from "./components/debate/Debate";
import LandingPage from "./components/LandingPage";
import UserRegister from "./components/UserRegister";
import LoginPage from "./components/LoginPage";
import SearchResult from "./components/SearchResult";
import UserProfile from "./components/profile/UserProfile";
import VerifiedUser from "./components/VerifiedUser";
import DebateVideo from "./components/debate/DebateVideo";
import follower from "./components/follow/follower";
import Profile from "./components/profile/Profile";
import ForgotPassword from "./components/ForgotPassword";
import SetNewPassword from "./components/SetNewPassword";

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/register" component={UserRegister} />
          <Route exact path="/debate" component={Debate} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/log" component={LoginPage} />
          <Route path="/searchData" component={SearchResult} />
          <Route path="/userProfile" component={UserProfile} />
          <Route path="/verifyUser" component={VerifiedUser} />
          <Route path="/videoChat" component={DebateVideo} />
          <Route path="/follow" component={follower} />
          <Route path="/profile" component={Profile} />
          <Route path="/forgotPassword" component={ForgotPassword} />
          <Route path="/setNewPassword" component={SetNewPassword} />
        </BrowserRouter>
      </div>
    );
  }
}
