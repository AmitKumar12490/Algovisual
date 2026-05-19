const mongoose = require('mongoose');

const iterationSchema = new mongoose.Schema({
  iteration:      Number,
  x:              Number,
  f_value:        Number,
  error:          Number,
  relative_error: Number,
}, { _id: false });

const runSchema = new mongoose.Schema({
  algorithm:        { type: String, required: true },
  algorithm_label:  String,
  function_expr:    String,
  x0:               Number,
  learning_rate:    Number,
  a:                Number,
  b:                Number,
  max_iterations:   Number,
  tolerance:        Number,
  iterations:       [iterationSchema],
  metrics: {
    iterations_count:  Number,
    final_x:           Number,
    final_error:       Number,
    execution_time_ms: Number,
    convergence_rate:  Number,
    converged:         Boolean,
  },
}, { timestamps: true });

module.exports = mongoose.model('Run', runSchema);
