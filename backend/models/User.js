const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      text: true,
    },
    last_name: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      text: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    picture: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
    },
    cover: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "email is required"],
      trim: true,
    },
    bYear: {
      type: Number,
      required: true,
      trim: true,
    },
    bMonth: {
      type: Number,
      required: true,
      trim: true,
    },
    bDay: {
      type: Number,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    requests: {
      type: Array,
      default: [],
    },
    search: [{ user: { type: mongoose.Schema.ObjectId, ref: "User" } }],
    details: {
      bio: { type: String },
      otherName: { type: String },
      job: { type: String },
      workplace: { type: String },
      highSchool: { type: String },
      college: { type: String },
      currentCity: { type: String },
      hometown: { type: String },
      relationsip: {
        type: String,
        enum: ["Single", "In a relationship", "Married", "Divorced"],
      },
      instagram: { type: String },
    },
    savedPosts: [
      {
        posts: { type: mongoose.Schema.ObjectId, ref: "Post" },
        savedAt: { type: Date, default: new Date() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
