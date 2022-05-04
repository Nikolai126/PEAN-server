const userService = require('../services/user-service');
const encryptPassword = require("../utilities/encryptPassword");
const ErrorApi = require('../exceptions/error-api');
const { ageRefreshToken } = require('../config/constants')

class UserController {
  async signUp (req, res, next) {
    try {
      const signUpParams = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: await encryptPassword(req.body.password),
      }
      const userExist = await userService.emailExist(signUpParams.email);
      if (userExist) {
        return next(ErrorApi.BadRequest('This email is already in use!'));
      }
      else {
        const newUser = await userService.signUp(signUpParams);
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.clearCookie();
        res.cookie('refreshToken', newUser.tokens.refreshToken, {
          maxAge: ageRefreshToken,
          httpOnly: true
        });
        return res.status(200).send(JSON.stringify(newUser.tokens.accessToken));
      }
    } catch (err) {
      next(err);
    }
  }

  async signIn (req, res, next) {
    try {
      const { email, password } = req.body;
      const authorizedUser = await userService.signIn(email, password);
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.clearCookie();
      res.cookie('refreshToken', authorizedUser.tokens.refreshToken, {
          maxAge: ageRefreshToken,
          httpOnly: true
      });
      return res.status(200).send(JSON.stringify(authorizedUser.tokens.accessToken));
    } catch (err) {
      next(err);
    }
  }

  async logout (req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken', {httpOnly: true});
      console.log('refreshToken', req.cookies.refreshToken);
      return res.status(200).json({message: "OK"})
    } catch (err) {
      next(err);
    }
  }

  async getEmail (req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userEmail = await userService.gettingEmail(refreshToken);
      return res.status(200).send(JSON.stringify(userEmail));
    } catch (err) {
      next(err);
    }
  }

  async refresh (req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) {
        return res.status(403).send({ error: 'At first - try to login, please...' });
      }
      const newTokens = await userService.refresh(refreshToken);
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.clearCookie();
      res.cookie('refreshToken', newTokens.refreshToken, {
        maxAge: ageRefreshToken,
        httpOnly: true
      });
      res.json(newTokens.accessToken);
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new UserController();
