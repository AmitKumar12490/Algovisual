'use strict';
/**
 * AlgoConv – Algorithm Engine (Node.js)
 * All 8 iterative algorithms with convergence tracking.
 */

// ── Math parser ───────────────────────────────────────
function makeFn(expr) {
  const e = expr
    .replace(/\^/g, '**')
    .replace(/(\d)(x)/g, '$1*$2')
    .replace(/\bsin\b/g, 'Math.sin')
    .replace(/\bcos\b/g, 'Math.cos')
    .replace(/\btan\b/g, 'Math.tan')
    .replace(/\bexp\b/g, 'Math.exp')
    .replace(/\bln\b/g,  'Math.log')
    .replace(/\blog\b/g, 'Math.log10')
    .replace(/\bsqrt\b/g,'Math.sqrt')
    .replace(/\babs\b/g, 'Math.abs')
    .replace(/\bpi\b/g,  'Math.PI')
    .replace(/\be\b/g,   'Math.E');
  return x => { try { return Function('x', `"use strict"; return (${e})`)(x); } catch { return NaN; } };
}

// ── Numerical differentiation ─────────────────────────
const deriv  = (f, x, h = 1e-7) => (f(x + h) - f(x - h)) / (2 * h);

// ── Iteration record ──────────────────────────────────
const rec = (i, x, fv, err) => ({
  iteration:      i,
  x:              +x.toFixed(10),
  f_value:        isFinite(fv) ? +fv.toFixed(10) : null,
  error:          +Math.abs(err).toFixed(10),
  relative_error: Math.abs(x) > 1e-12 ? +(Math.abs(err) / Math.abs(x)).toFixed(10) : 0,
});

// ── 1. Gradient Descent ───────────────────────────────
function gradientDescent(expr, x0 = 2, lr = 0.1, maxIter = 100, tol = 1e-6) {
  const f = makeFn(expr);
  let x = x0, iters = [];
  for (let i = 1; i <= maxIter; i++) {
    const fv = f(x), grad = deriv(f, x);
    const xNew = x - lr * grad, err = Math.abs(xNew - x);
    iters.push(rec(i, x, fv, err));
    if (err < tol) break;
    x = xNew;
  }
  return iters;
}

// ── 2. Newton–Raphson ─────────────────────────────────
function newtonRaphson(expr, x0 = 2, maxIter = 100, tol = 1e-6) {
  const f = makeFn(expr);
  let x = x0, iters = [];
  for (let i = 1; i <= maxIter; i++) {
    const fv = f(x), fp = deriv(f, x);
    if (Math.abs(fp) < 1e-12) break;
    const xNew = x - fv / fp, err = Math.abs(xNew - x);
    iters.push(rec(i, x, fv, err));
    if (err < tol) break;
    x = xNew;
  }
  return iters;
}

// ── 3. Bisection ──────────────────────────────────────
function bisection(expr, a = 1, b = 3, maxIter = 100, tol = 1e-6) {
  const f = makeFn(expr);
  if (f(a) * f(b) > 0) b += 1;
  let iters = [];
  for (let i = 1; i <= maxIter; i++) {
    const m = (a + b) / 2, fm = f(m), err = (b - a) / 2;
    iters.push(rec(i, m, fm, err));
    if (err < tol || Math.abs(fm) < tol) break;
    f(a) * fm < 0 ? (b = m) : (a = m);
  }
  return iters;
}

// ── 4. Secant ─────────────────────────────────────────
function secant(expr, x0 = 2, maxIter = 100, tol = 1e-6) {
  const f = makeFn(expr);
  let x0_ = x0, x1 = x0 + 0.1, iters = [];
  for (let i = 1; i <= maxIter; i++) {
    const f0 = f(x0_), f1 = f(x1);
    if (Math.abs(f1 - f0) < 1e-12) break;
    const x2 = x1 - f1 * (x1 - x0_) / (f1 - f0), err = Math.abs(x2 - x1);
    iters.push(rec(i, x1, f1, err));
    if (err < tol) break;
    x0_ = x1; x1 = x2;
  }
  return iters;
}

// ── 5. Simulated Annealing ────────────────────────────
function simulatedAnnealing(expr, x0 = 0, maxIter = 200, tol = 1e-4) {
  const f = makeFn(expr);
  let x = x0, T = 10, iters = [];
  for (let i = 1; i <= maxIter; i++) {
    const xNew = x + (Math.random() - 0.5) * T;
    const dE = f(xNew) - f(x);
    if (dE < 0 || Math.random() < Math.exp(-dE / Math.max(T, 1e-9))) x = xNew;
    T *= 0.95;
    const err = Math.abs(f(x));
    iters.push(rec(i, x, f(x), err));
    if (err < tol) break;
  }
  return iters;
}

// ── 6. Genetic Algorithm ──────────────────────────────
function geneticAlgorithm(expr, maxIter = 200, tol = 1e-3) {
  const f = makeFn(expr);
  let pop = Array.from({ length: 20 }, () => (Math.random() - 0.5) * 20);
  let iters = [];
  for (let i = 1; i <= maxIter; i++) {
    pop.sort((a, b) => Math.abs(f(a)) - Math.abs(f(b)));
    const best = pop[0], err = Math.abs(f(best));
    iters.push(rec(i, best, f(best), err));
    if (err < tol) break;
    const survivors = pop.slice(0, 5);
    pop = [...survivors];
    while (pop.length < 20)
      pop.push(survivors[Math.floor(Math.random() * 5)] + (Math.random() - 0.5) * Math.max(err * 2, 0.01));
  }
  return iters;
}

// ── 7. Linear Regression GD ──────────────────────────
function linearRegressionGD(maxIter = 100, lr = 0.01, tol = 1e-6) {
  const data = Array.from({ length: 30 }, (_, i) => {
    const x = (i - 15) / 5;
    return { x, y: 2 * x + 1 + (Math.random() - 0.5) * 0.5 };
  });
  let m = 0, b = 0, iters = [];
  for (let it = 1; it <= maxIter; it++) {
    let dm = 0, db = 0;
    data.forEach(d => { const e = d.y - (m * d.x + b); dm -= 2 * d.x * e; db -= 2 * e; });
    dm /= data.length; db /= data.length;
    m -= lr * dm; b -= lr * db;
    const loss = data.reduce((s, d) => s + (d.y - (m * d.x + b)) ** 2, 0) / data.length;
    const err = Math.sqrt(dm ** 2 + db ** 2);
    iters.push(rec(it, m, loss, err));
    if (err < tol) break;
  }
  return iters;
}

// ── 8. Logistic Regression GD ────────────────────────
function logisticRegressionGD(maxIter = 100, lr = 0.1, tol = 1e-6) {
  const sigmoid = z => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
  const data = Array.from({ length: 40 }, (_, i) => ({ x: (i - 20) / 10, y: i > 20 ? 1 : 0 }));
  let w = 0, bias = 0, iters = [];
  for (let it = 1; it <= maxIter; it++) {
    let dw = 0, db = 0, loss = 0;
    data.forEach(d => {
      const p = sigmoid(w * d.x + bias);
      const e = p - d.y;
      dw += e * d.x; db += e;
      loss -= d.y * Math.log(p + 1e-9) + (1 - d.y) * Math.log(1 - p + 1e-9);
    });
    dw /= data.length; db /= data.length; loss /= data.length;
    w -= lr * dw; bias -= lr * db;
    iters.push(rec(it, w, loss, Math.abs(dw)));
    if (Math.abs(dw) < tol) break;
  }
  return iters;
}

// ── Convergence rate ──────────────────────────────────
function convergenceRate(iterations) {
  const errors = iterations.map(d => d.error).filter(e => e > 0);
  if (errors.length < 5) return 0;
  const e1 = errors[Math.floor(errors.length * 0.1)] || 1e-10;
  const e2 = errors[Math.floor(errors.length * 0.9)] || 1e-10;
  return +Math.abs((Math.log(e2) - Math.log(e1)) / (errors.length * 0.8)).toFixed(6);
}

// ── Build metrics ─────────────────────────────────────
function buildMetrics(iters, tol, execMs) {
  const last = iters[iters.length - 1] || {};
  const err = last.error ?? 1;
  return {
    iterations_count:  iters.length,
    final_x:           last.x ?? 0,
    final_error:       err,
    execution_time_ms: execMs,
    convergence_rate:  convergenceRate(iters),
    converged:         err < tol * 10,
  };
}

// ── Dispatcher ────────────────────────────────────────
function runAlgorithm(name, opts = {}) {
  const { expr = 'x**3 - 2*x - 5', x0 = 2, a = 1, b = 3,
          lr = 0.1, maxIter = 100, tol = 1e-6 } = opts;
  switch (name) {
    case 'gradient_descent':    return gradientDescent(expr, x0, lr, maxIter, tol);
    case 'newton_raphson':      return newtonRaphson(expr, x0, maxIter, tol);
    case 'bisection':           return bisection(expr, a, b, maxIter, tol);
    case 'secant':              return secant(expr, x0, maxIter, tol);
    case 'simulated_annealing': return simulatedAnnealing(expr, x0, maxIter, tol);
    case 'genetic':             return geneticAlgorithm(expr, maxIter, tol);
    case 'linear_regression':   return linearRegressionGD(maxIter, lr, tol);
    case 'logistic_regression': return logisticRegressionGD(maxIter, lr, tol);
    default: throw new Error(`Unknown algorithm: ${name}`);
  }
}

const ALGO_INFO = {
  gradient_descent:    { label: 'Gradient Descent',       category: 'Optimization',     tag: 'optimization' },
  newton_raphson:      { label: 'Newton–Raphson',          category: 'Root-Finding',     tag: 'root-finding' },
  bisection:           { label: 'Bisection Method',        category: 'Root-Finding',     tag: 'root-finding' },
  secant:              { label: 'Secant Method',           category: 'Root-Finding',     tag: 'root-finding' },
  simulated_annealing: { label: 'Simulated Annealing',     category: 'Metaheuristic',    tag: 'metaheuristic' },
  genetic:             { label: 'Genetic Algorithm',       category: 'Evolutionary',     tag: 'evolutionary' },
  linear_regression:   { label: 'Linear Regression GD',   category: 'Machine Learning', tag: 'ml' },
  logistic_regression: { label: 'Logistic Regression GD', category: 'Machine Learning', tag: 'ml' },
};

module.exports = { runAlgorithm, buildMetrics, convergenceRate, ALGO_INFO, makeFn };
