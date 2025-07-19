import React from "react";

const keywords = ["kike", "jew", "israel", "jews", "zionist", "holocaust", "antisemitic", "rothschild"];
const colors = ["#ff6f61", "#2a5298", "#f7b267", "#6fcf97", "#9b51e0", "#e0a800", "#eb5757", "#56ccf2"];

// Helper: collect hate scores for each keyword
function getKeywordScores(users) {
  const scores = keywords.map(() => []);
  users.forEach(user => {
    // Main flagged post
    if (user.flagged_post_text && user.hate_score !== undefined) {
      keywords.forEach((kw, i) => {
        if (user.flagged_post_text.toLowerCase().includes(kw)) scores[i].push(user.hate_score);
      });
    }
    // History
    if (Array.isArray(user.history)) {
      user.history.forEach(post => {
        if (post.text && post.hate_score !== undefined) {
          keywords.forEach((kw, i) => {
            if (post.text.toLowerCase().includes(kw)) scores[i].push(post.hate_score);
          });
        }
      });
    }
  });
  return scores;
}

export default function HateScoreVsKeywordGraph({ users }) {
  const scores = getKeywordScores(users);
  // Calculate average hate score per keyword
  const avgScores = scores.map(arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
  const maxAvg = Math.max(...avgScores, 1);
  return (
    <div style={{ padding: 32, textAlign: 'center', marginTop: 48 }}>
      <h2 style={{ color: '#ff6f61', fontWeight: 700 }}>Average Hate Score by Keyword</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, height: 180, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap', maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        {keywords.map((kw, i) => (
          <div key={kw} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
            <div style={{
              width: 40,
              height: Math.max(12, (avgScores[i] / maxAvg) * 140),
              background: colors[i % colors.length],
              borderRadius: 8,
              marginBottom: 8,
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              transition: 'height 0.3s',
            }}></div>
            <span style={{ color: colors[i % colors.length], fontWeight: 700, fontSize: '1.05rem', wordBreak: 'break-word', textAlign: 'center' }}>{kw}</span>
            <span style={{ color: '#f7b267', fontWeight: 500, fontSize: '1rem' }}>{avgScores[i] ? avgScores[i].toFixed(2) : '-'}</span>
          </div>
        ))}
      </div>
      <hr style={{ border: 'none', borderTop: '2px solid #f7b267', margin: '32px auto 24px auto', width: '60%', opacity: 0.5 }} />
      <p style={{ color: '#f7b267', fontSize: '1.05rem', marginTop: 0 }}>
        This chart shows the average hate score for posts containing each keyword.
      </p>
    </div>
  );
}
