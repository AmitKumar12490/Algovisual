import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGO_LIST } from '../utils/constants';
import './Home.css';

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="home fade-up">
      {/* Hero */}
      <div className="hero">
        <div className="hero-left">
          <div className="hero-label">Educational Visualization Tool · MERN Stack</div>
          <h1 className="hero-title">Visualize <em>Algorithm Convergence</em> in Real Time</h1>
          <p className="hero-desc">
            Explore how iterative algorithms converge toward optimal solutions.
            Analyze error, convergence rate, and execution time through interactive
            graphs powered by a React + Node.js + MongoDB stack.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => nav('/visualizer')}>▶ Start Visualizing</button>
            <button className="btn btn-outline" onClick={() => nav('/comparison')}>Compare Algorithms →</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-header">
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>POST /api/run</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent3)' }}>200 OK ✓</span>
          </div>
          <pre className="hero-code">{`{
  "algorithm": "newton_raphson",
  "function": "x**3 - 2*x - 5",
  "x0": 2.0,
  "tolerance": 1e-6
}

→ converged in 6 iterations
→ final_error: 2.1e-10
→ execution_time_ms: 0.32`}</pre>
        </div>
      </div>

      {/* Algorithm cards */}
      <div className="algo-grid">
        {ALGO_LIST.map(a => (
          <div key={a.key} className="algo-card" onClick={() => nav(`/visualizer?algo=${a.key}`)}>
            <div className="algo-icon">{a.icon}</div>
            <div className="algo-name">{a.label}</div>
            <div className="algo-desc">{a.desc}</div>
            <span className="algo-tag">{a.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
