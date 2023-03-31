const express = require("express");
const router = express.Router();
const userController = require("../controllers/userContoller");
const auth = require("../middleware/auth");

// Login API
router.post("/login", userController.login);

// Register API
router.post("/register", userController.register);

module.exports = router;
