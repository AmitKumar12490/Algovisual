const express = require('express');
const router  = express.Router();
const { ALGO_INFO } = require('../engine');

router.get('/', (req, res) => {
  const algorithms = Object.entries(ALGO_INFO).map(([key, info]) => ({
    key, ...info,
    example_func: key.includes('regression') ? 'synthetic data' : 'x**3 - 2*x - 5',
    parameters: key === 'bisection'
      ? ['a', 'b', 'max_iterations', 'tolerance']
      : key === 'gradient_descent'
      ? ['x0', 'learning_rate', 'max_iterations', 'tolerance']
      : ['x0', 'max_iterations', 'tolerance'],
  }));
  res.json({ count: algorithms.length, algorithms });
});

module.exports = router;
