import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers]   = useState([]);
  const [teams, setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Edit modal state
  const [editUser, setEditUser]     = useState(null);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const usersUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
  const teamsUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  // ── Fetch users + teams in parallel ──────────────────────────────────────
  useEffect(() => {
    console.log('Users: fetching from REST API endpoint:', usersUrl);
    Promise.all([
      fetch(usersUrl, { headers: { Accept: 'application/json' } }).then(r => r.json()),
      fetch(teamsUrl, { headers: { Accept: 'application/json' } }).then(r => r.json()),
    ])
      .then(([uData, tData]) => {
        console.log('Users: fetched data:', uData);
        console.log('Teams for dropdown:', tData);
        setUsers(Array.isArray(uData) ? uData : uData.results || []);
        setTeams(Array.isArray(tData) ? tData : tData.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Users: error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [usersUrl, teamsUrl]);

  // ── Derive current team for a user ───────────────────────────────────────
  function getUserTeam(user) {
    const uid = user._id;
    return teams.find(t =>
      Array.isArray(t.members) &&
      t.members.some(m => (m && typeof m === 'object' ? m._id : m) === uid)
    );
  }

  // ── Open edit modal ───────────────────────────────────────────────────────
  function openEdit(user) {
    const currentTeam = getUserTeam(user);
    setEditUser({
      _id:      user._id,
      name:     user.name ?? '',
      username: user.username ?? '',
      email:    user.email ?? '',
      age:      user.age ?? '',
      team_id:  currentTeam ? currentTeam.team_id ?? '' : '',
    });
    setSaveError(null);
    setSaveSuccess(false);
  }

  function closeEdit() { setEditUser(null); }

  function handleField(e) {
    setEditUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ── Save changes ──────────────────────────────────────────────────────────
  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    console.log('Users: PATCH', `${usersUrl}${editUser._id}/`, editUser);

    fetch(`${usersUrl}${editUser._id}/`, {
      method: 'PATCH',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     editUser.name,
        username: editUser.username,
        email:    editUser.email,
        age:      editUser.age,
        team_id:  editUser.team_id !== '' ? editUser.team_id : null,
      }),
    })
      .then(res => {
        if (!res.ok) return res.json().then(d => { throw new Error(JSON.stringify(d)); });
        return res.json();
      })
      .then(updated => {
        console.log('Users: updated user:', updated);
        // Refresh users list
        return fetch(usersUrl, { headers: { Accept: 'application/json' } })
          .then(r => r.json())
          .then(uData => {
            setUsers(Array.isArray(uData) ? uData : uData.results || []);
          });
      })
      .then(() => {
        // Also refresh teams so member counts update
        return fetch(teamsUrl, { headers: { Accept: 'application/json' } })
          .then(r => r.json())
          .then(tData => setTeams(Array.isArray(tData) ? tData : tData.results || []));
      })
      .then(() => {
        setSaving(false);
        setSaveSuccess(true);
        setTimeout(closeEdit, 900);
      })
      .catch(err => {
        console.error('Users: save error:', err);
        setSaveError(err.message);
        setSaving(false);
      });
  }

  // ── Render ────────────────────────────────────────────────────────────────
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
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Team</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const team = getUserTeam(user);
                    return (
                      <tr key={user._id || user.id || index}>
                        <td className="text-muted">{index + 1}</td>
                        <td><span className="fw-semibold">{user.name || 'N/A'}</span></td>
                        <td>{user.username || 'N/A'}</td>
                        <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email || 'N/A'}</a></td>
                        <td>{user.age ? <span className="badge bg-secondary">{user.age}</span> : 'N/A'}</td>
                        <td>{team ? <span className="badge bg-primary">{team.name}</span> : 'N/A'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEdit(user)}
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(90deg,#0d1b2a,#1b4965)', color: '#fff' }}>
                <h5 className="modal-title">✏️ Edit User</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeEdit}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {saveError && (
                    <div className="alert alert-danger py-2">⚠️ {saveError}</div>
                  )}
                  {saveSuccess && (
                    <div className="alert alert-success py-2">✅ Saved successfully!</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input className="form-control" name="name" value={editUser.name}
                      onChange={handleField} placeholder="Full name" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input className="form-control" name="username" value={editUser.username}
                      onChange={handleField} placeholder="Username" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input className="form-control" type="email" name="email" value={editUser.email}
                      onChange={handleField} placeholder="Email address" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Age</label>
                    <input className="form-control" type="number" name="age" value={editUser.age}
                      onChange={handleField} placeholder="Age" min="1" max="120" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Team</label>
                    <select className="form-select" name="team_id" value={editUser.team_id}
                      onChange={handleField}>
                      <option value="">— No team —</option>
                      {teams.map(t => (
                        <option key={t._id} value={t.team_id ?? t._id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeEdit}
                    disabled={saving}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                    ) : '💾 Save changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
