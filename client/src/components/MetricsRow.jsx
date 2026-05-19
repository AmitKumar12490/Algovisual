import React from 'react';

export default function MetricsRow({ metrics }) {
  if (!metrics) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
      {['Iterations', 'Final Error', 'Exec Time', 'Conv. Rate'].map(l => (
        <div key={l} className="metric-card">
          <div className="metric-label">{l}</div>
          <div className="metric-value">—</div>
        </div>
      ))}
    </div>
  );

  const { iterations_count, final_error, execution_time_ms, convergence_rate, converged } = metrics;
  const errClass = converged ? 'good' : final_error < 0.01 ? 'warn' : 'bad';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
      <div className="metric-card">
        <div className="metric-label">Iterations</div>
        <div className="metric-value">{iterations_count}</div>
        <div className="metric-sub">to convergence</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Final Error</div>
        <div className={`metric-value ${errClass}`}>
          {final_error < 1e-9 ? final_error?.toExponential(2) : final_error?.toFixed(6)}
        </div>
        <div className="metric-sub">absolute</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Exec Time</div>
        <div className="metric-value">{execution_time_ms} ms</div>
        <div className="metric-sub">milliseconds</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Conv. Rate</div>
        <div className="metric-value">{convergence_rate ?? '—'}</div>
        <div className="metric-sub">avg per iter</div>
      </div>
    </div>
  );
}
