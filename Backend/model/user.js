const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  avatar: String,
  nativeLanguage: String,
  language: String,
  goals: String,
  proficiency: String,
  otp: String,
  otpExpiry: Date,
});

module.exports = mongoose.model('User', userSchema);
