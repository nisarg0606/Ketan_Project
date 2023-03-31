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

    res.send({ message: "File uploaded successfully" , file: file});
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

    res.send({ message: "File uploaded successfully" , file: file});
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

    res.send({ message: "File uploaded successfully", file: file });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAllImages = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const imagePath = path.join(__dirname, `../uploads/${folderName}/image`);
    const files = await File.find({}).exec();
    const imageUrls = files.map((file) => {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/image/${file.name}`;
      return imageUrl;
    });
    res.send({ images: imageUrls });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getImageById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const imagePath = path.join(__dirname, `../uploads/${folderName}/image`);
    const file = await File.findById(req.params.id).exec();
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/image/${file.name}`;
    res.send({ image: imageUrl });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const deleteImageById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const imagePath = path.join(__dirname, `../uploads/${folderName}/image`);
    const file = await File.findById(req.params.id).exec();
    if (!file) {
      res.status(404).send({ error: "File not found" });
      return;
    }
    fs.unlinkSync(path.join(imagePath, file.name));
    await file.deleteOne();
    res.send({ message: "File deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};


module.exports = {
  uploadVideo,
  uploadAudio,
  uploadImage,
  getAllImages,
  getImageById,
  deleteImageById,
};
