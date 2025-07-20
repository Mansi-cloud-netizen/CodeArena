import React, { useEffect, useState } from "react";
import axios from "../services/api";

const ProgressSnapshot = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    axios.get("/user/progress").then(res => setProgress(res.data));
  }, []);

  if (!progress) return <div>Loading progress...</div>;

  return (
    <div className="progress-card">
      <h2>Progress Snapshot</h2>
        <p>🔥 <strong>Streak:</strong> {progress.streak} day(s)</p>
  <p>⭐ <strong>Total XP:</strong> {progress.totalXP}</p>
  <p>🎯 <strong>Goal:</strong> {progress.dailyGoal} XP</p>
  <div>
    🏅 <strong>Badges:</strong>
    {progress.badges.map((b, i) => (
      <span key={i} className="badge">{b}</span>
    ))}
  </div>
    </div>
  );
};

export default ProgressSnapshot;
