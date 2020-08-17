import React, { Component } from "react";
import slider1 from "../assets/landing-page-images/slider5.jpg";
import slider2 from "../assets/landing-page-images/slider8.jpg";
import slider3 from "../assets/landing-page-images/slider9.jpg";
import "../assets/css/slider.scss";
export default class Slider extends Component {
  componentDidMount() {
    const script = document.createElement("script");

    script.src = `./dist/js/landing-page/slider.js`;
    script.async = true;

    document.body.appendChild(script);
  }

  render() {
    return (
      <div>
        <div
          id="carouselExampleControls"
          className="carousel slide"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                className="d-block w-100 img-responsive"
                src={slider1}
                alt="First slide"
              />
            </div>
            <div className="carousel-item">
              <img className="d-block w-100" src={slider2} alt="Second slide" />
            </div>
            <div className="carousel-item">
              <img className="d-block w-100" src={slider3} alt="Third slide" />
            </div>
          </div>
          <a
            className="carousel-control-prev"
            href="#carouselExampleControls"
            role="button"
            data-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href="#carouselExampleControls"
            role="button"
            data-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
  }
}
