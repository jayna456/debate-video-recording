import React, { Component } from "react";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

export default class Slider1 extends Component {
  render() {
    return (
      <OwlCarousel
        owl-theme="true"
        className="owl-one"
        margin={20}
        items={3}
        stagePadding={50}
        owl-carousel="true"
        loop={true}
        autoWidth={true}
      >
        <div className="video position-relative">
          <button className="play">
            <img src={`../assets/images/play12.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>
        <div className="video position-relative">
          <button className="play">
            <img src={`../assets/images/play12.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>

        <div className="video position-relative">
          <button className="play">
            <img src={`../assets/images/play12.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>

        <div className="video position-relative">
          <button className="play">
            <img src={`../assets/images/play12.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>
        <div className="video position-relative">
          <button className="play">
            <img src={`../assets/images/play12.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>

        <div className="video position-relative">
          <button className="play">
            <img src={`../assets/images/play12.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>

        <div className="video position-relative">
          <button className="play">
            <img src={`../assets/images/play12.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>

        <div className="video position-relative">
          <button className="play">
            <img src={`../assets/images/play12.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>
      </OwlCarousel>
    );
  }
}
