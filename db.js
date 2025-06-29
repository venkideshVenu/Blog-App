const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const objectId = mongoose.ObjectId;

const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
});

const blogSchema = new Schema({
  title: String,
  content: String,
  userId: objectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model("users", userSchema);
const blogModel = mongoose.model("blogs", blogSchema);

module.exports = {
  UserModel: userModel,
  BlogModel: blogModel,
};
