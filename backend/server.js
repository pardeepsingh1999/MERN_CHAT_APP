const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use("/api/user", userRoutes);

app.get("/api/chat", (req, res) => {
  res.send("chat");
});

app.get("/api/chat/:id", (req, res) => {
  console.log(req.params.id);
  res.send("single chat");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`.yellow.bold);
});
