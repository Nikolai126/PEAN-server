const { user } = require('../db/models');
const tokenService = require('./token-service');
const ErrorApi = require('../exceptions/error-api');
const bcrypt = require('bcrypt');

class UserService {
  async signUp (signUpParams) {
    const modelUser = await user.create(signUpParams);
    return await tokenService.pushTokens(modelUser);
  }

  async signIn (email, password) {
    const authUser = await user.findOne({where: { email: `${email}` }});
    if (!authUser) {
      throw ErrorApi.BadRequest('User with such email is does not exist!');
    }
    const equalPass = await bcrypt.compare(password, authUser.password);
    if (!equalPass) {
      throw ErrorApi.BadRequest('Incorrect password!');
    }
    return await tokenService.pushTokens(authUser);
  }

  async emailExist (email) {
    return await user.findOne({where: { email: `${email}` }});
  }

  async logout (refreshToken) {
    const token = await tokenService.removingToken(refreshToken);
    return token;
  }

  async refresh (refreshToken) {
    if (!refreshToken) {
      throw ErrorApi.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      throw ErrorApi.UnauthorizedError();
    }
    const tokenInDb = tokenService.findTokenInDb(refreshToken);
    if (!tokenInDb) {
      throw ErrorApi.UnauthorizedError();
    }
    const checkUser = await user.findOne({where: {id: `${userData.id}`}});
    await tokenService.removingToken(refreshToken);
    return await tokenService.pushTokens(checkUser);
  }

  async gettingEmail (refreshToken) {
    const userData = await tokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      throw ErrorApi.UnauthorizedError();
    }
    return userData.email;
  }

  async getUserData (refreshToken) {
    const userEmail = await this.gettingEmail(refreshToken);
    return await user.findOne({where: { email: `${userEmail}` }});
  }

}

module.exports = new UserService();
