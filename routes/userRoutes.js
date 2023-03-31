const express = require("express");
const router = express.Router();
const userController = require("../controllers/userContoller");
const auth = require("../middleware/auth");

const { login, register } = require("../controllers/userContoller");

router.post("/register", register);
router.post("/login", login);
router.get("/", auth, userController.getUsers);
router.get("/:id", auth, userController.getUser);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
