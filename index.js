// This server will handle socket.io connections
const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4500 ;

app.use(express.static(__dirname + "/"));
app.use(cors());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`its working on http://localhost:${port}`);
});

//socket
const io = require("socket.io")(server);
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (Name) => {
    console.log("New User Joined", Name);
    users[socket.id] = Name;
    socket.broadcast.emit("user-joined", Name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
