const User = require("../models/User.js");
const Code = require("../models/Code.js");
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token.js");
const {
  sendVerificationEmail,
  sendResetCode,
} = require("../helpers/mailer.js");
const generateCode = require("../helpers/generateCode");
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
  const validUser = req.user.id;
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (validUser != user.id) {
      return res.status(400).json({
        message: "You don't have the authorization to complete this operation",
      });
    }
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

const auth = (req, res) => {
  res.send(req.user);
};

const sendVerification = async (req, res) => {
  console.log(req.user);
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res.status(400).json({
        message: "This account is already activated.",
      });
    }
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.status(200).json({
      message: "Email verification link has been sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "Account does not exists.",
      });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedCode = await Code({
      code,
      user: user._id,
    }).save();
    sendResetCode(user.email, user.first_name, code);
    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { email, password } = req.body;

  const cryptedPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    {
      password: cryptedPassword,
    }
  );
  return res.status(200).json({ message: "ok" });
};

module.exports = {
  validateResetCode,
  changePassword,
  register,
  activateAccount,
  login,
  auth,
  sendVerification,
  findUser,
  sendResetPasswordCode,
};
