import React, { useEffect } from "react";

import "../assets/css/style-landing-page.css";
import "../assets/css/flags.css";

import LandingPageHeader from "./LandingPageHeader";
import LandingPageLeftSideBar from "./LandingPageSidebar";
import LandingPageContent from "./LandingPageContent";

function LandingPage(props) {
  useEffect(() => {
    console.log("did mount call");
    const script = document.createElement("script");
    script.src = `./assets/js/landingPageScript.js`;

    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <LandingPageHeader />
      <div className="main">
        <LandingPageLeftSideBar />
        <LandingPageContent />
      </div>
      {/* script files */}
    </div>
  );
}

export default LandingPage;
