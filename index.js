const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get('/', (req, res) => { res.status(200).send('OK'); });

const adjectives = [
  "Sleepy",
  "Grumpy",
  "Sneaky",
  "Wobbly",
  "Fluffy",
  "Clumsy",
  "Spooky",
  "Hangry",
  "Goofy",
  "Jumpy",
  "Dizzy",
  "Whiny",
  "Bouncy",
  "Cranky",
  "Sassy",
  "Dopey",
  "Noisy",
  "Cheeky",
  "Lazy",
  "Hyper",
];

const nouns = [
  "Potato",
  "Noodle",
  "Pickle",
  "Waffle",
  "Burrito",
  "Muffin",
  "Nugget",
  "Pretzel",
  "Biscuit",
  "Pancake",
  "Dumpling",
  "Taco",
  "Donut",
  "Meatball",
  "Cupcake",
  "Banana",
  "Avocado",
  "Sausage",
  "Crouton",
  "Nacho",
];

// Harmonically pleasant frequencies (pentatonic scale across 3 octaves)
const frequencies = [
  165, 185, 220, 247, 277, 330, 370, 415, 440, 494, 554, 587, 659, 740, 880,
];

function generateName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
  const userName = generateName();
  const userFreq = frequencies[Math.floor(Math.random() * frequencies.length)];

  // Send this user their own identity
  socket.emit("welcome", {
    color: userColor,
    name: userName,
    freq: userFreq,
  });

  // Broadcast cursor movement to everyone else
  socket.on("cursor-move", (data) => {
    socket.broadcast.emit("cursor-update", {
      id: socket.id,
      x: data.x,
      y: data.y,
      color: userColor,
      name: userName,
      freq: userFreq,
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-left", socket.id);
    console.log("User left:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("uncaughtException", (err) => { console.error("Uncaught exception:", err); });
process.on("unhandledRejection", (reason, promise) => { console.error("Unhandled rejection at:", promise, "reason:", reason); });
