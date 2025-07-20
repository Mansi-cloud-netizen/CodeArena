import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: Date,
  prompt: String,
  completed: { type: Boolean, default: false },
});

export default mongoose.model('DailyChallenge', dailyChallengeSchema);
