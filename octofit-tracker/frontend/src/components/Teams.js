import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    console.log('Teams: fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Teams: fetched data:', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>👥 Teams</h2></div>
          <div className="card-body text-center py-5">
            <div className="spinner-border octofit-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading teams…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>👥 Teams</h2></div>
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
          <h2>👥 Teams</h2>
          <span className="badge bg-light text-dark">{teams.length} team{teams.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body p-0">
          {teams.length === 0 ? (
            <div className="octofit-empty">
              <div className="empty-icon">👥</div>
              <p>No teams found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Members</th>
                    <th>Member Count</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => {
                    const members = Array.isArray(team.members) ? team.members : [];
                    return (
                      <tr key={team._id || team.id || index}>
                        <td><span className="fw-semibold">{team.name || 'N/A'}</span></td>
                        <td>
                          {members.length > 0
                            ? members.map((m, i) => {
                                const label =
                                  m && typeof m === 'object'
                                    ? m.username || m.email || String(m._id) || 'Member'
                                    : String(m);
                                return <span key={i} className="badge bg-secondary me-1">{label}</span>;
                              })
                            : <span className="text-muted">No members</span>}
                        </td>
                        <td><span className="badge bg-info text-dark">{members.length}</span></td>
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

export default Teams;
