const User = require("../models/userSchema");
const File = require("../models/fileSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const BlacklistedToken = require("../models/blacklistedToken");
const { sendEmailForForgotPassword } = require("../utils/mailConfig");
dotenv.config();

exports.login = async (req, res) => {
  try {
    if (req.token) {
      //check if token is blacklisted
      const blacklistedToken = await BlacklistedToken.findOne({
        token: req.token,
      });
      if (blacklistedToken) {
        return res.status(401).json({ message: "You are logged out" });
      }
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user) {
      res.status(401).json({ message: "Invalid email}" });
    } else if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
    } else {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
      });
      let userObj = user.toObject();
      userObj.token = token;
      delete userObj.password;
      res.status(200).json(userObj);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email} = req.body;
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = name;
      user.email = email;
      await user.save();
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.dashboard = async (req, res) => {
  try {
    console.log(req.user);
    // count for videos, images and files of the user
    const videoCount = await File.countDocuments({
      user: req.user._id,
      typeFile: "video",
    });
    const imageCount = await File.countDocuments({
      user: req.user._id,
      typeFile: "image",
    });
    const audioCount = await File.countDocuments({
      user: req.user._id,
      typeFile: "audio",
    });
    const fileCount = await File.countDocuments({
      user: req.user._id,
      typeFile: "file",
    });
    res.status(200).json({ videoCount, imageCount, audioCount, fileCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  // call sendEmailForForgotPassword function
  try {
    const email = req.body.email;
    console.log(email + "email");
    if(!email){
      res.status(404).json({ message: "Email not found" });
    }
    const response = await sendEmailForForgotPassword(email);
    if (response === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else if (response === "Email not sent") {
      res.status(500).json({ message: "Email not sent" });
    } else {
      res.status(200).json({ message: "Email sent successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (user.otp == otp) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.otp = null;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
      } else {
        res.status(401).json({ message: "Invalid OTP" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.token = null;
    const blacklistedToken = new BlacklistedToken({ token: req.token });
    await blacklistedToken.save();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
