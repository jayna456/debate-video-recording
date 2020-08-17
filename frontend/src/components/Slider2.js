import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
export default class Slider2 extends Component {
  render() {
    const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };

    return (
      <OwlCarousel
        owl-theme
        className="owl-two"
        margin={20}
        items={3}
        stagePadding={50}
        autoWidth={false}
      >
        <div className="video position-relative">
          <button className="play" onclick="playPause('video7')">
            <img src={`../assets/images/play.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>
        <div className="video position-relative">
          <button className="play" onclick="playPause('video7')">
            <img src={`../assets/images/play.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>

        <div className="video position-relative">
          <button className="play" onclick="playPause('video7')">
            <img src={`../assets/images/play.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>

        <div className="video position-relative">
          <button className="play" onclick="playPause('video7')">
            <img src={`../assets/images/play.png`} />{" "}
          </button>
          <video id="video7">
            <source src={`../assets/video/test2.mp4`} type="video/mp4" />
            <source src={`mov_bbb.ogg" type="video/ogg"`} />
          </video>
        </div>
        <div className="video position-relative">
          <button className="play" onclick="playPause('video7')">
            <img src={`../assets/images/play.png`} />{" "}
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
