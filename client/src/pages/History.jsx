import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import { algoLabel, ALGO_LIST } from '../utils/constants';
import './History.css';

export default function History() {
  const { runs, clearRuns } = useHistory();
  const [filter, setFilter] = useState('all');
  const nav = useNavigate();

  const filtered = filter === 'all' ? runs : runs.filter(r => r.algorithm === filter);

  return (
    <div className="history-container fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 className="page-title">Results History</h2>
          <p className="page-sub">{runs.length} run{runs.length !== 1 ? 's' : ''} this session</p>
        </div>
        {runs.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={clearRuns}>Clear All</button>
        )}
      </div>

      <div className="history-filters">
        {['all', ...ALGO_LIST.map(a => a.key)].map(k => (
          <button key={k}
            className={'filter-btn' + (filter === k ? ' active' : '')}
            onClick={() => setFilter(k)}>
            {k === 'all' ? 'All' : algoLabel(k)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="card-body">
          <div className="empty-state"><div className="empty-icon">🗂</div>
            {runs.length === 0 ? 'No runs yet. Go to Visualizer to run algorithms.' : 'No runs match this filter.'}
          </div>
        </div></div>
      ) : (
        <div className="history-grid">
          {filtered.map((r, i) => {
            const m = r.metrics;
            const conv = m?.converged;
            return (
              <div key={r._localId || i} className="history-card"
                onClick={() => nav('/visualizer?algo=' + r.algorithm)}>
                <div className="hc-top">
                  <div className="hc-algo">{algoLabel(r.algorithm)}</div>
                  <div className="hc-func">{(r.function || 'synthetic').length > 28 ? (r.function||'synthetic').slice(0,28)+'…' : (r.function||'synthetic')}</div>
                  <div className="hc-meta">
                    <span>Iters: <strong>{m?.iterations_count ?? '—'}</strong></span>
                    <span>Error: <strong>{m?.final_error?.toExponential(2) ?? '—'}</strong></span>
                    <span>Time: <strong>{m?.execution_time_ms ?? '—'}ms</strong></span>
                  </div>
                </div>
                <div className="hc-footer">
                  <span><span className={`status-dot ${conv ? 'ok' : 'err'}`} />{conv ? 'converged' : 'did not converge'}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
                    {new Date(r._localId || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
