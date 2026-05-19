const Run = require('../models/Run');
const Comparison = require('../models/Comparison');

exports.getRuns = async (req, res, next) => {
  try {
    const { algorithm, limit = 50, page = 1 } = req.query;
    const filter = algorithm ? { algorithm } : {};
    const runs = await Run.find(filter, '-iterations')
      .sort({ createdAt: -1 })
      .limit(+limit)
      .skip((+page - 1) * +limit);
    const total = await Run.countDocuments(filter);
    res.json({ total, page: +page, runs });
  } catch (err) { next(err); }
};

exports.getRunById = async (req, res, next) => {
  try {
    const run = await Run.findById(req.params.id);
    if (!run) return res.status(404).json({ error: 'Run not found' });
    res.json(run);
  } catch (err) { next(err); }
};

exports.deleteRun = async (req, res, next) => {
  try {
    await Run.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) { next(err); }
};

exports.getComparisons = async (req, res, next) => {
  try {
    const comparisons = await Comparison.find().sort({ createdAt: -1 }).limit(20);
    res.json({ comparisons });
  } catch (err) { next(err); }
};
