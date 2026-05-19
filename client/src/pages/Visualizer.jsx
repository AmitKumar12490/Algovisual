import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { ALGO_LIST, algoLabel } from '../utils/constants';
import { useHistory } from '../context/HistoryContext';
import MetricsRow from '../components/MetricsRow';
import ConvergenceCharts from '../components/ConvergenceCharts';
import IterationTable from '../components/IterationTable';
import './Visualizer.css';

const DEFAULT_PARAMS = {
  algorithm: 'gradient_descent', function: 'x**3 - 2*x - 5',
  x0: 2, a: 1, b: 3, learning_rate: 0.1,
  max_iterations: 100, tolerance: 0.000001,
};

export default function Visualizer() {
  const [searchParams] = useSearchParams();
  const [params, setParams] = useState({
    ...DEFAULT_PARAMS,
    algorithm: searchParams.get('algo') || DEFAULT_PARAMS.algorithm,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([{ type: 'info', msg: '» Ready. Configure and run.' }]);
  const logRef = useRef();
  const { addRun } = useHistory();

  const log = (type, msg) => setLogs(prev => [...prev.slice(-80), { type, msg }]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const set = (k, v) => setParams(prev => ({ ...prev, [k]: v }));

  const showBisect  = params.algorithm === 'bisection';
  const showLR      = ['gradient_descent', 'linear_regression', 'logistic_regression'].includes(params.algorithm);
  const isSynthetic = ['linear_regression', 'logistic_regression'].includes(params.algorithm);

  const run = async () => {
    setLoading(true);
    log('info', `» Running ${algoLabel(params.algorithm)}...`);
    try {
      const data = await api.run(params);
      setResult(data);
      addRun(data);
      const m = data.metrics;
      log(m.converged ? 'info' : 'warn',
        `» ${m.converged ? 'Converged' : 'Stopped'} in ${m.iterations_count} iters | error: ${m.final_error?.toExponential(3)} | ${m.execution_time_ms}ms`);
    } catch (err) {
      log('err', `» Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setLogs([{ type: 'info', msg: '» Reset.' }]); };

  return (
    <div className="viz-layout">
      {/* Sidebar */}
      <div className="viz-sidebar">
        <div className="sidebar-title">Configuration</div>

        <div className="form-group">
          <label className="form-label">Algorithm</label>
          <select className="form-control" value={params.algorithm}
            onChange={e => set('algorithm', e.target.value)}>
            <optgroup label="Root-Finding">
              {ALGO_LIST.filter(a => a.category === 'Root-Finding').map(a =>
                <option key={a.key} value={a.key}>{a.label}</option>)}
            </optgroup>
            <optgroup label="Optimization">
              {ALGO_LIST.filter(a => a.category === 'Optimization').map(a =>
                <option key={a.key} value={a.key}>{a.label}</option>)}
            </optgroup>
            <optgroup label="Metaheuristic">
              {ALGO_LIST.filter(a => a.category === 'Metaheuristic').map(a =>
                <option key={a.key} value={a.key}>{a.label}</option>)}
            </optgroup>
            <optgroup label="Evolutionary">
              {ALGO_LIST.filter(a => a.category === 'Evolutionary').map(a =>
                <option key={a.key} value={a.key}>{a.label}</option>)}
            </optgroup>
            <optgroup label="Machine Learning">
              {ALGO_LIST.filter(a => a.category === 'Machine Learning').map(a =>
                <option key={a.key} value={a.key}>{a.label}</option>)}
            </optgroup>
          </select>
        </div>

        <div className="form-group" style={{ opacity: isSynthetic ? .5 : 1 }}>
          <label className="form-label">Function f(x)</label>
          <input className="form-control" value={isSynthetic ? 'synthetic data' : params.function}
            disabled={isSynthetic}
            onChange={e => set('function', e.target.value)} />
          <div className="form-hint">Use **, math.sin, math.cos, math.exp, math.log</div>
        </div>

        {!showBisect && (
          <div className="form-group">
            <label className="form-label">Initial Value x₀</label>
            <input className="form-control" type="number" value={params.x0}
              onChange={e => set('x0', +e.target.value)} />
          </div>
        )}

        {showBisect && (
          <div className="form-group">
            <label className="form-label">Interval [a, b]</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input className="form-control" type="number" value={params.a} placeholder="a" onChange={e => set('a', +e.target.value)} />
              <input className="form-control" type="number" value={params.b} placeholder="b" onChange={e => set('b', +e.target.value)} />
            </div>
          </div>
        )}

        {showLR && (
          <div className="form-group">
            <label className="form-label">Learning Rate α</label>
            <input className="form-control" type="number" step="0.01" value={params.learning_rate}
              onChange={e => set('learning_rate', +e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Max Iterations</label>
          <input className="form-control" type="number" value={params.max_iterations}
            onChange={e => set('max_iterations', +e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Tolerance ε</label>
          <input className="form-control" type="number" step="0.000001" value={params.tolerance}
            onChange={e => set('tolerance', +e.target.value)} />
        </div>

        <div className="divider" />

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
          onClick={run} disabled={loading}>
          {loading ? <><span className="spinner" /> Running...</> : '▶ Run Algorithm'}
        </button>
        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          onClick={reset}>↺ Reset</button>

        <div className="divider" />
        <div className="sidebar-title">Status Log</div>
        <div className="log-box" ref={logRef}>
          {logs.map((l, i) => (
            <div key={i} className={`log-${l.type}`}>{l.msg}</div>
          ))}
        </div>

        {result?.metrics && (
          <div style={{ marginTop: 12, padding: '8px 10px', background: 'var(--surface2)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 10 }}>
            <span className={`status-dot ${result.metrics.converged ? 'ok' : 'err'}`} />
            {result.metrics.converged ? 'converged' : 'did not converge'}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="viz-main">
        <MetricsRow metrics={result?.metrics} />

        {result?.iterations?.length > 0 ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <ConvergenceCharts iterations={result.iterations} />
            </div>
            <IterationTable iterations={result.iterations} tol={params.tolerance} />
          </>
        ) : (
          <div className="card" style={{ marginTop: 8 }}>
            <div className="card-body">
              <div className="empty-state">
                <div className="empty-icon">📈</div>
                Select an algorithm and click Run to see convergence graphs
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
