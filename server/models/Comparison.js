const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  algorithm1:       String,
  algorithm2:       String,
  function_expr:    String,
  winner:           String,
  result1: {
    label:             String,
    iterations_count:  Number,
    final_error:       Number,
    execution_time_ms: Number,
    converged:         Boolean,
  },
  result2: {
    label:             String,
    iterations_count:  Number,
    final_error:       Number,
    execution_time_ms: Number,
    converged:         Boolean,
  },
}, { timestamps: true });

module.exports = mongoose.model('Comparison', comparisonSchema);
