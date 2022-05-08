const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors"); // it is used in this file
var cors = require("cors");
const { Server } = require("socket.io");

dotenv.config();

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

app.use(cors()); // cors
app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------------------- Start: Deployment ---------------------------- //

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is Running Successfully");
//   });
// }

// ------------------------------- End: Deployment ---------------------------- //

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`.yellow.bold);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  socket.on("setup", async (params, fn) => {
    try {
      console.log("USER CONNECTED", params.room);

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

  socket.on("unjoinChat", async (room, fn) => {
    try {
      socket.leave(room);
      console.log("user unjoined room: ", room);

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

  socket.on("unsetup", (params, fn) => {
    try {
      console.log("USER DISCONNECTED", params.room);
      socket.leave(params.room);

      fn({ error: false });
    } catch (error) {
      console.log("[error]", "disconnect room :", error);
      fn({ error: true, defaultRoom: socket.id });
    }
  });
});
