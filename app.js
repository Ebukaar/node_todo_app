const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// Connection to mongodb
mongoose
  .connect("mongodb://localhost/todolist_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// View engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/auth"));
app.use(require("./routes/dashboard"));
app.use(require("./routes/todo"));

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// server configurations...
app.listen(3000, () => console.log("Server started listening on port:3000"));
