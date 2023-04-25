const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");


router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", auth, userController.getUsers);
router.get("/:id", auth, userController.getUser);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);
router.get("/user/dashboard", auth, userController.dashboard);

module.exports = router;
