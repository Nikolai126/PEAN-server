const ErrorApi = require('../exceptions/error-api');

module.exports = function (err, req, res, next) {
  if (err instanceof ErrorApi) {
    return res.status(err.status).json({ message: err.message, errors: err.errors});
  }
  return res.status(500).json({ message: 'Unknown error!'});
}
