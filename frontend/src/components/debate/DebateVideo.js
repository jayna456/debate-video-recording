import React, {Component} from "react";
import axios from "axios";
import io from "socket.io-client";
import {withRouter, Redirect} from "react-router";
import {Prompt} from "react-router-dom";
// import {  } from "";
import Video from "./Video";
import firebase from "../firebase";
import swal from "sweetalert";
import "../../assets/css/video-debate.css";
import AdSense from "react-adsense";
import MediaStreamRecorder from "msr";
import ConcatenateBlobs from "concatenateblobs";
import "../../assets/css/video-debate.css";
import moment from "moment";

let mediaRecorder, remoteMediaRecorder;
let recordedChunks = [];
let recordedRemoteChunks = [];
let captureStream;
let recordingStream;

class DebateVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: null, // used to hold local stream object to avoid recreating the stream everytime a new offer comes
      remoteStream: null, // used to hold remote stream object that is displayed in the main screen

      remoteStreams: [], // holds all Video Streams (all remote streams)
      peerConnections: {}, // holds all Peer Connections
      selectedVideo: null,
      timer: 180000,
      debateId: "",
      members: [],
      mode: "",

      pc_config: {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      },
      uploadPercentage: 0,

      sdpConstraints: {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
        },
      },
      connected: false,
      displayTimer: 180000,
      totaluser: 0,
      enableTurn: {},
      commentText: "",
      userInfo: {},
      debateComments: [],
      remoteUserId: "",
      turnCount: 0,
      turnObj: {},
      originaltimer: "",
      debateTimer: "",
    };

    this.serviceIP = "https://pieramo.com:8000/webrtcPeer";
    // this.serviceIP = "http://localhost:8000/webrtcPeer";

    this.socket = null;
    this.localRef = React.createRef();
    this.interval = null;
    this.intervalTimer = null;
    this.user = {};
    this.perTimeUser = [];
    this.turnUser = {};

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }user/getProfileInfo?id=${localStorage.getItem("id")}`
      )
      .then(result => {
        console.log("result data... ", result.data.data);
        if (result.data.code === 200) {
          this.setState({userInfo: result.data.data});
        }
      })
      .catch(error =>
        console.log("error while calling get user info api.. ", error)
      );
  }

  getLocalStream = () => {
    // called when getUserMedia() successfully returns - see below
    // getUserMedia() returns a MediaStream object (https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)

    const success = stream => {
      this.localRef.current.srcObject = stream;
      // this.pc.addStream(stream);
      this.setState({
        localStream: stream,
      });

      this.whoisOnline();
    };

    // called when getUserMedia() fails - see below
    const failure = e => {
      console.log("getUserMedia Error: ", e);
      // alert(e.toString());
      swal(
        "Info",
        "Web camera is not attached! Please check it and make sure it is working.",
        "info"
      ).then(() => {
        this.socket.emit("disconnect");
        const receiverRef = firebase.database().ref();
        let key1;
        receiverRef.once("value", snapshot => {
          snapshot.forEach(value => {
            const singleObjValue = value.val();
            console.log(
              "singleObjValue.debateId === this.state.debateId",
              singleObjValue.debateId === this.state.debateId
            );
            if (singleObjValue.debateId === this.state.debateId) {
              firebase.database().ref().child(value.key).remove();
            }
          });
        });
        console.log("key removed from db");
        this.props.history.push("/");
      });
    };

    const constraints = {
      video: true,
      audio: {echoCancellation: true},
      options: {
        mirror: true,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure);
  };

  whoisOnline = () => {
    // let all peers know I am joining
    this.sendToPeer("onlinePeers", null, {local: this.socket.id});
  };

  sendToPeer = (messageType, payload, socketID) => {
    console.log(
      "send to peer i.e. socket event called... ",
      messageType,
      payload,
      socketID
    );
    this.socket.emit(messageType, {
      socketID,
      payload,
    });
  };

  createPeerConnection = (socketID, callback) => {
    try {
      let pc = new RTCPeerConnection(this.state.pc_config);

      // add pc to peerConnections object
      const peerConnections = {...this.state.peerConnections, [socketID]: pc};
      this.setState({
        peerConnections,
      });

      pc.onicecandidate = e => {
        if (e.candidate) {
          this.sendToPeer("candidate", e.candidate, {
            local: this.socket.id,
            remote: socketID,
          });
        }
      };

      pc.oniceconnectionstatechange = e => {
        console.log(
          "pc ice connection state............",
          pc.iceConnectionState
        );
        // if (pc.iceConnectionState === 'disconnected') {
        //   const remoteStreams = this.state.remoteStreams.filter(stream => stream.id !== socketID)
        //   this.setState({
        //     remoteStream: remoteStreams.length > 0 && remoteStreams[0].stream || null,
        //   })
        // }
      };

      pc.ontrack = e => {
        const remoteVideo = {
          id: socketID,
          name: socketID,
          stream: e.streams[0],
        };

        console.log("e.remote stream... ", e.streams[0]);
        this.setState(prevState => {
          // If we already have a stream in display let it stay the same, otherwise use the latest stream
          const remoteStream =
            prevState.remoteStreams.length > 0
              ? {}
              : {remoteStream: e.streams[0]};

          // get currently selected video
          let selectedVideo = prevState.remoteStreams.filter(
            stream => stream.id === prevState.selectedVideo.id
          );
          // if the video is still in the list, then do nothing, otherwise set to new video stream
          selectedVideo = selectedVideo.length
            ? {}
            : {selectedVideo: remoteVideo};

          return {
            // selectedVideo: remoteVideo,
            ...selectedVideo,
            // remoteStream: e.streams[0],
            ...remoteStream,
            remoteStreams: [...prevState.remoteStreams, remoteVideo],
          };
        });
      };

      pc.close = () => {
        // alert("GONE");
      };

      if (this.state.localStream) pc.addStream(this.state.localStream);

      // return pc
      callback(pc);
    } catch (e) {
      alert("Something went wrong! pc not created!!");
      console.log("Something went wrong! pc not created!!", e);
      // return;
      callback(null);
    }
  };

  componentDidMount = () => {
    if (
      localStorage.getItem("debateAccountToken") &&
      localStorage.getItem("id") &&
      localStorage.getItem("email")
    ) {
      const installGoogleAds = () => {
        const elem = document.createElement("script");
        elem.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        elem.async = true;
        elem.defer = true;
        document.body.insertBefore(elem, document.body.firstChild);
      };
      installGoogleAds();
      // window.addEventListener("beforeunload", ev => {
      //   ev.preventDefault()
      //   var message =
      //     "Warning!\n\nNavigating away from this page will delete your text if you haven't already saved it."
      //   ev.returnValue = message
      //   setTimeout(() => {
      //     console.log("cancel..")
      //   }, 10000)
      //   const data = {
      //     id: localStorage.getItem("id"),
      //   }
      //   axios
      //     .put(`${process.env.REACT_APP_API_URL}user/logout`, data)
      //     .then(result => {
      //       console.log("result logged out... ", result.data)
      //     })
      //     .catch(err => {
      //       console.log("error.. ", err)
      //     })
      // })

      // window.onpopstate = function (event) {
      //   this.props.history.go(1);
      // };
      const receiverRef = firebase.database().ref();
      this.socket = io.connect(this.serviceIP);

      receiverRef.on("value", snapshot => {
        snapshot.forEach(value => {
          const singleObjValue = value.val();
          if (
            singleObjValue.members[0] == localStorage.getItem("id") ||
            singleObjValue.members[1] == localStorage.getItem("id")
          ) {
            this.setState({debateComments: singleObjValue.comments});
            if (singleObjValue.members[0] !== localStorage.getItem("id")) {
              this.setState({remoteUserId: singleObjValue.members[0]});
            } else if (
              singleObjValue.members[1] !== localStorage.getItem("id")
            ) {
              this.setState({remoteUserId: singleObjValue.members[1]});
            }
            this.setState({
              debateId: singleObjValue.debateId,
              members: singleObjValue.members,
              mode: singleObjValue.debateStatus,
              debateTimer: singleObjValue.debateTime,
            });

            if (singleObjValue.debateTime == "12 minutes") {
              // if (singleObjValue.debateStatus === "per turns") {
              console.log("singleObjValue.newTimer", singleObjValue.newTimer);
              this.setState({
                timer: singleObjValue.newTimer
                  ? singleObjValue.newTimer
                  : 720000,
                displayTimer: 180000,
                originaltimer: 720000,
              });
              // } else {
              //   this.setState({
              //     timer: 720000,
              //     displayTimer: 180000,
              //   });
              // }
            } else if (singleObjValue.debateTime == "30 minutes") {
              // if (singleObjValue.debateStatus === "per turns") {
              this.setState({
                timer: singleObjValue.newTimer
                  ? singleObjValue.newTimer
                  : 1800000,
                displayTimer: 300000,
                originaltimer: 1800000,
              });
              // } else {
              //   this.setState({
              //     timer: 1800000,
              //     displayTimer: 300000,
              //   });
              // }
            } else if (singleObjValue.debateTime == "1 hour and 30 minutes") {
              // if (singleObjValue.debateStatus === "per turns") {
              this.setState({
                timer: singleObjValue.newTimer
                  ? singleObjValue.newTimer
                  : 5400000,
                displayTimer: 300000,
                originaltimer: 5400000,
              });
              // } else {
              //   this.setState({
              //     timer: 5400000,
              //     displayTimer: 300000,
              //   });
              // }
            }

            if (singleObjValue.debateStatus === "per turns") {
              if (singleObjValue.turnValue) {
                this.setState({turnObj: singleObjValue.turnValue}, () =>
                  console.log("turn object...")
                );
                if (
                  singleObjValue.turnValue[localStorage.getItem("id")] === false
                ) {
                  if (this.state.localStream) {
                    this.state.localStream.getAudioTracks()[0].enabled =
                      singleObjValue.turnValue[localStorage.getItem("id")];
                  }
                } else {
                  if (this.state.localStream)
                    this.state.localStream.getAudioTracks()[0].enabled =
                      singleObjValue.turnValue[localStorage.getItem("id")];
                }
              }

              // console.log("before set time out called");
              // if (singleObjValue.debateTime == "12 minutes") {
              //   setTimeout(() => {
              //     this.chnageTurn();
              //   }, 180000);
              // } else if (singleObjValue.debateTime == "30 minutes") {
              //   setTimeout(() => {
              //     this.chnageTurn();
              //   }, 300000);
              // } else if (singleObjValue.debateTime == "1 hour and 30 minutes") {
              //   setTimeout(() => {
              //     this.chnageTurn();
              //   }, 300000);
              // }
            }
          }
        });
      });

      this.socket.on("connection-success", data => {
        console.log("data........", data);
        this.setState({totaluser: data.peerCount}, () =>
          console.log(
            "on connection establish peer count ",
            this.state.totaluser
          )
        );
        this.getLocalStream();
      });

      this.socket.on("peer-disconnected", data => {
        console.log("peer-disconnected", data);

        const remoteStreams = this.state.remoteStreams.filter(
          stream => stream.id !== data.socketID
        );

        if (data.peerCount === 1) {
          this.setState({totaluser: data.peerCount}, () => {
            console.log(
              "peer count after disconnect called... ",
              this.state.totaluser
            );
            if (this.state.localStream && this.state.uploadPercentage === 100) {
              this.state.localStream.getTracks().forEach(track => {
                track.stop();
              });
            }
            this.socket.disconnect();
            this.socket.emit("disconnect");
            
            this.props.history.push("/");
            window.location.reload();
          });
        } else {
          this.setState(prevState => {
            // check if disconnected peer is the selected video and if there still connected peers, then select the first
            const selectedVideo =
              prevState.selectedVideo.id === data.socketID &&
              remoteStreams.length
                ? {selectedVideo: remoteStreams[0]}
                : null;

            return {
              // remoteStream: remoteStreams.length > 0 && remoteStreams[0].stream || null,
              remoteStreams,
              ...selectedVideo,
            };
          });
          this.setState({totaluser: data.peerCount}, () =>
            console.log(
              "peer count after disconnect called... ",
              this.state.totaluser
            )
          );
        }

        console.log(
          "remoteStremas.. ",
          remoteStreams,
          this.state.uploadPercentage
        );
        if (this.state.localStream) {
          this.state.localStream.getTracks().forEach(track => {
            track.stop();
          });
        }
        // const receiverRef = firebase.database().ref();
        // let key1;
        // receiverRef.on("value", snapshot => {
        //   snapshot.forEach(value => {
        //     const singleObjValue = value.val();
        //     console.log(
        //       "singleObjValue.debateId === this.state.debateId",
        //       singleObjValue.debateId === this.state.debateId
        //     );
        //     if (singleObjValue.debateId === this.state.debateId) {
        //       key1 = value.key;
        //       firebase.database().ref().child(value.key).remove();
        //     }
        //   });
        // });
        this.props.history.push("/");
      });

      this.socket.on("online-peer", socketID => {
        console.log("connected peers ...", socketID);
        console.log("after connnection... ", this.state.connected);

        // create and send offer to the peer (data.socketID)
        // 1. Create new pc
        this.createPeerConnection(socketID, pc => {
          // 2. Create Offer
          if (pc)
            pc.createOffer(this.state.sdpConstraints).then(sdp => {
              pc.setLocalDescription(sdp);

              this.sendToPeer("offer", sdp, {
                local: this.socket.id,
                remote: socketID,
              });
            });
        });
      });

      this.socket.on("offer", data => {
        this.createPeerConnection(data.socketID, pc => {
          pc.addStream(this.state.localStream);

          pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(
            () => {
              // 2. Create Answer
              pc.createAnswer(this.state.sdpConstraints).then(sdp => {
                pc.setLocalDescription(sdp);

                this.sendToPeer("answer", sdp, {
                  local: this.socket.id,
                  remote: data.socketID,
                });
              });
            }
          );
        });
      });

      this.socket.on("answer", data => {
        // get remote's peerConnection
        const pc = this.state.peerConnections[data.socketID];
        console.log("asnwer called", data.sdp);
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(
          offerAnswer => {
            console.log("offerAnswer", offerAnswer);
          }
        );
      });

      this.socket.on("candidate", data => {
        // get remote's peerConnection
        console.log("candidate event fired", data);
        const pc = this.state.peerConnections[data.socketID];

        if (pc) {
          pc.addIceCandidate(new RTCIceCandidate(data.candidate));

          pc.oniceconnectionstatechange = async e => {
            console.log(
              "on ice connection state change ",
              e,
              this.state.totaluser
            );

            if (
              e.target.connectionState == "connected" ||
              e.target.connectionState == "connecting"
            ) {
              const audioBits =
                this.state.timer === 720000
                  ? 468 * 1000
                  : this.state.timer === 1800000
                  ? 440 * 1000
                  : this.state.timer === 5400000
                  ? 428 * 1000
                  : 428 * 1000;
              const videoBits =
                this.state.timer === 720000
                  ? 3 * 1000 * 1000
                  : this.state.timer === 1800000
                  ? 2 * 1000 * 1000
                  : this.state.timer === 5400000
                  ? 1 * 1000 * 1000
                  : 3 * 1000 * 1000;
              const options = {
                // audioBitsPerSecond: audioBits,
                // videoBitsPerSecond: 2 * 1000 * 1000,
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000,
              };

              /***** listen whether user has send message or not ******/
              // const receiverRef = firebase.database().ref();
              // receiverRef.on("value", snapshot => {
              //   snapshot.forEach(value => {
              //     const singleObjValue = value.val();
              //     console.log("comments....", singleObjValue.comments);
              //     if (singleObjValue.comments) {
              //       this.setState({
              //         debateComments: singleObjValue.comments,
              //       });
              //     }
              //   });
              // });

              if (this.state.mode === "per turns") {
                if (this.state.turnObj) {
                  if (
                    this.state.turnObj[localStorage.getItem("id")] === false
                  ) {
                    if (this.state.localStream) {
                      this.state.localStream.getAudioTracks()[0].enabled =
                        this.state.turnObj[localStorage.getItem("id")];
                    }
                  }
                }
              }
              if (
                window.location.pathname === "/videoChat" &&
                this.state.totaluser === 2
              ) {
                this.setState({connected: true}, () =>
                  console.log("state.connected ", this.state.connected)
                );
                recordingStream = await navigator.mediaDevices.getDisplayMedia({
                  video: true,
                  audio: true,
                });

                const mergedAudio = await this.mergeAudioStreams();
                console.log("audio track length... ", mergedAudio.length);
                const tracks = [
                  ...recordingStream.getVideoTracks(),
                  ...mergedAudio,
                ];

                captureStream = new MediaStream(tracks);
                mediaRecorder = new MediaRecorder(captureStream, options);
                mediaRecorder.ondataavailable = this.handleDataAvailable;
                mediaRecorder.start();
              }
            }
          };
        }
      });

      this.socket.on("joined-peers", data => {
        console.log("joined peers conunt.. ", data);
        this.setState({totaluser: data.peerCount}, () =>
          console.log(
            "peer count after disconnect called... ",
            this.state.totaluser
          )
        );
      });
    } else {
      this.props.history.push("/");
    }
  };

  chnageTurn = () => {
    console.log("change turn called.....");

    let key1, joinedDebate;
    let passObj = {};
    const receiverRef = firebase.database().ref();
    const id = localStorage.getItem("id");

    receiverRef.on("value", snapshot => {
      snapshot.forEach(value => {
        const singleObjValue = value.val();
        if (singleObjValue.debateId === this.state.debateId) {
          key1 = value.key;
          passObj = singleObjValue.turnValue;
          joinedDebate = singleObjValue.joinedTime;
        }
      });
    });

    passObj = {
      [id]: !passObj[id],
      [this.state.remoteUserId]: !passObj[this.state.remoteUserId],
    };
    const remainingTime =
      this.state.originaltimer - moment().diff(joinedDebate, "milliseconds");

    receiverRef.child(key1).update({
      turnValue: passObj,
      newTimer: remainingTime,
    });
  };

  makeTurnMute = () => {
    console.log("make turn mute fn called");
    if (this.state.selectedVideo && this.state.selectedVideo.stream) {
      const receiverRef = firebase.database().ref();
      let key1;
      let passObj = {};
      let joinedDebate;
      const id = localStorage.getItem("id");
      receiverRef.on("value", snapshot => {
        snapshot.forEach(value => {
          const singleObjValue = value.val();
          if (singleObjValue.debateId == this.state.debateId) {
            key1 = value.key;
            passObj = singleObjValue.turnValue;
            joinedDebate = singleObjValue.joinedTime;
          }
        });
      });
      passObj = {
        [id]: !passObj[id],
        [this.state.remoteUserId]: !passObj[this.state.remoteUserId],
      };
      const remainingTime =
        this.state.originaltimer - moment().diff(joinedDebate, "milliseconds");

      receiverRef.child(key1).update({
        turnValue: passObj,
        newTimer: remainingTime,
      });
      // this.getChildData(moment().milliseconds());
      if (passObj[id]) {
        this.state.localStream.getAudioTracks()[0].enabled = !passObj[id];
      }
      console.log("changed value", this.state.localStream.getAudioTracks()[0]);
    } else {
      swal(
        "Info",
        "Cannot mute the audio until participant joins and starts the debate!",
        "info"
      );
    }
  };

  mergeAudioStreams = async () => {
    console.log("recordScreen fn called");

    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();
    let localSource, remoteSource;

    if (this.state.localStream.getAudioTracks().length > 0) {
      localSource = ctx.createMediaStreamSource(this.state.localStream);
    }

    if (this.state.selectedVideo.stream.getAudioTracks().length > 0) {
      remoteSource = ctx.createMediaStreamSource(
        this.state.selectedVideo.stream
      );
    }

    const localGain = ctx.createGain();
    const remoteGain = ctx.createGain();

    localGain.gain.value = 0.7;
    remoteGain.gain.value = 0.7;

    localSource.connect(localGain).connect(dest);

    remoteSource.connect(remoteGain).connect(dest);

    console.log("combine tracks..", dest.stream.getAudioTracks());

    return dest.stream.getAudioTracks();
  };

  handleDataAvailable = async event => {
    console.log("data-available", event);
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    } else {
      // ...
      console.log("in else");
    }
  };

  handleRemoteDataAvailable = async event => {
    console.log("data-available", event);
    if (event.data.size > 0) {
      recordedRemoteChunks.push(event.data);
      this.download();
    } else {
      // ...
      console.log("in else");
    }
  };

  download = async () => {
    console.log("in download fn");
    var blob = await new Blob(recordedChunks, {
      type: "video/mp4",
    });

    console.log("this.state.members    ", this.state.members);
    let fd = new FormData();
    fd.append("userId", localStorage.getItem("id"));
    this.state.members.forEach(value => {
      fd.append("members[]", value);
    });
    fd.append("debateId", this.state.debateId);
    fd.append("createdDate", moment());
    fd.append("file", blob);

    axios
      .post(`${process.env.REACT_APP_API_URL}debate/storeDebate`, fd, {
        onUploadProgress: progressEvent => {
          console.log("progressEvent ", progressEvent);
          const {loaded, total} = progressEvent;

          let percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("percentage... ", loaded, total, percent, total / loaded);

          // if (percent < 1000) {
          this.setState(
            {
              uploadPercentage: percent.toFixed(2),
            },
            () =>
              console.log("set state call back ", this.state.uploadPercentage)
          );
          // }
        },
      })
      .then(result => {
        console.log("api response ", result.data.code);
        if (result.data.code === 200) {
          this.setState(
            {
              uploadPercentage: 100,
              timer: 0,
            },
            () =>
              console.log(
                "calculate upload percentage ",
                this.state.uploadPercentage
              )
          );

          this.socket.disconnect();
          this.socket.emit("disconnect");
          if (this.state.localStream) {
            this.state.localStream.getTracks().forEach(track => {
              track.stop();
            });
          }
          if (this.state.uploadPercentage == 100) {
            console.log(
              "available users..",
              this.state.remoteStreams,
              this.state.totaluser
            );

            this.state.localStream.getTracks().forEach(track => {
              track.stop();
            });
            if (this.state.selectedVideo && this.state.selectedVideo.stream) {
              this.state.selectedVideo.stream.getTracks().forEach(track => {
                track.stop();
              });
            }
            this.props.history.push("/");
            window.location.reload();
          }
        }
      })
      .catch(err => {
        console.log("error in listing... ", err);
        this.setState({
          uploadPercentage: 0,
        });
        alert(err.toString());
      });
  };

  sendMessage = e => {
    console.log("button event... ", e);
    e.preventDefault();

    let comments = [];
    console.log("send message fn called... ", this.state.userInfo);

    if (document.getElementById("message").value !== "") {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          const receiverRef = firebase.database().ref();
          let key1;
          let joinedDebate;

          receiverRef.on("value", snapshot => {
            snapshot.forEach(value => {
              const singleObjValue = value.val();
              console.log(
                "singleObjValue.debateId == this.state.debateId",
                singleObjValue.debateId == this.state.debateId
              );
              if (singleObjValue.debateId == this.state.debateId) {
                console.log("key... ", singleObjValue, singleObjValue.comments);
                comments = singleObjValue.comments;
                if (comments && comments.length && comments[0].userId === "") {
                  comments = [];
                }
                key1 = value.key;
                joinedDebate = singleObjValue.joinedTime;
              }
            });
          });

          const id = localStorage.getItem("id");

          this.user[id] = {
            userId: this.state.userInfo._id,
            profilePic: this.state.userInfo.profilePic,
            premium: this.state.userInfo.premium,
            commentText: document.getElementById("message").value,
            time: moment.utc().format("hh:mm"),
          };
          comments.push(this.user);
          console.log("comments array... ", comments);
          const remainingTime = this.state.timer - moment().diff(joinedDebate, "milliseconds");

          console.log("remaing time.....", remainingTime, joinedDebate);
          receiverRef.child(key1).update({
            comments: comments,
            newTimer: remainingTime,
          });
          // this.setState({commentText: ""});
          document.getElementById("message").value = "";
        }
      });
    } else {
      swal("Info", "Please enter message to send!", "info");
    }
  };

  handleTextMessage = event => {
    // this.setState({commentText: event.target.value});
  };

  componentWillUnmount() {
    clearInterval(this.interval);
    // this.socket.disconnect();
    // this.socket.emit("disconnect");
    console.log(
      "componenet will unmount mtd called..........",
      this.state.totaluser,
      this.state.selectedVideo,
      this.state.remoteStreams
    );
    // this.state.localStream.getTracks().forEach(track => {
    //   track.stop();
    // });
    // if (this.state.selectedVideo && this.state.selectedVideo.stream) {
    //   this.state.selectedVideo.stream.getTracks().forEach(track => {
    //     track.stop();
    //   });
    // }
    // const receiverRef = firebase.database().ref();
    // receiverRef.on("value", snapshot => {
    //   snapshot.forEach(value => {
    //     const singleObjValue = value.val();
    //     console.log(
    //       "singleObjValue.debateId === this.state.debateId",
    //       singleObjValue.debateId === this.state.debateId
    //     );
    //     if (singleObjValue.debateId === this.state.debateId) {
    //       firebase.database().ref().child(value.key).remove();
    //     }
    //   });
    // });
    // console.log("key removed from db");
  }

  getChildData = childData => {
    const receiverRef = firebase.database().ref();
    const id = localStorage.getItem("id");
    let passObj = {};
    let joinedDebate;
    let key1;

    if (this.state.mode === "per turns") {
      if (this.state.debateTimer === "12 minutes") {
        const answer = this.state.timer - childData.total;
        
        if (moment.duration(answer).asMinutes().toFixed(0) == 3) {
          receiverRef.on("value", snapshot => {
            snapshot.forEach(value => {
              const singleObjValue = value.val();
              if (singleObjValue.debateId === this.state.debateId) {
                key1 = value.key;
                passObj = singleObjValue.turnValue;
                joinedDebate = singleObjValue.joinedTime;
              }
            });
          });

          passObj = {
            [id]: !passObj[id],
            [this.state.remoteUserId]: !passObj[this.state.remoteUserId],
          };
          console.log(
            "difference to check... ",
            moment().diff(joinedDebate, "milliseconds")
          );
          const remainingTime = this.state.originaltimer - moment().diff(joinedDebate, "milliseconds");

          receiverRef.child(key1).update({
            turnValue: passObj,
            newTimer: remainingTime,
          });
        }
      }
      if (this.state.debateTimer === "30 minutes") {
        const answer = this.state.timer - childData.total;
        if (moment.duration(answer).asMinutes().toFixed(0) == 5) {
          receiverRef.on("value", snapshot => {
            snapshot.forEach(value => {
              const singleObjValue = value.val();
              if (singleObjValue.debateId === this.state.debateId) {
                key1 = value.key;
                passObj = singleObjValue.turnValue;
                joinedDebate = singleObjValue.joinedTime;
              }
            });
          });

          passObj = {
            [id]: !passObj[id],
            [this.state.remoteUserId]: !passObj[this.state.remoteUserId],
          };
          
          const remainingTime = this.state.originaltimer - moment().diff(joinedDebate, "milliseconds");

          receiverRef.child(key1).update({
            turnValue: passObj,
            newTimer: remainingTime,
          });
        }
      }
      if (this.state.debateTimer === "1 hour and 30 minutes") {
        const answer = this.state.timer - childData.total;
        if (moment.duration(answer).asMinutes().toFixed(0) == 5) {
          receiverRef.on("value", snapshot => {
            snapshot.forEach(value => {
              const singleObjValue = value.val();
              if (singleObjValue.debateId === this.state.debateId) {
                key1 = value.key;
                passObj = singleObjValue.turnValue;
                joinedDebate = singleObjValue.joinedTime;
              }
            });
          });

          passObj = {
            [id]: !passObj[id],
            [this.state.remoteUserId]: !passObj[this.state.remoteUserId],
          };
         
          const remainingTime = this.state.originaltimer - moment().diff(joinedDebate, "milliseconds");

          receiverRef.child(key1).update({
            turnValue: passObj,
            newTimer: remainingTime,
          });
        }
      }
    }
  };

  callOnComplete = () => {
    console.log("on complete mtd called.............", mediaRecorder);
    if(mediaRecorder.state === "inactive") {}
    else {
      mediaRecorder.stop();
  
      recordingStream.getTracks().forEach(track => track.stop());
  
      mediaRecorder.onstop = ev => {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            const receiverRef = firebase.database().ref();
            let key1;
            receiverRef.on("value", snapshot => {
              snapshot.forEach(value => {
                const singleObjValue = value.val();
                if (singleObjValue.debateId == this.state.debateId) {
                  firebase.database().ref().child(value.key).remove();
                }
              });
            });
            // receiverRef.remove(key1);
          }
        });
        // pc.close();
        this.download();
    }
    };
    mediaRecorder.oninactive = ev => {
      console.log("inactive called....");
    };
    // window.location.reload();
  };

  checkPauseTime = childData => {
    console.log("chack pause time fn called... ", childData);
  };

  render() {
    return (
      <div>
        {/* <Prompt
          message={(location, action) => {
            if (action === "POP") {
              console.log("Backing up...", this.state.localStream);
              // Add your back logic here
              this.socket.emit("disconnect");
              const receiverRef = firebase.database().ref();
              this.state.localStream.getTracks().forEach(track => {
                console.log("track...");
                track.stop();
              });
              receiverRef.on("value", snapshot => {
                snapshot.forEach(value => {
                  const singleObjValue = value.val();
                  console.log(
                    "singleObjValue.debateId === this.state.debateId",
                    singleObjValue.debateId === this.state.debateId
                  );
                  if (singleObjValue.debateId === this.state.debateId) {
                    firebase.database().ref().child(value.key).remove();
                  }
                });
              });
              console.log("key removed from db");
            }

            return true;
          }}
        /> */}
        {this.state.uploadPercentage > 0 ? (
          <div className="progress-div">
            <div
              className="progress"
              style={{marginTop: "20%", marginLeft: "25%", width: "50%"}}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{width: `${this.state.uploadPercentage}%`}}
                aria-valuenow={this.state.uploadPercentage}
                aria-valuemin="0"
                aria-valuemax="100">
                {this.state.uploadPercentage}%
              </div>
            </div>
          </div>
        ) : null}
        {this.state.mode === "per turns" ? (
          <div className="main_video_container video_display d-flex">
            <h2 style={{paddingLeft: "20px"}}>
              Debate Topic Name: {this.props.location.state.name}
            </h2>
            <div>
              <div className="timer_div">
                <Video
                  videoStyles={{
                    zIndex: 2,
                    backgroundColor: "black",
                    flex: 3,
                  }}
                  videoStream={this.state.localStream}
                  autoPlay
                  ref={this.localRef}
                  streamType="local"
                  connected={this.state.connected}
                  timer={this.state.timer}
                  mode={this.state.mode}
                  pauseTime={this.getChildData}
                  finishTime={this.callOnComplete}
                  callPauseTime={this.checkPauseTime}></Video>
                <div className="send-message-form">
                  {this.state.debateComments.length
                    ? this.state.debateComments.map(comment => (
                        <>
                          {comment[localStorage.getItem("id")] ? (
                            <div className="mt-2 comment_list">
                              <img
                                src={
                                  comment[localStorage.getItem("id")].profilePic
                                }
                                alt="Avatar"
                              />
                              <div className="text_message">
                                <p>
                                  {
                                    comment[localStorage.getItem("id")]
                                      .commentText
                                  }
                                </p>
                                <span className="time-right">
                                  {comment[localStorage.getItem("id")].time}
                                </span>
                              </div>
                            </div>
                          ) : comment[this.state.remoteUserId] ? (
                            <div className="mt-2 comment_list">
                              <img
                                src={
                                  comment[this.state.remoteUserId].profilePic
                                }
                                alt="Avatar"
                              />
                              <div className="text_message">
                                <p>
                                  {comment[this.state.remoteUserId].commentText}
                                </p>
                                <span className="time-right">
                                  {comment[this.state.remoteUserId].time}
                                </span>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ))
                    : null}
                </div>
                <div className="form_data">
                  <input
                    onChange={e => this.handleTextMessage(e)}
                    placeholder="Type your message"
                    type="text"
                    className="form-control mr-5"
                    id="message"
                  />
                  <div className="send_button">
                    <img
                      src={`../../assets/images/send.png`}
                      alt="send"
                      onClick={e => this.sendMessage(e)}
                    />
                  </div>
                </div>
              </div>
              <Video
                videoStyles={{
                  zIndex: 1,
                  backgroundColor: "black",
                  flex: 1,
                  width: "100%",
                  height: "100vh",
                }}
                videoStream={
                  this.state.selectedVideo && this.state.selectedVideo.stream
                }
                autoPlay
                streamType="remote"></Video>
            </div>
            <button
              className="btn d-flex"
              onClick={this.makeTurnMute}
              style={{
                backgroundColor: "#ff921d",
                color: "white",
              }}
              disabled={!this.state.turnObj[localStorage.getItem("id")]}>
              Finish Turn
            </button>
          </div>
        ) : (
          <div className="main_video_container video_display d-flex">
            <h2 style={{paddingLeft: "20px"}}>
              Debate Topic Name: {this.props.location.state.name}
            </h2>
            <div id="elementToShare">
              <div className="timer_div">
                <Video
                  videoStyles={{
                    zIndex: 2,
                    backgroundColor: "black",
                    flex: 3,
                  }}
                  videoStream={this.state.localStream}
                  autoPlay
                  ref={this.localRef}
                  streamType="local"
                  connected={this.state.connected}
                  timer={this.state.timer}
                  mode={this.state.mode}
                  pauseTime={this.getChildData}
                  finishTime={this.callOnComplete}></Video>

                <div className="send-message-form">
                  {this.state.debateComments.length
                    ? this.state.debateComments.map(comment => (
                        <>
                          {comment[localStorage.getItem("id")] ? (
                            <div className="mt-2 comment_list">
                              <img
                                src={
                                  comment[localStorage.getItem("id")].profilePic
                                }
                                alt="Avatar"
                              />
                              <div className="text_message">
                                <p>
                                  {
                                    comment[localStorage.getItem("id")]
                                      .commentText
                                  }
                                </p>
                                <span className="time-right">
                                  {comment[localStorage.getItem("id")].time}
                                </span>
                              </div>
                            </div>
                          ) : comment[this.state.remoteUserId] ? (
                            <div className="mt-2 comment_list">
                              <img
                                src={
                                  comment[this.state.remoteUserId].profilePic
                                }
                                alt="Avatar"
                              />
                              <div className="text_message">
                                <p>
                                  {comment[this.state.remoteUserId].commentText}
                                </p>
                                <span className="time-right">
                                  {comment[this.state.remoteUserId].time}
                                </span>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ))
                    : null}
                </div>
                <div className="form_data">
                  <input
                    onChange={e => this.handleTextMessage(e)}
                    placeholder="Type your message"
                    type="text"
                    className="form-control mr-5"
                    id="message"
                  />
                  <div className="send_button">
                    <img
                      src={`../../assets/images/send.png`}
                      alt="send"
                      onClick={e => this.sendMessage(e)}
                    />
                  </div>
                </div>
              </div>
              <Video
                videoStyles={{
                  zIndex: 1,
                  backgroundColor: "black",
                  flex: 1,
                  width: "100%",
                  height: "100vh",
                }}
                videoStream={
                  this.state.selectedVideo && this.state.selectedVideo.stream
                }
                autoPlay
                streamType="remote"></Video>
            </div>
          </div>
        )}
        {/* {this.state.uploadPercentage === 100 ? ( */}
        {/* <>
          <AdSense.Google
            client="ca-pub-3120108993780053"
            slot="7806394673"
            style={{display: "block", border: "solid 1px black"}}
            format="auto"
            responsive="true"
          />
          <iframe className="ad_iframe"
            src="https://www.youtube.com/embed/me0RCXdfuuA?autoplay=1&mute=1"
            height="250"
            width="550"
          />
        </> */}
        {/* ) : null} */}
        <br />
      </div>
    );
  }
}

export default withRouter(DebateVideo);
