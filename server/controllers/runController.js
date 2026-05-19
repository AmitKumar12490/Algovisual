const { performance } = require('perf_hooks');
const { runAlgorithm, buildMetrics, ALGO_INFO } = require('../engine');
const Run = require('../models/Run');

exports.runAlgo = async (req, res, next) => {
  try {
    const {
      algorithm = 'gradient_descent',
      function: expr = 'x**3 - 2*x - 5',
      x0 = 2, a = 1, b = 3,
      learning_rate: lr = 0.1,
      max_iterations: maxIter = 100,
      tolerance: tol = 1e-6,
    } = req.body;

    if (!ALGO_INFO[algorithm])
      return res.status(400).json({ error: `Unknown algorithm: ${algorithm}` });

    const t0 = performance.now();
    const iterations = runAlgorithm(algorithm, { expr, x0, a, b, lr, maxIter, tol });
    const execMs = +(performance.now() - t0).toFixed(3);
    const metrics = buildMetrics(iterations, tol, execMs);

    // Save to MongoDB (non-blocking)
    Run.create({
      algorithm, algorithm_label: ALGO_INFO[algorithm].label,
      function_expr: expr, x0, learning_rate: lr, a, b,
      max_iterations: maxIter, tolerance: tol,
      iterations: iterations.slice(0, 500), // cap stored iterations
      metrics,
    }).catch(err => console.warn('DB save skipped:', err.message));

    res.json({
      algorithm,
      algorithm_label: ALGO_INFO[algorithm].label,
      function: expr,
      metrics,
      iterations,
    });
  } catch (err) {
    next(err);
  }
};
