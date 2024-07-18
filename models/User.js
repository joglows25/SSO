// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fid: String,
  name: String,
  email: String,
  picture: String,
  isProfessional: Boolean,
  followers: Number,
  reach: Number,
  likes: Number,
});

module.exports = mongoose.model('User', userSchema);
