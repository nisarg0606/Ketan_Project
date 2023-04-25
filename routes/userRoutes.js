const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
// localhost:5000/api/users and then the routes below
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", auth, userController.getUsers);
router.get("/:id", auth, userController.getUser);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);
router.get("/user/dashboard", auth, userController.dashboard);
router.post("/change-password", auth, userController.changePassword);
router.post("/logout", auth, userController.logout);

module.exports = router;
