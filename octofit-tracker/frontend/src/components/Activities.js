import React, { useState, useEffect } from 'react';

function formatDate(raw) {
  if (!raw) return 'N/A';
  // Handle MongoDB $date objects: { "$date": "..." }
  const value = raw && typeof raw === 'object' && raw.$date ? raw.$date : raw;
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(raw);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  useEffect(() => {
    console.log('Activities: fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Activities: fetched data:', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>🏃 Activities</h2></div>
          <div className="card-body text-center py-5">
            <div className="spinner-border octofit-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading activities…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>🏃 Activities</h2></div>
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
          <h2>🏃 Activities</h2>
          <span className="badge bg-light text-dark">{activities.length} record{activities.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body p-0">
          {activities.length === 0 ? (
            <div className="octofit-empty">
              <div className="empty-icon">🏃</div>
              <p>No activities found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Activity Type</th>
                    <th>Duration (min)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => {
                    const user = activity.user;
                    const username =
                      user && typeof user === 'object'
                        ? user.name || user.username || user.email || String(user._id) || 'N/A'
                        : user || activity.name || activity.username || 'N/A';
                    return (
                      <tr key={activity._id || activity.id || index}>
                        <td><span className="fw-semibold">{username}</span></td>
                        <td><span className="badge bg-primary">{activity.activity_type || activity.type || 'N/A'}</span></td>
                        <td>{activity.duration || 'N/A'}</td>
                        <td>{formatDate(activity.date)}</td>
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

export default Activities;
