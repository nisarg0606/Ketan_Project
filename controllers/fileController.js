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
    //remove spaces from file name
    const newFileName = `${fileName.toString()}`.replace(/\s+/g, "");
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
      typeFile: "video",
      user: user._id,
    });
    await file.save();

    // Move file to appropriate folder
    const filePath = path.join(videoPath, newFileName);
    fs.renameSync(req.file.path, filePath);

    res.send({ message: "File uploaded successfully", file: file });
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

    // Create folder for audios if it doesn't exist
    const audioPath = path.join(folderPath, "audio");
    if (!fs.existsSync(audioPath)) {
      fs.mkdirSync(audioPath);
    }

    // Save file information to database
    const fileExtension = path.extname(fileName);
    //remove spaces from file name
    const newFileName = `${fileName.toString()}`.replace(/\s+/g, "");
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
      typeFile: "audio",
      user: user._id,
    });
    await file.save();

    // Move file to appropriate folder
    const filePath = path.join(audioPath, newFileName);
    fs.renameSync(req.file.path, filePath);

    res.send({ message: "File uploaded successfully", file: file });
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
    //remove spaces from file name
    const newFileName = `${fileName.toString()}`.replace(/\s+/g, "");
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
      typeFile: "image",
      user: user._id,
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

const uploadFile = async (req, res) => {
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

    // Create folder for files if it doesn't exist
    const filePath = path.join(folderPath, "file");
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    // Save file information to database
    const fileExtension = path.extname(fileName);
    //remove spaces from file name
    const newFileName = `${fileName.toString()}`.replace(/\s+/g, "");
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
      typeFile: "file",
      user: user._id,
    });
    await file.save();

    // Move file to appropriate folder
    const fileDestination = path.join(filePath, newFileName);
    fs.renameSync(req.file.path, fileDestination);

    res.send({ message: "File uploaded successfully", file: file });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    //get all files from database
    const files = await File.find({
      typeFile: "file",
      user: req.user._id,
    }).exec();
    const fileUrls = files.map((file) => {
      // D:\Ketan_Project\uploads\ketanfunde\file
      // const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/file/${file.name}`;
      // const fileUrl = process.env.BASE_URL_UPLOADS + `\\uploads\\${folderName}\\file\\${file.name}`;
      //get id of file
      const fileUrl = {};
      fileUrl.id = file._id;
      fileUrl.name = file.name;
      return fileUrl;
    });
    res.send({ files: fileUrls });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getFileById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const file = await File.findById(req.params.id).exec();
    const fileUrl = `./uploads/${folderName}/file/${file.name}`;
    res.sendFile(fileUrl, { root: "./" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAllImages = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    //get all images from database
    const files = await File.find({
      typeFile: "image",
      user: req.user._id,
    }).exec();
    const imageUrls = files.map((file) => {
      // D:\Ketan_Project\uploads\ketanfunde\image
      // const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/image/${file.name}`;
      // const imageUrl = process.env.BASE_URL_UPLOADS + `\\uploads\\${folderName}\\image\\${file.name}`;
      //get id of image
      const imageUrl = {};
      imageUrl.id = file._id;
      imageUrl.name = file.name;
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
    const file = await File.findById(req.params.id).exec();
    const imageUrl = `./uploads/${folderName}/image/${file.name}`;
    res.sendFile(imageUrl, { root: "./" });
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
    res.status(200).send({ message: "File deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    //get all images from database of user
    // get user id from token
    const userId = req.user._id;
    const files = await File.find({ typeFile: "video", user: userId }).exec();
    const videoUrls = files.map((file) => {
      // D:\Ketan_Project\uploads\ketanfunde\image
      // const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/image/${file.name}`;
      // const videoUrl = process.env.BASE_URL_UPLOADS + `\\uploads\\${folderName}\\video\\${file.name}`;
      const videoUrl = {};
      videoUrl.id = file._id;
      videoUrl.name = file.name;
      return videoUrl;
    });
    if (videoUrls.length === 0) {
      res.status(404).send({ error: "No videos found" });
      return;
    }
    res.status(200).send({ videos: videoUrls });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const file = await File.findById(req.params.id).exec();
    const videoUrl = `./uploads/${folderName}/video/${file.name}`;
    res.sendFile(videoUrl, { root: "./" });
  } catch (e) {
    console.log(e.code);
    // if file not found
    if (e.code === undefined) {
      res.status(404).send({ error: "File not found" });
    } else {
      console.log(e);
      res.status(500).send({ error: "Internal server error" });
    }
  }
};

const deleteVideoById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const videoPath = path.join(__dirname, `../uploads/${folderName}/video`);
    const file = await File.findById(req.params.id).exec();
    if (!file) {
      res.status(404).send({ error: "File not found" });
      return;
    }
    fs.unlinkSync(path.join(videoPath, file.name));
    await file.deleteOne();
    res.send({ message: "File deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAllAudios = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const files = await File.find({
      typeFile: "audio",
      user: req.user._id,
    }).exec();
    const audioUrls = files.map((file) => {
      // D:\Ketan_Project\uploads\ketanfunde\image
      // const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/image/${file.name}`;
      // const audioUrl = process.env.BASE_URL_UPLOADS + `\\uploads\\${folderName}\\audio\\${file.name}`;
      const audioUrl = {};
      audioUrl.id = file._id;
      audioUrl.name = file.name;
      return audioUrl;
    });
    res.send({ audios: audioUrls });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAudioById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const file = await File.findById(req.params.id).exec();
    const audioUrl = `./uploads/${folderName}/audio/${file.name}`;
    res.sendFile(audioUrl, { root: "./" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const deleteAudioById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const file = await File.findById(req.params.id).exec();
    if (!file) {
      res.status(404).send({ error: "File not found" });
      return;
    }
    const audioPath = path.join(__dirname, `../uploads/${folderName}/audio`);
    fs.unlinkSync(path.join(audioPath, file.name));
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
  uploadFile,
  getAllFiles,
  getFileById,
  getAllImages,
  getImageById,
  deleteImageById,
  getAllVideos,
  getVideoById,
  deleteVideoById,
  getAllAudios,
  getAudioById,
  deleteAudioById,
};
