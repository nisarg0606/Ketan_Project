const express = require("express");
const router = express.Router();
const userController = require("../controllers/userContoller");
const auth = require("../middleware/auth");

const { login, register } = require("../controllers/userContoller");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
