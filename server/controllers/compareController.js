const { performance } = require('perf_hooks');
const { runAlgorithm, buildMetrics, ALGO_INFO } = require('../engine');
const Comparison = require('../models/Comparison');

exports.compare = async (req, res, next) => {
  try {
    const {
      algorithm1 = 'gradient_descent',
      algorithm2 = 'newton_raphson',
      function: expr = 'x**3 - 2*x - 5',
      x0 = 2, a = 1, b = 3,
      learning_rate: lr = 0.1,
      max_iterations: maxIter = 200,
      tolerance: tol = 1e-6,
    } = req.body;

    for (const algo of [algorithm1, algorithm2])
      if (!ALGO_INFO[algo])
        return res.status(400).json({ error: `Unknown algorithm: ${algo}` });

    const opts = { expr, x0, a, b, lr, maxIter, tol };
    const results = {};

    for (const algo of [algorithm1, algorithm2]) {
      const t0 = performance.now();
      const iterations = runAlgorithm(algo, opts);
      const execMs = +(performance.now() - t0).toFixed(3);
      results[algo] = {
        algorithm: algo,
        algorithm_label: ALGO_INFO[algo].label,
        metrics: buildMetrics(iterations, tol, execMs),
        iterations,
      };
    }

    const winner = results[algorithm1].metrics.iterations_count
      <= results[algorithm2].metrics.iterations_count ? algorithm1 : algorithm2;

    // Save comparison
    Comparison.create({
      algorithm1, algorithm2, function_expr: expr, winner,
      result1: { label: ALGO_INFO[algorithm1].label, ...results[algorithm1].metrics },
      result2: { label: ALGO_INFO[algorithm2].label, ...results[algorithm2].metrics },
    }).catch(err => console.warn('DB save skipped:', err.message));

    res.json({ function: expr, winner, winner_label: ALGO_INFO[winner].label, results });
  } catch (err) {
    next(err);
  }
};
