
import React, { useState } from "react";

function FlaggedUserCard({ user }) {
  const [open, setOpen] = useState(false);

  // Calculate upload time and 'new' status using upload_date (ISO string)
  const uploadTime = user.upload_date ? new Date(user.upload_date) : null;
  const now = new Date();
  const isNew = uploadTime && ((now - uploadTime) < 30 * 60 * 1000);

  return (
    <div
      style={{
        background: open ? 'linear-gradient(120deg, #ff6f61 0%, #f7b267 100%)' : 'linear-gradient(120deg, #232526 0%, #414345 100%)',
        color: open ? '#232526' : '#f4f4f4',
        borderRadius: 16,
        marginBottom: 32,
        boxShadow: open ? '0 8px 32px rgba(255,111,97,0.18)' : '0 4px 16px rgba(44,62,80,0.18)',
        padding: open ? 32 : 20,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        border: open ? '2px solid #ff6f61' : '2px solid #414345',
        position: 'relative',
      }}
      onClick={() => setOpen(v => !v)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>{user.author}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <span style={{ fontSize: '1rem', color: '#f7b267', fontWeight: 500 }}>
              Uploaded: {uploadTime ? uploadTime.toLocaleString() : '-'}
            </span>
            {isNew && (
              <span style={{
                background: '#ff6f61',
                color: '#fff',
                borderRadius: 6,
                padding: '2px 10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginLeft: 4,
                boxShadow: '0 2px 8px rgba(255,111,97,0.10)',
                letterSpacing: '1px',
              }}>NEW</span>
            )}
          </div>
        </div>
        <span style={{
          background: '#ff6f61',
          color: '#fff',
          borderRadius: 8,
          padding: '6px 18px',
          fontWeight: 600,
          fontSize: '1.2rem',
          boxShadow: '0 2px 8px rgba(255,111,97,0.10)',
        }}>Hate Score: {user.hate_score}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: '1.1rem', fontWeight: 500 }}>
        <span style={{ color: open ? '#232526' : '#ff6f61' }}>
          {user.explanation}
        </span>
      </div>

      {!open ? (
        <div style={{ position: 'absolute', right: 24, bottom: 18, fontSize: '1.1rem', color: open ? '#232526' : '#ff6f61', opacity: 0.7 }}>
          <span>Click to expand</span>
        </div>
      ) : (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ color: '#2d3e50', marginBottom: 8 }}>Flagged Post</h3>
          <p><strong>Title:</strong> {user.flagged_post_title}</p>
          <p><strong>Text:</strong> {user.flagged_post_text}</p>
          <p><strong>Permalink:</strong> <a href={user.flagged_post_permalink} target="_blank" rel="noopener noreferrer" style={{ color: '#2a5298' }}>{user.flagged_post_permalink}</a></p>
          <h4 style={{ color: '#2d3e50', marginTop: 24 }}>Notes</h4>
          <ul>
            {user.notes && user.notes.map((note, idx) => <li key={idx}>{note}</li>)}
          </ul>
          <h4 style={{ color: '#2d3e50', marginTop: 24 }}>History</h4>
          <ul>
            {user.history && [...user.history]
              .sort((a, b) => (b.created_utc || 0) - (a.created_utc || 0))
              .map((post, idx) => (
                <li key={post.id || idx} style={{ marginBottom: 12, background: '#f7b267', borderRadius: 8, padding: 12, color: '#232526', boxShadow: '0 2px 8px rgba(44,62,80,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{post.title}</strong> <span style={{ color: '#ff6f61' }}>({post.subreddit})</span>
                    <span style={{ fontSize: '0.95rem', color: '#2a5298', fontWeight: 500 }}>
                      {post.created_utc ? new Date(post.created_utc * 1000).toLocaleString() : '-'}
                    </span>
                  </div>
                  <span>{post.text ? post.text : '-'}</span><br />
                  <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2a5298' }}>Post Link</a> | <a href={post.permalink} target="_blank" rel="noopener noreferrer" style={{ color: '#2a5298' }}>Permalink</a><br />
                  {post.hate_score !== undefined && <span style={{ color: '#ff6f61', fontWeight: 600 }}>Hate Score: {post.hate_score}</span>}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FlaggedUserCard;
