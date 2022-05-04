const { token } = require('../db/models');
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET, JWT_REFRESH_KEY } = require('../config/constants');
const UserDto = require('../dtos/user-dto');

class TokenService {
  validateAccessToken (token) {
    try {
      const userData = jwt.verify(token, JWT_ACCESS_SECRET);
      return userData;
    } catch (err) {
      return null;
    }
  }

  validateRefreshToken (token) {
    try {
      const userData = jwt.verify(token, JWT_REFRESH_KEY);
      return userData;
    } catch (err) {
      return null;
    }
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, JWT_REFRESH_KEY, {expiresIn: '30d'});
    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const [userToken] = await token.findOrCreate({ where: { user_id: `${userId}` }, defaults: { value: 'undefined' }});
    if(userToken) {
      userToken.value = refreshToken;
      return await userToken.save();
    }
  }

  async pushTokens (modelUser) {
    const userDto = new UserDto(modelUser);

    const tokens = this.generateTokens({...userDto});
    await this.saveToken(userDto.id, tokens.refreshToken);

    return { tokens };
  }

  async removingToken (refreshToken) {
    const removeToken = await token.destroy({where: {value: `${refreshToken}`}});
    return removeToken;
  }

  async findTokenInDb (refreshToken) {
    const tokenData = await token.findOne({where: {value: `${refreshToken}`}});
    return tokenData.value;
  }
}

module.exports = new TokenService();
