import React, { Component } from "react";
import Video from "./Video";

export class Videos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rVideos: [],
      remoteStreams: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.remoteStreams !== nextProps.remoteStreams) {
      let _rVideos = nextProps.remoteStreams.map((rVideo, index) => {
        let video = (
          <Video
            videoStream={rVideo.stream}
            frameStyle={{ width: 120, padding: "0 3px" }}
            videoStyles={{
              cursor: "pointer",
              objectFit: "cover",
              borderRadius: 3,
              width: "83.3%",
            }}
          />
        );

        return (
          <div
            id={rVideo.name}
            onClick={() => this.props.switchVideo(rVideo)}
            style={{ display: "inline-block" }}
            key={index}
          >
            {video}
          </div>
        );
      });

      this.setState({
        remoteStreams: nextProps.remoteStreams,
        rVideos: _rVideos,
      });
    }
  }
  render() {
    return (
      <div>
        <div
          style={{
            zIndex: 3,
            width: "83.3%",
          }}
        >
          {this.state.rVideos}
        </div>
      </div>
    );
  }
}

export default Videos;
