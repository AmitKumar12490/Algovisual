import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import { useHistory } from '../context/HistoryContext';

export function useAlgorithm() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [logs,    setLogs]    = useState([{ type: 'info', msg: '» Ready. Configure and run.' }]);
  const { addRun } = useHistory();

  const log = useCallback((type, msg) =>
    setLogs(prev => [...prev.slice(-80), { type, msg }]), []);

  const run = useCallback(async (params) => {
    setLoading(true); setError('');
    log('info', `» Calling /api/run [${params.algorithm}]...`);
    try {
      const data = await api.run(params);
      setResult(data);
      addRun(data);
      const m = data.metrics;
      log(m.converged ? 'info' : 'warn',
        `» ${m.converged ? 'Converged' : 'Stopped'} — ${m.iterations_count} iters | err: ${m.final_error?.toExponential(2)} | ${m.execution_time_ms}ms`);
      return data;
    } catch (err) {
      setError(err.message);
      log('err', `» Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [addRun, log]);

  const reset = useCallback(() => {
    setResult(null); setError('');
    setLogs([{ type: 'info', msg: '» Reset. Configure and run.' }]);
  }, []);

  return { result, loading, error, logs, run, reset };
}
