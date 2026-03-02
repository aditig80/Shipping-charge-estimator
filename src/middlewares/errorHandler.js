const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Operational errors we threw intentionally
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
  }

  // Unknown errors
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;