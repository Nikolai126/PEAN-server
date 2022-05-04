require('dotenv').config();

module.exports = {
  port: process.env.PORT_SERVER,
  portFrontEnd: process.env.PORT_FRONTEND,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
  expiresIn: process.env.EXPIRES_IN,
  ageRefreshToken: process.env.AGE_REFRESH_TOKEN,
}
