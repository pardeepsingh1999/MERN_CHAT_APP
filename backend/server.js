const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
var cors = require("cors");
const { Server } = require("socket.io");
var http = require("http");

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

app.use(cors()); // cors
app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`.yellow.bold);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "http://0.0.0.0:3000",
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  socket.on("setup", async (params, fn) => {
    try {
      await socket.join(params.room);

      fn({ error: false, defaultRoom: socket.id });
    } catch (error) {
      console.log("[error]", "join room :", error);
      fn({ error: true, reason: error.message });
    }
  });

  socket.on("disconnect", (params) => {
    // When a discconection by socket happens all rooms access on that socket connection dies
  });

  socket.on("joinChat", async (room, fn) => {
    try {
      socket.join(room);
      console.log("user joined room: ", room);

      fn({ error: false });
    } catch (error) {
      console.log("[error]", "leave room :", error);
      fn({ error: true, defaultRoom: socket.id });
    }
  });

  socket.on("typing", (room, isTyping = false) => {
    console.log("room & isTyping>>", room, isTyping);
    socket.in(room).emit("typing", isTyping);
  });

  socket.on("newMessage", async (newMessageReceived, fn) => {
    try {
      const chat = newMessageReceived.chat;

      if (!chat.users) {
        fn({ error: true, reason: "chat.users is not defined" });
        return;
      }

      chat.users.forEach((user) => {
        if (user._id !== newMessageReceived.sender._id) {
          socket.in(user._id).emit("messageReceived", newMessageReceived);
        }
      });

      fn({ error: false });
    } catch (error) {
      fn({ error: true, reason: error.message });
    }
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
