const fs = require("fs");
const path = require("path");
const User = require("../models/userSchema");
const File = require("../models/fileSchema");

const uploadVideo = async (req, res) => {
  try {
    const user = req.user;
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;

    // Create folder for user if it doesn't exist
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const folderPath = path.join(__dirname, `../uploads/${folderName}`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Create folder for videos if it doesn't exist
    const videoPath = path.join(folderPath, "video");
    if (!fs.existsSync(videoPath)) {
      fs.mkdirSync(videoPath);
    }

    // Save file information to database
    const fileExtension = path.extname(fileName);
    const newFileName = `${fileName.toString()}`;
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
    });
    await file.save();

    // Move file to appropriate folder
    const filePath = path.join(videoPath, newFileName);
    fs.renameSync(req.file.path, filePath);

    res.send({ message: "File uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const uploadAudio = async (req, res) => {
  try {
    const user = req.user;
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;

    // Create folder for user if it doesn't exist
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const folderPath = path.join(__dirname, `../uploads/${folderName}`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Create folder for audio if it doesn't exist
    const audioPath = path.join(folderPath, "audio");
    if (!fs.existsSync(audioPath)) {
      fs.mkdirSync(audioPath);
    }

    // Save file information to database
    const fileExtension = path.extname(fileName);
    const newFileName = `${fileName.toString()}`;
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
    });
    await file.save();

    // Move file to appropriate folder
    const filePath = path.join(audioPath, newFileName);
    fs.renameSync(req.file.path, filePath);

    res.send({ message: "File uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const uploadImage = async (req, res) => {
  try {
    const user = req.user;
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;

    // Create folder for user if it doesn't exist
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const folderPath = path.join(__dirname, `../uploads/${folderName}`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Create folder for images if it doesn't exist
    const imagePath = path.join(folderPath, "image");
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }

    // Save file information to database
    const fileExtension = path.extname(fileName);
    const newFileName = `${fileName.toString()}`;
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
    });
    await file.save();
    // Move file to appropriate folder

    const filePath = path.join(imagePath, newFileName);
    fs.renameSync(req.file.path, filePath);

    res.send({ message: "File uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAudioFiles = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const folderPath = path.join(__dirname, `../uploads/${folderName}`);
    const audioPath = path.join(folderPath, "audio");
    const files = fs.readdirSync(audioPath);
    res.send({ files });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getVideoFiles = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const folderPath = path.join(__dirname, `../uploads/${folderName}`);
    const videoPath = path.join(folderPath, "video");
    const files = fs.readdirSync(videoPath);
    res.send({ files });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getImageFiles = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const folderPath = path.join(__dirname, `../uploads/${folderName}`);
    const imagePath = path.join(folderPath, "image");
    const files = fs.readdirSync(imagePath);
    res.send({ files });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  uploadVideo,
  uploadAudio,
  uploadImage,
  getAudioFiles,
  getVideoFiles,
  getImageFiles,
};
