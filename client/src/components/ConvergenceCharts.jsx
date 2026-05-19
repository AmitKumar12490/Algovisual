import React, { useEffect, useRef } from 'react';
import {
  Chart, LineElement, PointElement, LineController, ScatterController,
  CategoryScale, LinearScale, Legend, Tooltip, Filler,
} from 'chart.js';

Chart.register(LineElement, PointElement, LineController, ScatterController,
  CategoryScale, LinearScale, Legend, Tooltip, Filler);

const MONO = 'IBM Plex Mono';
const tickFont = { family: MONO, size: 10 };
const baseOpts = {
  responsive: true, maintainAspectRatio: false,
  animation: { duration: 350 },
  plugins: { legend: { labels: { font: { family: MONO, size: 11 }, boxWidth: 12 } } },
  scales: {
    x: { ticks: { font: tickFont, maxTicksLimit: 10 } },
    y: { ticks: { font: tickFont } },
  },
};

function useChart(canvasRef, config) {
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, config);
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [config]);
}

function ChartBox({ title, canvasRef }) {
  return (
    <div className="card">
      <div className="card-header"><span className="card-title">{title}</span></div>
      <div className="card-body" style={{ padding: 14 }}>
        <div style={{ height: 240, position: 'relative' }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}

export default function ConvergenceCharts({ iterations }) {
  const errRef  = useRef(); const fvRef = useRef();
  const logRef  = useRef(); const pathRef = useRef();

  const labels = iterations.map(d => d.iteration);
  const errors = iterations.map(d => d.error);
  const fvals  = iterations.map(d => d.f_value ?? 0);
  const logErr = errors.map(e => e > 0 ? Math.log10(e) : -15);

  useChart(errRef, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Abs Error', data: errors, borderColor: '#2563c4', backgroundColor: 'rgba(37,99,196,.1)', borderWidth: 2, pointRadius: 0, fill: true, tension: .3 }] },
    options: { ...baseOpts },
  });

  useChart(fvRef, {
    type: 'line',
    data: { labels, datasets: [{ label: 'f(x)', data: fvals, borderColor: '#e84f2c', backgroundColor: 'rgba(232,79,44,.08)', borderWidth: 2, pointRadius: 0, fill: true, tension: .3 }] },
    options: { ...baseOpts },
  });

  useChart(logRef, {
    type: 'line',
    data: { labels, datasets: [{ label: 'log₁₀(error)', data: logErr, borderColor: '#1a9e6e', borderWidth: 2, pointRadius: 0, tension: .3 }] },
    options: {
      ...baseOpts,
      scales: {
        ...baseOpts.scales,
        y: { ticks: { font: tickFont, callback: v => `10^${v.toFixed(1)}` } },
      },
    },
  });

  const xs = iterations.map(d => d.x);
  const xMin = Math.min(...xs) - 1, xMax = Math.max(...xs) + 1;
  const fnPts = [];
  for (let x = xMin; x <= xMax; x += (xMax - xMin) / 80)
    fnPts.push({ x, y: iterations[0]?.f_value ?? 0 }); // placeholder curve
  const pathPts = iterations.slice(0, 40).map(d => ({ x: d.x, y: d.f_value ?? 0 }));

  useChart(pathRef, {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Algorithm path', data: pathPts, borderColor: '#b8860b', backgroundColor: '#b8860b', pointRadius: 4, showLine: true, borderWidth: 1.5, borderDash: [4, 3] },
      ],
    },
    options: { ...baseOpts },
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <ChartBox title="Error vs Iteration"     canvasRef={errRef} />
      <ChartBox title="f(x) vs Iteration"      canvasRef={fvRef} />
      <ChartBox title="Log Convergence Curve"  canvasRef={logRef} />
      <ChartBox title="Algorithm Path on f(x)" canvasRef={pathRef} />
    </div>
  );
}
