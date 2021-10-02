import React, {Component} from "react";
import "../../assets/css/video-debate.css";
import Countdown from "react-countdown";

export class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("did mount called in video component", this.props);
    if (this.props.videoStream) {
      this.video.srcObject = this.props.videoStream;
      this.video.play();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.videoStream &&
      nextProps.videoStream !== this.props.videoStream
    ) {
      this.video.srcObject = nextProps.videoStream;
    }
  }

  getTimerTick = data => {
    this.props.pauseTime(data);
  };

  timerComplete = () => {
    this.props.finishTime();
  };

  render() {
    return (
      <div
        style={{...this.props.frameStyle}}
        className="single_video inside_video">
        <video
          id={this.props.id}
          muted={this.props.streamType === "local" ? true : false}
          autoPlay
          style={{...this.props.videoStyles}}
          ref={ref => {
            this.video = ref;
          }}></video>
        {this.props.connected ? (
          this.props.mode === "per turns" ? (
            <Countdown
              date={Date.now() + this.props.timer}
              renderer={({hours, minutes, seconds, completed}) => {
                // if (completed) {
                //   this.download();
                // }
                return (
                  <div>
                    {hours}:{minutes}:{seconds}
                  </div>
                );
              }}
              onTick={data => this.getTimerTick(data)}
              className="timer_per_turns"
              onComplete={this.timerComplete}
            />
          ) : (
            <Countdown
              date={Date.now() + this.props.timer}
              renderer={({hours, minutes, seconds, completed}) => {
                // if (completed) {
                //   this.download();
                // }
                return (
                  <div>
                    {hours}:{minutes}:{seconds}
                  </div>
                );
              }}
              onTick={data => this.getTimerTick(data)}
              className="timer_per_turns"
              onComplete={this.timerComplete}
            />
          )
        ) : null}
      </div>
    );
  }
}

export default Video;
