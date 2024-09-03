const jwt = require('jsonwebtoken');
const mysql = require("mysql2/promise.js");
const { refreshTokens } = require('../models');

class TokenService {
   generateTokens(payload) {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '5m'});
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
      return {
         accessToken,
         refreshToken
      }
   }

   validateAccessToken(token) {
      try {
         const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
         return userData;
      } catch(e) {
         return null;
      }
   }

   validateRefreshToken(token) {
      try {
         const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
         return userData;
      } catch(e) {
         return null;
      }
   }

   async saveToken(userId, refreshToken) {
      const tokenData = await refreshTokens.findOne({
         where: {
            userId: userId
         }
      });

      if (tokenData) {
         tokenData.refreshToken = refreshToken;
         return await tokenData.save();
      }
      
      const rToken = refreshTokens.build({
         userId: userId,
         refreshToken: refreshToken
      });

      return await rToken.save();
      
   }

   async findToken(refreshToken) {
      const tokenData =  await refreshTokens.findOne({
         where: {
            refreshToken: refreshToken
         }
      });
      return tokenData;
   }

   async removeToken(refreshToken) {
      return await refreshTokens.destroy({
         where: {
            refreshToken: refreshToken
         }
      });
   }
}

module.exports = new TokenService();