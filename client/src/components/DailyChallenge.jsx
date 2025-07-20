import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DailyChallenge = ({ userId }) => {
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [freezeUsed, setFreezeUsed] = useState(false);

  useEffect(() => {
    axios.post('/api/dailyChallenge/generate', { userId }).then(res => {
      setChallenge(res.data);
      setCompleted(res.data.completed);
    });
  }, []);

  const completeChallenge = () => {
    axios.post('/api/dailyChallenge/complete', { userId }).then(res => {
      setCompleted(true);
      setFeedback(`+10 XP 🔥 Streak: ${res.data.streak}`);
    });
  };

  const freezeStreak = () => {
    axios.post('/api/dailyChallenge/freeze', { userId })
      .then(res => {
        setFreezeUsed(true);
        setFeedback(res.data.message);
      }).catch(err => {
        setFeedback(err.response.data.message);
      });
  };

  if (!challenge) return <div>Loading your daily challenge...</div>;

  return (
    <div className="p-4 rounded-xl bg-white shadow-xl max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-2">🔥 Daily Challenge</h2>
      <p className="mb-4">{challenge.prompt}</p>

      {!completed ? (
        <button onClick={completeChallenge} className="px-4 py-2 bg-green-600 text-white rounded-xl">
          Mark as Completed
        </button>
      ) : (
        <p className="text-green-600 font-semibold">Challenge Completed ✅</p>
      )}

      <div className="mt-3">
        {!freezeUsed && (
          <button onClick={freezeStreak} className="px-3 py-1 bg-blue-500 text-white rounded">
            Use Freeze Token 🧊
          </button>
        )}
      </div>

      {feedback && <p className="mt-3 text-sm text-gray-700">{feedback}</p>}
    </div>
  );
};

export default DailyChallenge;
