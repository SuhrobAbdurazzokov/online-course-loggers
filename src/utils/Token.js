import config from "../config/index.js";
import jwt from "jsonwebtoken";

class Token {
  generateAccessToken(payload) {
    return jwt.sign(payload, config.TOKEN.ACCESS_TOKEN_KEY, {
      expiresIn: config.TOKEN.ACCESS_TOKEN_TIME,
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, config.TOKEN.REFRESH_TOKEN_KEY, {
      expiresIn: config.TOKEN.REFRESH_TOKEN_TIME,
    });
  }

  writeToCookie(res, key, value, expireDay) {
    res.cookie(key, value, {
      httpOnly: true,
      secure: true,
      maxAge: Number(expireDay) * 24 * 60 * 60 * 1000,
    });
  }

  verifyToken(token, secretKey) {
    return jwt.verify(token, secretKey);
  }
}

export default new Token();
