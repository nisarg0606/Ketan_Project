const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userSchema");
const File = require("./models/fileSchema");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const app = express();
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cors = require("cors");
dotenv.config();
const storage = multer.diskStorage({
  // function to create a folder with the name of the user
  destination: function (req, file, cb) {
    // null is for error
    // create a folder under uploads by the name of the user and store the file in that folder
    cb(null, `./uploads/${req.user.name}`);
  },
  filename: function (req, file, cb) {
    // null is for error
    // create a folder under uploads by the name of the user and store the file in that folder
    cb(null, true);
  },
});
const upload = multer({
  // create a function to create a folder with the name of the user
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
});

// Middleware
app.use(express.json());
// Connect to DB
mongoose
  .connect("mongodb://127.0.0.1:27017/ketan")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

//login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Please add email or password" });
  }

  let user = await User.findOne({ email: email });
  if (!user) {
    res.status(400).json({ error: "Invalid Credentials" });
  } else {
    // compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid Credentials" });
    } else {
      // generate token
      const token = jsonwebtoken.sign(
        { _id: user._id },
        process.env.JWT_SECRET
      );
      res.json({ token, user });
    }
  }
});

//signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Please add all the fields" });
  }
  try {
    // check if user already exists
    const isExists = await User.findOne({ email: email });
    if (isExists) {
      res.status(400).json({ error: "User already exists" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    // save user
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    console.log(err);
  }
});

app.post("/upload/image", auth, upload.single("file"), async (req, res) => {
  if (!req.user) {
    res.status(400).json({ error: "Please login" });
  }
  // get user name from req.user
  const { name } = req.user;
  // create a folder with the name of the user
  const dir = `./uploads/${name}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // if file type is not image like jpg, png, jpeg
  if (!req.file) {
    res.status(400).json({ error: "Please upload a file" });
  }
  try {
    if (
      !req.file.mimetype.startsWith("jpg") ||
      !req.file.mimetype.startsWith("jpeg") ||
      !req.file.mimetype.startsWith("png")
    ) {
      res.status(400).json({ error: "Please upload an image file" });
    }

    const file = new File({
      name: req.file.originalname,
      //path
      path: req.file.path,
      type: req.file.mimetype,
    });
    const savedFile = await file.save();
    res.json(savedFile);
  } catch (err) {
    console.log(err);
  }
});

// get all user's images
app.get("/images", auth, async (req, res) => {
  if (!req.user) {
    res.status(400).json({ error: "Please login" });
  }
  // get user name from req.user
  const { name } = req.user;
  // get all images of the user
  try {
    // get only images
    // const files = await File.find({ type: "image/jpeg" });
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wrong" });
  }
});

// upload video
app.post("/upload/video", auth, upload.single("file"), async (req, res) => {
  if (!req.user) {
    res.status(400).json({ error: "Please login" });
  }
  // get user name from req.user
  const { name } = req.user;
  // create a folder with the name of the user
  const dir = `./uploads/${name}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // if file type is not image like jpg, png, jpeg
  if (!req.file) {
    res.status(400).json({ error: "Please upload a file" });
  }
  try {
    if (
      !req.file.mimetype.startsWith("mp4") ||
      !req.file.mimetype.startsWith("mkv") ||
      !req.file.mimetype.startsWith("avi")
    ) {
      res.status(400).json({ error: "Please upload a video file" });
    }

    const file = new File({
      name: req.file.originalname,
      //path
      path: req.file.path,
      type: req.file.mimetype,
    });
    const savedFile = await file.save();
    res.status(200).json(savedFile);
  } catch (err) {
    console.log(err);
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
