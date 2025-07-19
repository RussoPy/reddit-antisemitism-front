import React from "react";
import HateScoreOverTimeGraph from "./HateScoreOverTimeGraph";
import HateScoreVsKeywordGraph from "./HateScoreVsKeywordGraph";

const keywords = ["kike", "jew", "israel","jews", "zionist", "holocaust", "antisemitic",
    "rothschild", 
  ];
// Generate a color palette for any number of keywords
function getColor(idx) {
  const palette = [
    "#ff6f61", "#2a5298", "#f7b267", "#6fcf97", "#9b51e0", "#e0a800", "#eb5757", "#56ccf2", "#bb6bd9", "#27ae60", "#f2994a", "#2d9cdb"
  ];
  return palette[idx % palette.length];
}

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
  // Find the max count for scaling
  const maxCount = Math.max(...counts, 1);
  return (
    <div style={{ padding: 32, textAlign: 'center', marginTop: 700 }}>
      <h2 style={{ color: '#ff6f61', fontWeight: 700, marginBottom: 32 }}>
        Flagged Posts by Keyword
      </h2>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 40,
        height: 220,
        flexWrap: 'wrap',
        marginBottom: 24,
        width: '100%',
        maxWidth: 1200,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {keywords.map((kw, i) => (
          <div key={kw} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
            <div style={{
              width: 60,
              height: Math.max(18, (counts[i] / maxCount) * 90),
              background: getColor(i),
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
              marginBottom: 12,
              transition: 'height 0.3s',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}></div>
            <span style={{ color: '#f7b267', fontWeight: 700, fontSize: '1.15rem', marginBottom: 4 }}>{i + 1}</span>
            <span style={{ color: getColor(i), fontWeight: 700, fontSize: '1.15rem', wordBreak: 'break-word', textAlign: 'center' }}>{kw}</span>
            <span style={{ color: '#f7b267', fontWeight: 500, fontSize: '1.1rem' }}>{counts[i]}</span>
          </div>
        ))}
      </div>
      <hr style={{
        border: 'none',
        borderTop: '2px solid #f7b267',
        margin: '32px auto 24px auto',
        width: '60%',
        opacity: 0.5
      }} />
      <p style={{ color: '#f7b267', fontSize: '1.05rem', marginTop: 0 }}>
        This graph shows the number of posts containing the following keywords in flagged posts and user history:<br />
        <span style={{ color: '#ff6f61', fontWeight: 600 }}>
          {keywords.map((kw, i) => (
            <span key={kw} style={{ marginRight: 8 }}>{kw}{i < keywords.length - 1 ? ',' : ''}</span>
          ))}
        </span>
      </p>

      {/* Additional graphs below */}
      <HateScoreOverTimeGraph users={users} />
      <HateScoreVsKeywordGraph users={users} />
    </div>
  );
}
