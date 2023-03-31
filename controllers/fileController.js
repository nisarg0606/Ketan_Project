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
    const file = new File({
      name: fileName,
      type: fileType,
    });
    await file.save();

    // Move file to appropriate folder
    const filePath = path.join(videoPath, file._id.toString());
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
    const file = new File({
      name: fileName,
      type: fileType,
    });
    await file.save();

    // Move file to appropriate folder
    const filePath = path.join(audioPath, file._id.toString());
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
    const file = new File({
      name: fileName,
      type: fileType,
    });
    await file.save();

    // Move file to appropriate folder
    const filePath = path.join(imagePath, file._id.toString());
    fs.renameSync(req.file.path, filePath);

    res.send({ message: "File uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  uploadVideo,
  uploadAudio,
  uploadImage,
};
