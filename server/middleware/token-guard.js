const tokenService = require('../services/token-service');

module.exports = async (req, res, next) => {
  try {
    const checkAccess = JSON.parse(req.headers.auth);
    if (!checkAccess) {
      return res.status(403).send({ error: 'At first - try to login, please...' });
    }
    const accessValid = await tokenService.validateAccessToken(checkAccess);
    if (!accessValid) {
      return res.status(401).send({ error: 'Expired access token! Try login again, please...' });
    }
    next();
  } catch (err) {
    next(err);
  }
}
