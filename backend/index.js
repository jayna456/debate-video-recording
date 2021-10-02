const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const https = require("https");
const app = express();
const socket = require("socket.io");
const fs = require("fs");
require("dotenv").config();

const path = require("path");
let userRoute = require("./routes/user.route");
let debateRoute = require("./routes/debate.route");
let paymentRoute = require("./routes/payment.route");

// Certificate
// const privateKey = fs.readFileSync(
//   "/etc/letsencrypt/live/pieramo.com/privkey.pem",
//   "utf8"
// );
// const certificate = fs.readFileSync(
//   "/etc/letsencrypt/live/pieramo.com/cert.pem",
//   "utf8"
// );
// const ca = fs.readFileSync(
//   "/etc/letsencrypt/live/pieramo.com/chain.pem",
//   "utf8"
// );

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };

const server = http.createServer(app);
const httpsServer = https.createServer(app);
console.log("process.env.NODE_ENV ", process.env.NODE_ENV);
const io =
  process.env.NODE_ENV === "developement"
    ? socket(server)
    : socket(httpsServer);

mongoose.connect(
  "mongodb+srv://dds:dds123@cluster0-qxjv3.mongodb.net/debeate?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (error, result) => {
    if (error) {
      console.log("error while connecting to db", error);
    } else {
      console.log("successfully connected with db");
    }
  }
);

app.use(bodyParser.json({limit: "500mb"}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true}));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", userRoute);

app.use("/api/debate", debateRoute);
app.use("/api/payment", paymentRoute);

app.get("/", (req, res) => {
  res.send("welcome");
});

if (process.env.NODE_ENV === "developement") {
  server.listen(8000, () => console.log("http server running on port 8000"));
} else {
  httpsServer.listen(8000, () =>
    console.log("HTTPS Server running on port 8000")
  );
}

const peers = io.of("/webrtcPeer");

let connectedPeers = new Map();

peers.on("connection", socket => {
  connectedPeers.set(socket.id, socket);

  console.log(socket.id);
  socket.emit("connection-success", {
    success: socket.id,
    peerCount: connectedPeers.size,
  });

  const broadcast = () =>
    socket.broadcast.emit("joined-peers", {
      peerCount: connectedPeers.size,
    });
  broadcast();

  const disconnectedPeer = socketID =>
    socket.broadcast.emit("peer-disconnected", {
      peerCount: connectedPeers.size,
      socketID: socketID,
    });

  socket.on("disconnect", () => {
    console.log("disconnected");
    connectedPeers.delete(socket.id);
    disconnectedPeer(socket.id);
  });

  socket.on("onlinePeers", data => {
    for (const [socketID, _socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID.local) {
        console.log("online-peer", data.socketID, socketID);
        socket.emit("online-peer", socketID);
      }
    }
  });

  socket.on("offer", data => {
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID === data.socketID.remote) {
        console.log("Offer", socketID, data.socketID, data.payload.type);
        socket.emit("offer", {
          sdp: data.payload,
          socketID: data.socketID.local,
        });
      }
    }
  });

  socket.on("answer", data => {
    for (const [socketID, socket] of connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        console.log("Answer", socketID, data.socketID, data.payload.type);
        socket.emit("answer", {
          sdp: data.payload,
          socketID: data.socketID.local,
        });
      }
    }
  });

  socket.on("candidate", data => {
    // send candidate to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        socket.emit("candidate", {
          candidate: data.payload,
          socketID: data.socketID.local,
        });
      }
    }
  });
});
