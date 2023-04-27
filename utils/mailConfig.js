const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const UserModel = require("../models/userSchema");
const User = require("../models/userSchema");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "vickie41@ethereal.email",
    pass: "jUrtv2TcsDmQJBDpeC",
  },
});

const sendEmailForForgotPassword = async (email) => {
  let otp;
  try {
    console.log(email);
    let user = await User.findOne({ email });
    if (!user) {
      return "User not found";
    }
    otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();
  } catch (error) {
    console.log(error + " error at sendEmailForForgotPassword");
    return error.message;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for password reset",
      html: `<h1>OTP is ${otp}</h1>`,
    });
    console.log("Email sent successfully");
    return "Email sent successfully";
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

module.exports = {
  sendEmailForForgotPassword,
};
