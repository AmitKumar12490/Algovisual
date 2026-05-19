import React from 'react';
import { ALGO_LIST } from '../utils/constants';
import './About.css';

const Tech = ({ items }) => (
  <div className="tech-list">{items.map(t => <span key={t} className="tech-pill">{t}</span>)}</div>
);

export default function About() {
  return (
    <div className="about-container fade-up">
      <div className="about-section">
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
          MERN Stack · Educational Software
        </div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 36, letterSpacing: '-.02em', marginBottom: 14 }}>
          Algorithm Convergence<br />Visualizer
        </h1>
        <p className="about-p">
          A full-stack educational web application built with MongoDB, Express, React, and Node.js
          that visualizes the convergence behavior of iterative numerical and optimization algorithms.
          Designed for students and researchers in Numerical Methods, Optimization Theory, and Machine Learning.
        </p>
      </div>

      <div className="about-section">
        <div className="about-h2">MERN Stack Architecture</div>
        <div className="arch-grid">
          {[
            { layer: 'M', title: 'MongoDB', desc: 'Stores run history, iteration data, and comparison results via Mongoose ODM.' },
            { layer: 'E', title: 'Express.js', desc: 'RESTful API server with modular routes, controllers, and middleware.' },
            { layer: 'R', title: 'React 18', desc: 'SPA with React Router, Context API for state, and Chart.js for visualization.' },
            { layer: 'N', title: 'Node.js', desc: 'JavaScript algorithm engine — same language on both frontend and backend.' },
          ].map(({ layer, title, desc }) => (
            <div key={layer} className="arch-card">
              <div className="arch-letter">{layer}</div>
              <div className="arch-title">{title}</div>
              <div className="arch-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <div className="about-h2">Implemented Algorithms</div>
        <div className="algo-list-grid">
          {ALGO_LIST.map(a => (
            <div key={a.key} className="algo-list-item">
              <span className="ali-icon">{a.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{a.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <div className="about-h2">Technology Stack</div>
        <Tech items={['React 18', 'React Router v6', 'Vite', 'Chart.js 4', 'Context API',
          'Node.js', 'Express 4', 'Mongoose', 'MongoDB', 'Morgan', 'Nodemon',
          'Vercel', 'MongoDB Atlas', 'IBM Plex Fonts']} />
      </div>

      <div className="about-section">
        <div className="about-h2">API Endpoints</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 2 }}>
          {[
            ['POST', '/api/run',             'Execute a single algorithm'],
            ['POST', '/api/compare',         'Compare two algorithms side-by-side'],
            ['GET',  '/api/history/runs',    'Fetch all previous runs'],
            ['GET',  '/api/history/runs/:id','Fetch detailed run with iterations'],
            ['DELETE','/api/history/runs/:id','Delete a run record'],
            ['GET',  '/api/algorithms',      'List all algorithms + metadata'],
            ['GET',  '/api/health',          'Health check + DB status'],
          ].map(([m, path, desc]) => (
            <div key={path}>
              <span style={{ color: m === 'GET' ? 'var(--accent3)' : m === 'POST' ? 'var(--accent)' : 'var(--accent2)', fontWeight: 700 }}>{m}</span>
              {' '}<span style={{ color: 'var(--text)' }}>{path}</span>
              {' '}<span style={{ color: 'var(--text3)' }}>— {desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <div className="about-h2">Convergence Metrics Computed</div>
        <p className="about-p">
          Absolute Error · Relative Error · Iterations to Convergence · Execution Time (ms) ·
          Convergence Rate (log-linear slope) · Divergence Detection · Final x value · f(x) at convergence
        </p>
      </div>
    </div>
  );
}
