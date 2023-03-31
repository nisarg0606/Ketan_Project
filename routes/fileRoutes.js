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

router.post("/video", auth, upload.single("video"), fileController.uploadVideo);
router.post("/audio", auth, upload.single("audio"), fileController.uploadAudio);
router.post("/image", auth, upload.single("image"), fileController.uploadImage);
router.get("/audio", auth, fileController.getAudioFiles);
router.get("/video", auth, fileController.getVideoFiles);
router.get("/image", auth, fileController.getImageFiles);


module.exports = router;
