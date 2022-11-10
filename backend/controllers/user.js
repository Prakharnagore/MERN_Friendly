const User = require("../models/User.js");
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token.js");
const { sendVerificationEmail } = require("../helpers/mailer.js");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const check = await User.findOne({ email });

    if (check) {
      return res
        .status(400)
        .json({ message: "This email address already exists" });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "firstname must atleast 3 character",
      });
    }

    if (!validateLength(last_name, 3, 30)) {
      console.log("lastname");
      return res.status(400).json({
        message: "lastname must atleast 3 character",
      });
    }

    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "password must atleast 6 character",
      });
    }

    const cyptedPassword = await bcrypt.hash(password, 12);
    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);

    const user = await User({
      first_name,
      last_name,
      email,
      username: newUsername,
      password: cyptedPassword,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    const emailVerficationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );

    const url = `${process.env.BASE_URL}/activate/${emailVerficationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "Register Success ! Please activate your email to start",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (check.verified === true) {
      return res
        .status(400)
        .json({ message: "this email is already activated" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: "Account has been activated successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message:
          "The email address you entered is not connected to an account ",
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials. Please try again",
      });
    }

    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "Login Success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, activateAccount, login };
