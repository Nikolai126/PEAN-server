const { validationResult: userValidationResult } = require('express-validator');
const ErrorApi = require('../exceptions/error-api');

module.exports = (req, res, next) => {
  const errors = userValidationResult(req);
  if (!errors.isEmpty()) {
    return next(ErrorApi.BadRequest('Errors in validation!', errors.array()));
  }
  next();
}
