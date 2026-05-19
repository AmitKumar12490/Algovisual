import React, { createContext, useContext, useState, useCallback } from 'react';

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [runs, setRuns] = useState([]);

  const addRun = useCallback(run => {
    setRuns(prev => [{ ...run, _localId: Date.now() }, ...prev].slice(0, 100));
  }, []);

  const clearRuns = useCallback(() => setRuns([]), []);

  return (
    <HistoryContext.Provider value={{ runs, addRun, clearRuns }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);
