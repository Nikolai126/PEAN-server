const { validationResult: postValidResult } = require('express-validator');
const ErrorApi = require('../exceptions/error-api');

module.exports = (req, res, next) => {
  const errors = postValidResult(req);
  if (!errors.isEmpty()) {
    return next(ErrorApi.BadRequest('Errors in validation!', errors.array()));
  }
  next();
}
