import React from "react";

const keywords = ["kike", "jew", "israel"];
const colors = ["#ff6f61", "#2a5298", "#f7b267"];

function countPostsWithKeywords(users) {
  // Count posts in flagged_post_text and history.text
  const counts = keywords.map(() => 0);
  users.forEach(user => {
    // Check flagged_post_text
    if (user.flagged_post_text) {
      keywords.forEach((kw, i) => {
        if (user.flagged_post_text.toLowerCase().includes(kw)) counts[i]++;
      });
    }
    // Check history
    if (Array.isArray(user.history)) {
      user.history.forEach(post => {
        if (post.text) {
          keywords.forEach((kw, i) => {
            if (post.text.toLowerCase().includes(kw)) counts[i]++;
          });
        }
      });
    }
  });
  return counts;
}

export default function KeywordPostGraph({ users }) {
  const counts = countPostsWithKeywords(users);
  return (
    <div style={{ padding: 32, textAlign: 'center', marginTop: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 32, height: 60 }}>
        {keywords.map((kw, i) => (
          <div key={kw} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 48,
              height: Math.max(10, counts[i] * 8),
              background: colors[i],
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              marginBottom: 8,
              transition: 'height 0.3s',
            }}></div>
            <span style={{ color: colors[i], fontWeight: 700, fontSize: '1.1rem' }}>{kw}</span>
            <span style={{ color: '#f7b267', fontWeight: 500, fontSize: '1rem' }}>{counts[i]}</span>
          </div>
        ))}
      </div>
      <p style={{ color: '#f7b267', fontSize: '1.05rem', marginTop: 24 }}>
        This graph shows the number of posts containing the words <strong>kike</strong>, <strong>jew</strong>, or <strong>israel</strong> in flagged posts and user history.
      </p>
    </div>
  );
}
