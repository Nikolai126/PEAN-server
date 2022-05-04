const ErrorApi = require('../exceptions/error-api');
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ErrorApi.UnauthorizedError());
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ErrorApi.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ErrorApi.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (err) {
    return next(ErrorApi.UnauthorizedError());
  }
}
