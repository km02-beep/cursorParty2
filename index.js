const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
io.engine.on("connection_error", (err) => {
  console.error("Socket.io connection error:", err);
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("Health check request received");
  res.status(200).send("OK");
});

// Harmonically pleasant frequencies (pentatonic scale across 3 octaves)
const frequencies = [
  165, 185, 220, 247, 277, 330, 370, 415, 440, 494, 554, 587, 659, 740, 880,
];
const backgroundTracks = ["bg1.mp3", "bg2.mp3", "bg3.mp3"];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userColor = `#ffffff`;
  const userFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
  const userBackgroundTrack =
    backgroundTracks[Math.floor(Math.random() * backgroundTracks.length)];

  // Send this user their own identity
  socket.emit("welcome", {
    color: userColor,
    freq: userFreq,
    backgroundTrack: userBackgroundTrack,
  });

  // Broadcast cursor movement to everyone else
  socket.on("cursor-move", (data) => {
    socket.broadcast.emit("cursor-update", {
      id: socket.id,
      x: data.x,
      y: data.y,
      color: userColor,
      freq: userFreq,
      isTouching: data.isTouching || false,
      isActive: data.isActive || false,
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-left", socket.id);
    console.log("User left:", socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
});
