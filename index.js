const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve everything in the public folder
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Assign each user a random color
  const userColor = `hsl(${Math.random() * 360}, 70%, 60%)`;

  // When someone moves their cursor, broadcast it to everyone else
  socket.on("cursor-move", (data) => {
    socket.broadcast.emit("cursor-update", {
      id: socket.id,
      x: data.x,
      y: data.y,
      color: userColor,
    });
  });

  // When someone disconnects, tell everyone to remove their cursor
  socket.on("disconnect", () => {
    io.emit("user-left", socket.id);
    console.log("User left:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
