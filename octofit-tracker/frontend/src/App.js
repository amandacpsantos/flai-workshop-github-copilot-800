import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  const features = [
    { icon: '👤', title: 'Users', desc: 'Manage athlete profiles and accounts.', path: '/users' },
    { icon: '🏋️', title: 'Activities', desc: 'Log and review fitness activities.', path: '/activities' },
    { icon: '👥', title: 'Teams', desc: 'Create teams and train together.', path: '/teams' },
    { icon: '💪', title: 'Workouts', desc: 'Browse personalised workout plans.', path: '/workouts' },
    { icon: '🏆', title: 'Leaderboard', desc: 'Compete and climb the rankings.', path: '/leaderboard' },
  ];

  return (
    <>
      <div className="octofit-hero">
        <h1>🐙 OctoFit Tracker</h1>
        <p className="lead">Track activities · Build teams · Dominate the leaderboard</p>
      </div>
      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          {features.map((f) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-2-4" key={f.title}>
              <NavLink to={f.path} className="text-decoration-none">
                <div className="card octofit-feature-card h-100 text-center p-3">
                  <div className="card-body">
                    <div className="card-icon">{f.icon}</div>
                    <h5 className="card-title fw-bold">{f.title}</h5>
                    <p className="card-text text-muted small">{f.desc}</p>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function App() {
  const navItems = [
    { path: '/users',       label: 'Users' },
    { path: '/teams',       label: 'Teams' },
    { path: '/activities',  label: 'Activities' },
    { path: '/workouts',    label: 'Workouts' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg octofit-navbar">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
              🐙 OctoFit Tracker
            </NavLink>
            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {navItems.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <NavLink
                      className={({ isActive }) =>
                        'nav-link' + (isActive ? ' active' : '')
                      }
                      to={item.path}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/users"      element={<Users />} />
          <Route path="/teams"      element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts"   element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
