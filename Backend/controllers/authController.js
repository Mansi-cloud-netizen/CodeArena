const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/mailer');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, language, goals, proficiency } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      phone,
      password: hash,
      language,
      goals,
      proficiency,
      avatar: req.file ? req.file.path : null
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
  if (!user) return res.status(404).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();

  await sendOTPEmail(email, otp);
  res.json({ message: "OTP sent" });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || Date.now() > user.otpExpiry)
    return res.status(400).json({ error: "Invalid or expired OTP" });

  console.log("Request OTP:", otp);
console.log("Stored OTP:", user.otp);
console.log("Expiry time:", user.otpExpiry, "Now:", Date.now());

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};
