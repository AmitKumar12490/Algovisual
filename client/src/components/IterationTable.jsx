import React from 'react';

export default function IterationTable({ iterations, tol }) {
  if (!iterations.length)
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        Run an algorithm to see iteration data
      </div>
    );

  const sample = iterations.length > 200
    ? iterations.filter((_, i) => i % Math.ceil(iterations.length / 200) === 0)
    : iterations;

  const exportCSV = () => {
    const rows = [['Iter', 'x', 'f(x)', 'Abs Error', 'Rel Error']];
    sample.forEach(r => rows.push([r.iteration, r.x, r.f_value ?? '', r.error, r.relative_error ?? '']));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' }));
    a.download = 'algoconv_iterations.csv';
    a.click();
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Iteration Data ({iterations.length} rows)</span>
        <button className="btn btn-outline btn-sm" onClick={exportCSV}>↓ CSV</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>#</th><th>x</th><th>f(x)</th><th>Abs Error</th><th>Rel Error</th><th>Status</th></tr>
          </thead>
          <tbody>
            {sample.map(r => {
              const conv = r.error < tol;
              return (
                <tr key={r.iteration}>
                  <td>{r.iteration}</td>
                  <td>{r.x?.toFixed(8)}</td>
                  <td>{r.f_value != null ? r.f_value.toFixed(8) : '—'}</td>
                  <td className={conv ? 'conv' : r.error > 1 ? 'divg' : ''}>{r.error?.toFixed(8)}</td>
                  <td>{r.relative_error?.toFixed(6) ?? '—'}</td>
                  <td className={conv ? 'conv' : ''}>{conv ? '✓ converged' : 'running'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
