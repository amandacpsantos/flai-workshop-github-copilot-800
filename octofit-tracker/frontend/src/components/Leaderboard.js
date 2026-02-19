import React, { useState, useEffect } from 'react';

function rankClass(index) {
  if (index === 0) return 'rank-badge rank-gold';
  if (index === 1) return 'rank-badge rank-silver';
  if (index === 2) return 'rank-badge rank-bronze';
  return 'rank-badge rank-other';
}

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard: fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Leaderboard: fetched data:', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>🏆 Leaderboard</h2></div>
          <div className="card-body text-center py-5">
            <div className="spinner-border octofit-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading leaderboard…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>🏆 Leaderboard</h2></div>
          <div className="card-body">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <span className="me-2">⚠️</span> {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="octofit-page-card card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>🏆 Leaderboard</h2>
          <span className="badge bg-warning text-dark">{entries.length} competitor{entries.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body p-0">
          {entries.length === 0 ? (
            <div className="octofit-empty">
              <div className="empty-icon">🏆</div>
              <p>No leaderboard entries found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{width: '80px'}}>Rank</th>
                    <th>Name</th>
                    <th>Team</th>
                    <th>Calories</th>
                    <th>Activities</th>
                    <th>Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => {
                    const displayName = entry.user_name ||
                      (entry.user && typeof entry.user === 'object'
                        ? entry.user.name || entry.user.username || 'N/A'
                        : entry.user || 'N/A');
                    return (
                      <tr key={entry._id || entry.id || index}>
                        <td><span className={rankClass((entry.rank || index + 1) - 1)}>{entry.rank || index + 1}</span></td>
                        <td><span className="fw-semibold">{displayName}</span></td>
                        <td><span className="badge bg-secondary">{entry.team || 'N/A'}</span></td>
                        <td><span className="badge bg-danger">{entry.total_calories ?? entry.score ?? 0}</span></td>
                        <td>{entry.total_activities ?? 'N/A'}</td>
                        <td>{entry.total_distance ?? 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
