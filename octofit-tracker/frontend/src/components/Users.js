import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  useEffect(() => {
    console.log('Users: fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Users: fetched data:', data);
        setUsers(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Users: error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>👤 Users</h2></div>
          <div className="card-body text-center py-5">
            <div className="spinner-border octofit-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading users…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>👤 Users</h2></div>
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
          <h2>👤 Users</h2>
          <span className="badge bg-light text-dark">{users.length} user{users.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body p-0">
          {users.length === 0 ? (
            <div className="octofit-empty">
              <div className="empty-icon">👤</div>
              <p>No users found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id || user.id || index}>
                      <td className="text-muted">{index + 1}</td>
                      <td><span className="fw-semibold">{user.username || 'N/A'}</span></td>
                      <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email || 'N/A'}</a></td>
                      <td>{user.age ? <span className="badge bg-secondary">{user.age}</span> : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
