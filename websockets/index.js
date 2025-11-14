import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("Um cliente conectou-se!");
  socket.on("echo", (msg) => {
    socket.emit("echo", msg);
  });
});