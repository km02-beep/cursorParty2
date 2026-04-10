const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

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

function generateName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
  const userName = generateName();

  socket.on("cursor-move", (data) => {
    socket.broadcast.emit("cursor-update", {
      id: socket.id,
      x: data.x,
      y: data.y,
      color: userColor,
      name: userName,
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
