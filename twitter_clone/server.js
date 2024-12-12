const express = require("express");
require('dotenv').config();

const postRoutes = require("./route/post.route");
const publicPostRoutes = require("./route/post.public.route");
const userRoutes = require("./route/user.route");
const publicUserRoutes = require("./route/user.public.route");
const mongoose = require("mongoose");
const cors = require('cors')

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {jwtDecode} = require("jwt-decode");
const app = express();
// Connect to MongoDB
mongoose
  .connect("mongodb+srv://helenzhangye:project3@cluster0.6hfg0.mongodb.net/", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
  });

//middleware
const corsOptions ={
  origin: process.env.VITE_CLIENT_URL,
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

  if (token == null) return res.sendStatus(401);  // No token present

  jwt.verify(token, process.env.VITE_SECRET_KEY, (err, payload) => {
    if (err) return res.sendStatus(403);  // Invalid token
    req.payload = payload;
    next();
  });
};

app.use("/api/post", authenticateToken, postRoutes);
app.use("/api/public/post", publicPostRoutes);
app.use("/api/user", authenticateToken, userRoutes);
app.use("/api/public/user", publicUserRoutes);

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
