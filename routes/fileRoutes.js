const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const fileController = require("../controllers/fileController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const username = req.user.name.trim().replace(/\s+/g, "").toLowerCase();
    const path = `./uploads/${username}/${file.fieldname}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// localhost:5000/api/files and then the routes below
router.post("/video", auth, upload.single("video"), fileController.uploadVideo);
router.post("/audio", auth, upload.single("audio"), fileController.uploadAudio);
router.post("/image", auth, upload.single("image"), fileController.uploadImage);
router.post("/file", auth, upload.single("file"), fileController.uploadFile);
router.get("/getFiles", auth, fileController.getAllFiles);
router.get("/getFile/:id", auth, fileController.getFileById);
router.get("/getImages", auth, fileController.getAllImages);
router.get("/getImage/:id", auth, fileController.getImageById);
router.delete("/deleteImage/:id", auth, fileController.deleteImageById);
router.get("/getVideos", auth, fileController.getAllVideos);
router.get("/getVideo/:id", auth, fileController.getVideoById);
router.delete("/deleteVideo/:id", auth, fileController.deleteVideoById);
router.get("/getAudios", auth, fileController.getAllAudios);
router.get("/getAudio/:id", auth, fileController.getAudioById);
router.delete("/deleteAudio/:id", auth, fileController.deleteAudioById);

module.exports = router;
