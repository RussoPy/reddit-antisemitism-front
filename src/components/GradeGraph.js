import React from "react";

function getGradeBuckets(users) {
  // Buckets: 0.0-0.1, 0.1-0.2, ..., 0.9-1.0
  const buckets = Array(10).fill(0);
  users.forEach(u => {
    if (typeof u.hate_score === "number") {
      let idx = Math.floor(u.hate_score * 10);
      if (idx > 9) idx = 9;
      if (idx < 0) idx = 0;
      buckets[idx]++;
    }
  });
  return buckets;
}

const colors = [
  '#e0e0e0', '#f7b267', '#ff6f61', '#2a5298', '#1e3c72', '#414345', '#232526', '#8e44ad', '#27ae60', '#c0392b'
];

export default function GradeGraph({ users }) {
  const buckets = getGradeBuckets(users);
  return (
    <React.Fragment>
      <h2 style={{ color: '#ff6f61', fontWeight: 700, fontSize: '2rem', marginTop: 80, marginBottom: 60, textAlign: 'center' }}>Flagged Users by Hate Score</h2>
      <div style={{ padding: 32, textAlign: 'center', marginBottom: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, height: 80 }}>
          {(() => {
            const maxCount = Math.max(...buckets.slice(5));
            const maxBarHeight = 48; // px
            return buckets.slice(5).map((count, i) => (
              <div key={i+5} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 36,
                  height: Math.max(8, (count / (maxCount || 1)) * maxBarHeight),
                  background: colors[i+5],
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
                  marginBottom: 8,
                  transition: 'height 0.3s',
                }}></div>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>{((i+5)/10).toFixed(1)}</span>
                <span style={{ color: '#f7b267', fontWeight: 500, fontSize: '1rem' }}>{count}</span>
              </div>
            ));
          })()}
        </div>
        <p style={{ color: '#f7b267', fontSize: '1.15rem', marginTop: 32 }}>
          This graph shows the number of flagged users for each hate score value (0.5 to 1.0).
        </p>
      </div>
    </React.Fragment>
  );
}
