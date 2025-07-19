import React from "react";

// Helper: group posts by day and calculate average hate score
function getDailyHateScores(users) {
  const dayScores = {};
  users.forEach(user => {
    // Main flagged post
    if (user.upload_date && user.hate_score !== undefined) {
      const day = new Date(user.upload_date).toISOString().slice(0, 10);
      if (!dayScores[day]) dayScores[day] = [];
      dayScores[day].push(user.hate_score);
    }
    // History
    if (Array.isArray(user.history)) {
      user.history.forEach(post => {
        if (post.created_utc && post.hate_score !== undefined) {
          const day = new Date(post.created_utc * 1000).toISOString().slice(0, 10);
          if (!dayScores[day]) dayScores[day] = [];
          dayScores[day].push(post.hate_score);
        }
      });
    }
  });
  // Convert to sorted array
  const days = Object.keys(dayScores).sort();
  return days.map(day => ({
    day,
    avg: dayScores[day].reduce((a, b) => a + b, 0) / dayScores[day].length,
    count: dayScores[day].length
  }));
}

export default function HateScoreOverTimeGraph({ users }) {
  const data = getDailyHateScores(users);
  if (data.length === 0) return null;
  const maxAvg = Math.max(...data.map(d => d.avg));
  return (
    <div style={{ padding: 32, textAlign: 'center', marginTop: 48 }}>
      <h2 style={{ color: '#ff6f61', fontWeight: 700 }}>Average Hate Score Over Time</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, justifyContent: 'center', marginTop: 32, overflowX: 'auto' }}>
        {data.map((d, i) => (
          <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
            <div style={{
              width: 24,
              height: Math.max(10, (d.avg / maxAvg) * 140),
              background: '#2a5298',
              borderRadius: 8,
              marginBottom: 8,
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              transition: 'height 0.3s',
            }}></div>
            <span style={{ color: '#ff6f61', fontWeight: 600, fontSize: '0.95rem' }}>{d.day.slice(5)}</span>
            <span style={{ color: '#f7b267', fontWeight: 500, fontSize: '0.95rem' }}>{d.avg.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <hr style={{ border: 'none', borderTop: '2px solid #f7b267', margin: '32px auto 24px auto', width: '60%', opacity: 0.5 }} />
      <p style={{ color: '#f7b267', fontSize: '1.05rem', marginTop: 0 }}>
        Each bar shows the average hate score for all flagged posts on that day.
      </p>
    </div>
  );
}
