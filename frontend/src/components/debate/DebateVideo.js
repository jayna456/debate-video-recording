import React, { useEffect, useRef, useState } from "react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/debate.scss";
import { callVideoRecording } from "../../Actions/debateAction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DebateVideo() {
  const dispatch = useDispatch();
  const history = useHistory();

  const userVideo = useRef();
  const partnerVideo = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const socket = useRef();

  const [stream, setStream] = useState("");
  const [senderId, setSenderId] = useState("");
  const [receiverId, setRecevierId] = useState("");
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  let recordedChunks = [];
  let mediaRecorder;

  const pc_config = {
    "iceServers": [
      {
        urls : 'stun:stun.l.google.com:19302'
      }
    ]
  }
  let pc = new RTCPeerConnection(pc_config)

  useEffect(() => {
    // if (
    //   localStorage.getItem("id") &&
    //   localStorage.getItem("debateAccountToken") &&
    //   localStorage.getItem("email")
    // ) {
      socket.current = io.connect("http://localhost:8000/webrtcPeer"); // server path which includes https
      // socket.current = io('/webrtcPeer');
      // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      //   .then((stream) => {
      //     // setStream(stream);
      //     window.localStream = stream
      //     localVideoRef.current.srcObject = stream;
      //     pc.addStream(stream);

      //     const options = { mimeType: "video/webm; codecs=vp9" };
      //     mediaRecorder = new MediaRecorder(stream, options);

      //     mediaRecorder.ondataavailable = handleDataAvailable;
      //     mediaRecorder.start();
      //   })
      //   .catch((error) => {
      //     console.log("errror.. ", error.toString());
      //     toast.error(error);
      //   });

      socket.current.on('connection-success', success => {
        console.log('connection... ', success);
      })

      socket.current.on('offerOrAnswer', (sdp) => {
        let sessionDesc = new RTCSessionDescription(sdp);
        pc.setRemoteDescription(sessionDesc)
        .then((result) => {
          console.log('result...', result);
        })
        .catch((err) => {
          console.log('errr.. ', err);
        });
      })

      socket.current.on('candidate', (candidate) => {
        console.log('candidate.. ', candidate);
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      })

      pc.onicecandidate = (e) => {
        if(e.candidate) {
          sendToPeer('candidate',e.candidate);
        }
      }

      pc.oniceconnectionstatechange = (e) => {
        console.log('e... ', e);
      }

      pc.ontrack = (e) => {
        console.log('e... ', e);
        remoteVideoRef.current.srcObject = e.streams[0];
      }

      pc.onnegotiationneeded = e => pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      // .then(() => signalingChannel.send(JSON.stringify({ "sdp": pc.localDescription }))
      .catch(err => console.log('err in negotitation needed'))

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        window.localStream = stream
        localVideoRef.current.srcObject = stream;
        // pc.addTrack(stream);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        const options = { mimeType: "video/webm; codecs=vp9" };
        mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = handleDataAvailable;
        // mediaRecorder.start();
        setTimeout(event => {
          console.log("stopping", mediaRecorder.state);
          mediaRecorder.stop();
          socket.current.emit("disconnect");
          socket.current.disconnect();
          console.log('socket disconnected', mediaRecorder.state);
          setCallAccepted(false);
        }, 300000);
      })
      .catch((error) => {
        console.log("errror.. ", error.toString());
        toast.error(error);
      });

      // socket.current.on("senderId", (id) => {
      //   setSenderId(id);
      // });

      // socket.current.on("receiverId", (users) => {
      //   setRecevierId(users);
      // });

      // socket.current.on("hey", (data) => {
      //   setReceivingCall(true);
      //   setCaller(data.from);
      //   setCallerSignal(data.signal);
      // });

      // setTimeout(event => {
      //   console.log("stopping");
      //   mediaRecorder.stop();
      //   socket.current.emit("disconnect");
      //   socket.current.disconnect();
      //   console.log('socket disconnected');
      //   setCallAccepted(false);
      // }, 300000);

      //5400000 -> 1 hour 30 minutes
      //1800000 -> 30 minutes
      //720000 -> 12 minutes
    // } else {
    //   history.push("/");
    // }
  }, []);

  const sendToPeer = (messageType, payload) => {
    console.log('send to peer fn called...', messageType, payload);
    socket.current.emit(messageType, {
      socketID: socket.current.id,
      payload
    })
  }

  const handleDataAvailable = (event) => {
    console.log("data-available");
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      // download();
    } else {
      // ...
      console.log('in else');
    }
  }

  const download = () => {
    console.log('in download fn');
    var blob = new Blob(recordedChunks, {
      type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = `${new Date()}.webm`;
    console.log('url... ', url);
    a.click();
    window.URL.revokeObjectURL(url);
    localVideoRef.current.autoStart = false;
  }

  const callPeer = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {},
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: senderId,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  };

  const createOffer = () => {
    console.log('offer ');

    pc.createOffer({ offerToReceiveAudio:1, offerToReceiveVideo:1})
    .then((sdp) => {
      pc.setLocalDescription(sdp);

      sendToPeer('offerOrAnswer',sdp);
    });
  }

  const createAnswer = () => {
    console.log('answer.. ');

    pc.createAnswer({ offerToReceiveVideo:1, offerToReceiveAudio: 1})
    .then((sdp) => {
      pc.setLocalDescription(sdp);

      sendToPeer('offerOrAnswer',sdp);
      setCallAccepted(true);
      
    })
    .catch((error) => {
      console.log('error in create answer', error);
    });
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />
      <ToastContainer />
      <div className="main-content">
        <div className="row" style={{ marginLeft: "5px" }}>
          <div className="col-6">
            <video
              style={{ width: "65%", height: "65%" }}
              controls
              ref={localVideoRef}
              autoPlay
            ></video>
          </div>
          {/* {callAccepted ?  */}
          <div className="col-6">
            <video
              style={{ width: "65%", height: "65%" }}
              controls
              ref={remoteVideoRef}
              autoPlay
            ></video>
          </div> 
          {/* : null} */}
          
        </div>

        <button onClick={createOffer}>Offer</button>
        <button onClick={createAnswer}>Answer</button>
        {/* <div className="row" style={{ marginLeft: "5px" }}>
          {Object.keys(receiverId).map((key) => {
            if (key === senderId) {
              return null;
            }
            return (
              <button key={key} onClick={() => callPeer(key)}>
                Call {key}
              </button>
            );
          })}
        </div> */}

        {/* <div className="row">
          {receivingCall ? (
            <div>
              <h1>{caller} is calling you</h1>
              <button onClick={acceptCall}>Accept</button>
            </div>
          ) : null}
        </div> */}
      </div>
    </div>
  );
}

export default DebateVideo;
