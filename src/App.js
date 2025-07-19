import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import FlaggedUserCard from "./components/FlaggedUserCard";
import GradeGraph from "./components/GradeGraph";
import KeywordPostGraph from "./components/KeywordPostGraph";


function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0.7);
  const [maxScore, setMaxScore] = useState(1.0);
  const [tab, setTab] = useState('users');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    async function fetchFlaggedUsers() {
      const querySnapshot = await getDocs(collection(db, "flagged_users"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
      setLoading(false);
    }
    fetchFlaggedUsers();
  }, []);
  const fetchFlaggedUsers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "flagged_users"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
      color: '#f4f4f4',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      letterSpacing: '0.5px',
    }}>
      <header style={{
        background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
        color: '#fff',
        padding: '32px 0 24px 0',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(30,60,114,0.15)',
        borderBottom: '4px solid #ff6f61',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center' }}>
          <svg width="120" height="120" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4L8 10v10c0 11.05 7.19 21.13 16 24 8.81-2.87 16-12.95 16-24V10L24 4z" fill="#ff6f61" stroke="#2a5298" strokeWidth="2"/>
            <path d="M24 14v14" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="24" cy="32" r="2.5" fill="#fff"/>
          </svg>
        </div>
        <h1 style={{
          margin: 0,
          fontSize: '3rem',
          fontWeight: 700,
          letterSpacing: '3px',
          textShadow: '2px 2px 8px rgba(0,0,0,0.15)',
        }}>
          <span style={{ color: '#ff6f61' }}>Flagged</span> Reddit Users
        </h1>
        <nav style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 32 }}>
          <button
            onClick={() => setTab('graph')}
            style={{
              background: tab === 'graph' ? '#ff6f61' : 'rgba(44,62,80,0.85)',
              color: tab === 'graph' ? '#fff' : '#ff6f61',
              border: 'none',
              borderRadius: 8,
              padding: '10px 32px',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: tab === 'graph' ? '0 2px 8px rgba(255,111,97,0.10)' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >Graph</button>
          <button
            onClick={() => setTab('users')}
            style={{
              background: tab === 'users' ? '#ff6f61' : 'rgba(44,62,80,0.85)',
              color: tab === 'users' ? '#fff' : '#ff6f61',
              border: 'none',
              borderRadius: 8,
              padding: '10px 32px',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: tab === 'users' ? '0 2px 8px rgba(255,111,97,0.10)' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >Flagged Users</button>
        </nav>
        <div style={{
          position: 'absolute',
          right: 32,
          top: 32,
          fontSize: '1.1rem',
          fontWeight: 500,
          color: '#fff',
          opacity: 0.7,
        }}>
          <span style={{ background: '#ff6f61', borderRadius: 8, padding: '4px 12px', color: '#fff' }}>AI Moderation Dashboard</span>
        </div>
      </header>
      <main style={{
        flex: 1,
        padding: '48px 0',
        maxWidth: 1000,
        margin: '0 auto',
        width: '100%',
        background: 'rgba(44, 62, 80, 0.85)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
        marginTop: 32,
        marginBottom: 32,
      }}>
        {tab === 'graph' ? (
          <React.Fragment>
            <GradeGraph users={users} />
            <KeywordPostGraph users={users} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              <h2 style={{ color: '#ff6f61', fontWeight: 700, fontSize: '2rem', marginBottom: 8 }}>
                Flagged Users: {loading ? '...' : users.length}
                {(!loading && users.length > 0) && (
                  <span style={{ color: '#f7b267', fontWeight: 600, fontSize: '1.2rem', marginLeft: 8 }}>
                    ({users.filter(user =>
                      user.hate_score >= minScore &&
                      user.hate_score <= maxScore &&
                      user.author.toLowerCase().includes(search.toLowerCase())
                    ).length})
                  </span>
                )}
              </h2>
              <p style={{ color: '#f7b267', fontSize: '1.15rem', maxWidth: 700, margin: '0 auto' }}>
                This dashboard presents <strong>all flagged Reddit users with a hate score above 0.7</strong>, as detected by AI moderation for potentially hateful content. Click a user card to view flagged post details, notes, and recent history. All data is read-only and sourced from Firestore.
              </p>
              <button
                onClick={fetchFlaggedUsers}
                style={{
                  marginTop: 16,
                  padding: '10px 28px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #ff6f61 0%, #f7b267 100%)',
                  color: '#232526',
                  border: 'none',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(255,111,97,0.10)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  marginRight: 16,
                }}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => {
                  setScanning(true);
                  fetch('https://reddit-antisemitism-script.onrender.com/run', { method: 'POST' })
                    .then(res => {
                      if (!res.ok) {
                        setScanning(false);
                        // Removed alert
                      }
                    })
                    .catch(() => {
                      setScanning(false);
                      // Removed alert
                    });
                }}
                style={{
                  marginTop: 16,
                  padding: '10px 28px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #ff6f61 0%, #f7b267 100%)',
                  color: '#232526',
                  border: 'none',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(255,111,97,0.10)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Search More
              </button>
              {scanning && (
                <div style={{
                  marginTop: 24,
                  background: 'linear-gradient(90deg, #f7b267 0%, #ff6f61 100%)',
                  color: '#232526',
                  borderRadius: 12,
                  padding: '18px 32px',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  boxShadow: '0 2px 12px rgba(255,111,97,0.10)',
                  textAlign: 'center',
                  letterSpacing: '1px',
                  maxWidth: 400,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  border: '2px solid #ff6f61',
                  position: 'relative',
                }}>
                  <button
                    onClick={() => setScanning(false)}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 12,
                      background: 'none',
                      border: 'none',
                      color: '#232526',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      opacity: 0.7,
                    }}
                    aria-label="Close"
                  >×</button>
                  <span role="img" aria-label="scan" style={{ marginRight: 12 }}>🔎</span>
                  Started scanning flagged users...
                </div>
              )}
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: '10px 16px',
                    fontSize: '1rem',
                    borderRadius: 8,
                    border: '1px solid #ff6f61',
                    outline: 'none',
                    width: 220,
                    marginRight: 8,
                    background: 'rgba(44,62,80,0.85)',
                    color: '#ff6f61',
                  }}
                />
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={minScore}
                  onChange={e => {
                    let val = Math.round(Number(e.target.value) * 10) / 10;
                    if (val < 0) val = 0;
                    if (val > maxScore) val = maxScore;
                    setMinScore(val);
                  }}
                  style={{
                    padding: '10px 16px',
                    fontSize: '1rem',
                    borderRadius: 8,
                    border: '1px solid #ff6f61',
                    outline: 'none',
                    width: 120,
                    background: 'rgba(44,62,80,0.85)',
                    color: '#ff6f61',
                  }}
                />
                <span style={{ color: '#ff6f61', fontWeight: 600, fontSize: '1rem', alignSelf: 'center' }}>
                  Min Hate Score
                </span>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={maxScore}
                  onChange={e => {
                    let val = Math.round(Number(e.target.value) * 10) / 10;
                    if (val > 1) val = 1;
                    if (val < minScore) val = minScore;
                    setMaxScore(val);
                  }}
                  style={{
                    padding: '10px 16px',
                    fontSize: '1rem',
                    borderRadius: 8,
                    border: '1px solid #ff6f61',
                    outline: 'none',
                    width: 120,
                    background: 'rgba(44,62,80,0.85)',
                    color: '#ff6f61',
                  }}
                />
                <span style={{ color: '#ff6f61', fontWeight: 600, fontSize: '1rem', alignSelf: 'center' }}>
                  Max Hate Score
                </span>
                <button
                  onClick={() => {
                    // Filter users as shown
                    const filtered = users
                      .filter(user =>
                        user.hate_score >= minScore &&
                        user.hate_score <= maxScore &&
                        user.author.toLowerCase().includes(search.toLowerCase())
                      );
                    // Prepare CSV header with history fields
                    const historyFields = ['id', 'title', 'text', 'created_utc', 'url', 'permalink', 'subreddit', 'hate_score'];
                    const maxHistory = Math.max(...filtered.map(u => u.history ? u.history.length : 0));
                    const header = [
                      'author', 'flagged_post_id', 'flagged_post_permalink', 'flagged_post_title', 'flagged_post_text', 'hate_score', 'explanation', 'notes',
                      ...Array.from({length: maxHistory}, (_, i) => historyFields.map(f => `history_${i+1}_${f}`)).flat()
                    ];
                    // Prepare CSV rows
                    const rows = filtered.map(user => {
                      const base = [
                        user.author,
                        user.flagged_post_id,
                        user.flagged_post_permalink,
                        user.flagged_post_title,
                        user.flagged_post_text,
                        user.hate_score,
                        user.explanation,
                        user.notes ? user.notes.join('; ') : ''
                      ];
                      // Flatten history
                      const history = [];
                      if (user.history) {
                        for (let i = 0; i < maxHistory; i++) {
                          const h = user.history[i] || {};
                          historyFields.forEach(f => history.push(h[f] !== undefined ? h[f] : ''));
                        }
                      } else {
                        for (let i = 0; i < maxHistory * historyFields.length; i++) history.push('');
                      }
                      return [...base, ...history];
                    });
                    // Convert to CSV string
                    const csvContent = [header.join(','), ...rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(','))].join('\n');
                    // Download
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'flagged_users.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  style={{
                    marginLeft: 16,
                    padding: '10px 24px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #2a5298 0%, #ff6f61 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  Download CSV
                </button>
              </div>
            </div>
            {loading ? (
              <p style={{ color: '#ff6f61', fontSize: '1.5rem', textAlign: 'center', marginTop: 64 }}>Loading flagged users...</p>
            ) : (
              users.length === 0 ? (
                <p style={{ color: '#ff6f61', fontSize: '1.5rem', textAlign: 'center', marginTop: 64 }}>No flagged users found.</p>
              ) : (
                users
                  .filter(user =>
                    user.hate_score >= minScore &&
                    user.hate_score <= maxScore &&
                    user.author.toLowerCase().includes(search.toLowerCase())
                  )
                  .sort((a, b) => ((b.flagged_post_created_utc || 0) - (a.flagged_post_created_utc || 0)))
                  .map(user => <FlaggedUserCard key={user.id} user={user} />)
              )
            )}
          </React.Fragment>
        )}
      </main>
      <footer style={{
        background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
        color: '#fff',
        textAlign: 'center',
        padding: '24px 0',
        fontSize: '1.15rem',
        letterSpacing: '1.5px',
        borderTop: '4px solid #ff6f61',
        boxShadow: '0 -4px 16px rgba(30,60,114,0.10)',
      }}>
        &copy; {new Date().getFullYear()} <span style={{ color: '#ff6f61', fontWeight: 600 }}>Reddit Extract</span> | Flagged Users Viewer
      </footer>
    </div>
  );
}

export default App;
