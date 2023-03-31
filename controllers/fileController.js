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
    //remove spaces from file name
    const newFileName = `${fileName.toString()}`.replace(/\s+/g, "");
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
      typeFile: "audio",
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
    //remove spaces from file name
    const newFileName = `${fileName.toString()}`.replace(/\s+/g, "");
    const file = new File({
      name: newFileName,
      type: fileType,
      extension: fileExtension,
      typeFile: "image",
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
    //get all images from database
    const files = await File.find({ typeFile: "image" }).exec();
    const imageUrls = files.map((file) => {
      // D:\Ketan_Project\uploads\ketanfunde\image
      // const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/image/${file.name}`;
      const imageUrl = process.env.BASE_URL_UPLOADS + `\\uploads\\${folderName}\\image\\${file.name}`;
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

const getAllVideos = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const videoPath = path.join(__dirname, `../uploads/${folderName}/video`);
    const files = await File.find({ typeFile: "video" }).exec();
    const videoUrls = files.map((file) => {
      // D:\Ketan_Project\uploads\ketanfunde\image
      // const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/image/${file.name}`;
      const videoUrl = process.env.BASE_URL_UPLOADS + `\\uploads\\${folderName}\\video\\${file.name}`;
      return videoUrl;
    });
    res.send({ videos: videoUrls });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const videoPath = path.join(__dirname, `../uploads/${folderName}/video`);
    const file = await File.findById(req.params.id).exec();
    const videoUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/video/${file.name}`;
    res.send({ video: videoUrl });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
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
    fs.unlinkSync(path.join(imagePath, file.name));
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
    const audioPath = path.join(__dirname, `../uploads/${folderName}/audio`);
    const files = await File.find({ typeFile: "audio" }).exec();
    const audioUrls = files.map((file) => {
      // D:\Ketan_Project\uploads\ketanfunde\image
      // const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/image/${file.name}`;
      const audioUrl = process.env.BASE_URL_UPLOADS + `\\uploads\\${folderName}\\audio\\${file.name}`;
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
    const audioPath = path.join(__dirname, `../uploads/${folderName}/audio`);
    const file = await File.findById(req.params.id).exec();
    const audioUrl = `${req.protocol}://${req.get("host")}/uploads/${folderName}/audio/${file.name}`;
    res.send({ audio: audioUrl });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
};

const deleteAudioById = async (req, res) => {
  try {
    const user = req.user;
    const folderName = user.name.trim().replace(/\s+/g, "").toLowerCase();
    const audioPath = path.join(__dirname, `../uploads/${folderName}/audio`);
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
  getAllVideos,
  getVideoById,
  deleteVideoById,
  getAllAudios,
  getAudioById,
  deleteAudioById,
};
