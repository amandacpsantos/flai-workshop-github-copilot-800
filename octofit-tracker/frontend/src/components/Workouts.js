import React, { useState, useEffect } from 'react';

const difficultyBadge = {
  Beginner:     'bg-success',
  Intermediate: 'bg-warning text-dark',
  Advanced:     'bg-danger',
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Workouts: fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>💪 Workouts</h2></div>
          <div className="card-body text-center py-5">
            <div className="spinner-border octofit-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading workouts…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="octofit-page-card card">
          <div className="card-header"><h2>💪 Workouts</h2></div>
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
          <h2>💪 Workouts</h2>
          <span className="badge bg-light text-dark">{workouts.length} workout{workouts.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body p-0">
          {workouts.length === 0 ? (
            <div className="octofit-empty">
              <div className="empty-icon">💪</div>
              <p>No workouts found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Difficulty</th>
                    <th>Duration (min)</th>
                    <th>Exercises</th>
                    <th>Recommended For</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout, index) => (
                    <tr key={workout._id || workout.id || index}>
                      <td className="text-muted">{index + 1}</td>
                      <td><span className="fw-semibold">{workout.title || workout.name || 'N/A'}</span></td>
                      <td>{workout.description || 'N/A'}</td>
                      <td>
                        <span className={`badge ${difficultyBadge[workout.difficulty] || 'bg-secondary'}`}>
                          {workout.difficulty || 'N/A'}
                        </span>
                      </td>
                      <td>
                        {workout.duration
                          ? <span className="badge bg-info text-dark">{workout.duration} min</span>
                          : 'N/A'}
                      </td>
                      <td>
                        {Array.isArray(workout.exercises) && workout.exercises.length > 0 ? (
                          <ul className="mb-0 ps-3 small">
                            {workout.exercises.map((ex, i) => (
                              <li key={i}>{ex}</li>
                            ))}
                          </ul>
                        ) : 'N/A'}
                      </td>
                      <td>
                        {Array.isArray(workout.recommended_for) && workout.recommended_for.length > 0
                          ? workout.recommended_for.map((tag, i) => (
                              <span key={i} className="badge bg-primary me-1 mb-1">{tag}</span>
                            ))
                          : 'N/A'}
                      </td>
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

export default Workouts;
