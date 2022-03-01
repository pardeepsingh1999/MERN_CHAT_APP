const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
var cors = require("cors");

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
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

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`.yellow.bold);
});
