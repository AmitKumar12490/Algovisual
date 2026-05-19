import React, { useState, useRef, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, BarElement, LineController, BarController,
         CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { api } from '../utils/api';
import { ALGO_LIST, algoLabel, COLORS } from '../utils/constants';
import './Comparison.css';

Chart.register(LineElement, PointElement, BarElement, LineController, BarController,
  CategoryScale, LinearScale, Legend, Tooltip);

const MONO = 'IBM Plex Mono';
const chartOpts = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 350 },
  plugins: { legend: { labels: { font: { family: MONO, size: 11 }, boxWidth: 12 } } },
  scales: { x: { ticks: { font: { family: MONO, size: 10 }, maxTicksLimit: 12 } },
            y: { ticks: { font: { family: MONO, size: 10 } } } },
};

export default function Comparison() {
  const [algo1, setAlgo1] = useState('gradient_descent');
  const [algo2, setAlgo2] = useState('newton_raphson');
  const [funcStr, setFuncStr] = useState('x**3 - 2*x - 5');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.compare({
        algorithm1: algo1, algorithm2: algo2,
        function: funcStr, x0: 2, a: 1, b: 3,
        learning_rate: 0.1, max_iterations: 200, tolerance: 1e-6,
      });
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const r1 = result?.results?.[algo1];
  const r2 = result?.results?.[algo2];
  const maxL = result ? Math.max(r1.iterations.length, r2.iterations.length) : 0;
  const pad  = (arr, len) => [...arr, ...Array(Math.max(0, len - arr.length)).fill(arr[arr.length - 1] || 0)];

  return (
    <div className="compare-container fade-up">
      <div className="page-header">
        <h2 className="page-title">Algorithm Comparison</h2>
        <p className="page-sub">Compare convergence behavior, speed, and accuracy side-by-side</p>
      </div>

      <div className="compare-controls card">
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 14, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Algorithm A</label>
            <select className="form-control" value={algo1} onChange={e => setAlgo1(e.target.value)}>
              {ALGO_LIST.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Algorithm B</label>
            <select className="form-control" value={algo2} onChange={e => setAlgo2(e.target.value)}>
              {ALGO_LIST.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Function f(x)</label>
            <input className="form-control" value={funcStr} onChange={e => setFuncStr(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={run} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
            {loading ? <><span className="spinner" /> Running...</> : 'Compare →'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'var(--accent2)', fontFamily: 'var(--mono)', fontSize: 12, margin: '8px 0' }}>⚠ {error}</div>}

      {result && (
        <>
          {/* Metric cards */}
          <div className="compare-metrics">
            {[r1, r2].map((r, idx) => {
              const algo = idx === 0 ? algo1 : algo2;
              const color = idx === 0 ? COLORS.A : COLORS.B;
              const isWinner = result.winner === algo;
              return (
                <div key={algo} className="card">
                  <div className="card-header" style={{ borderLeft: `3px solid ${color}` }}>
                    <span className="card-title" style={{ color }}>{algoLabel(algo)}</span>
                    {isWinner && <span className="winner-badge">⚡ FASTER</span>}
                  </div>
                  <div className="card-body">
                    <div className="cmp-metric-grid">
                      <div><div className="metric-label">Iterations</div><div className="metric-value" style={{ fontSize: 22 }}>{r.metrics.iterations_count}</div></div>
                      <div><div className="metric-label">Final Error</div><div className={`metric-value ${r.metrics.converged ? 'good' : 'bad'}`} style={{ fontSize: 16 }}>{r.metrics.final_error?.toExponential(3)}</div></div>
                      <div><div className="metric-label">Exec Time</div><div className="metric-value" style={{ fontSize: 16 }}>{r.metrics.execution_time_ms} ms</div></div>
                      <div><div className="metric-label">Conv. Rate</div><div className="metric-value" style={{ fontSize: 16 }}>{r.metrics.convergence_rate}</div></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Line chart */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><span className="card-title">Error Convergence — A vs B</span></div>
            <div className="card-body" style={{ height: 280 }}>
              <Line options={chartOpts} data={{
                labels: Array.from({ length: maxL }, (_, i) => i + 1),
                datasets: [
                  { label: algoLabel(algo1), data: pad(r1.iterations.map(d => d.error), maxL), borderColor: COLORS.A, borderWidth: 2, pointRadius: 0, tension: .3 },
                  { label: algoLabel(algo2), data: pad(r2.iterations.map(d => d.error), maxL), borderColor: COLORS.B, borderWidth: 2, pointRadius: 0, tension: .3 },
                ],
              }} />
            </div>
          </div>

          {/* Bar chart */}
          <div className="card">
            <div className="card-header"><span className="card-title">Performance Comparison</span></div>
            <div className="card-body" style={{ height: 240 }}>
              <Bar options={chartOpts} data={{
                labels: ['Iterations', 'Exec Time (×10µs)', 'log10(Error)+10'],
                datasets: [
                  { label: algoLabel(algo1), data: [r1.metrics.iterations_count, r1.metrics.execution_time_ms * 10, Math.max(0, 10 + Math.log10(r1.metrics.final_error + 1e-12))], backgroundColor: COLORS.A + 'cc' },
                  { label: algoLabel(algo2), data: [r2.metrics.iterations_count, r2.metrics.execution_time_ms * 10, Math.max(0, 10 + Math.log10(r2.metrics.final_error + 1e-12))], backgroundColor: COLORS.B + 'cc' },
                ],
              }} />
            </div>
          </div>
        </>
      )}

      {!result && !loading && (
        <div className="card" style={{ marginTop: 8 }}>
          <div className="card-body">
            <div className="empty-state"><div className="empty-icon">⚡</div>Select two algorithms and click Compare</div>
          </div>
        </div>
      )}
    </div>
  );
}
