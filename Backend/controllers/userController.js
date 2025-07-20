const User = require('../model/user');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select('-password -otp');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  await User.findByIdAndUpdate(req.userId, updates);
  res.json({ message: "Profile updated" });
};

// controllers/userController.js
exports.getProgress = async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.progress);
};

exports.updateXP = async (req, res) => {
  const { xp } = req.body; // e.g., 10 XP for today
  const user = await User.findById(req.userId);

  const today = new Date().setHours(0, 0, 0, 0);
  const last = user.progress.lastActivity
    ? new Date(user.progress.lastActivity).setHours(0, 0, 0, 0)
    : null;

  // If this is a new day and not a repeated update
  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).setHours(0, 0, 0, 0);

    // if last activity was yesterday → increase streak
    if (last === yesterday) {
      user.progress.streak += 1;
    } else {
      user.progress.streak = 1;
    }

    user.progress.lastActivity = new Date(); // set to now
  }

  user.progress.totalXP += xp;

  // Badge logic (optional)
  const xpMilestones = [50, 100, 250, 500, 1000];
  const earnedBadges = xpMilestones.filter(
    (milestone) =>
      user.progress.totalXP >= milestone &&
      !user.progress.badges.includes(`XP ${milestone}`)
  );

  earnedBadges.forEach((badge) =>
    user.progress.badges.push(`XP ${badge}`)
  );

  await user.save();
  res.json({ message: "XP updated", progress: user.progress });
};
