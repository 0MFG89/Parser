const jwt = require('jsonwebtoken');
const mysql = require("mysql2/promise.js");

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
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      const sqls = {
         sqlFindToken: `SELECT * FROM user_refresh_tokens WHERE user_id=${userId}`,
         updateRefreshToken: `UPDATE user_refresh_tokens SET refresh_token="${refreshToken}" WHERE user_id=${userId}`,
         createRefreshToken: `INSERT INTO user_refresh_tokens (user_id, refresh_token) VALUES (${userId}, "${refreshToken}")`
      }
      
      const [ tokenData ] = await dbConnection.execute(sqls.sqlFindToken);

      if (tokenData.length) return await dbConnection.execute(sqls.updateRefreshToken); 

      return await dbConnection.execute(sqls.createRefreshToken);
      
   }

   async findToken(refreshToken) {
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      const sqls = {
         findToken: `SELECT * FROM user_refresh_tokens WHERE refresh_token="${refreshToken}"`
      }
      const tokenData =  await dbConnection.execute(sqls.findToken);
      dbConnection.end();
      return tokenData[0];
   }

   async removeToken(refreshToken) {
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      const sqls = {
         deleteToken: `DELETE FROM user_refresh_tokens WHERE refresh_token="${refreshToken}"`
      }
      const [ tokenData ] =  await dbConnection.execute(sqls.deleteToken);
      dbConnection.end();
      return tokenData[0];
   }
}

module.exports = new TokenService();