const mysql = require("mysql2/promise.js");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-errors');

class UserService {
   async registration(email, password) {
      const hashPassword = await bcrypt.hash(password, 3);
      const activationLink = uuid.v4();
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      const sqls = {
         sqlCandidate: `SELECT * FROM Users WHERE email="${email}"`,
         sqlInsertUser: `INSERT INTO Users (email, pass, isActivated, activationLink) VALUES ("${email}", "${hashPassword}", false, "${activationLink}")`
      }
      let [ candidate ] = await dbConnection.execute(sqls.sqlCandidate);
      if (candidate.length) throw ApiError.BadRequest(`Пользователь с email ${email} уже существует`);
      const insertUser = await dbConnection.execute(sqls.sqlInsertUser);
      
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
      const [ user ] = await dbConnection.execute(sqls.sqlCandidate);
      const userDto = new UserDto(user[0]);
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, tokens.refreshToken, dbConnection);
      dbConnection.end();
      return {
         ...tokens,
         user: userDto
      }
   }

   async activation(activationLink) {
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      const [ user ] = await dbConnection.execute(`SELECT * FROM Users WHERE activationLink="${activationLink}"`);
      if (!user.length) throw new ApiError.BadRequest('Неккоректная ссылка активации');
      await dbConnection.execute(`UPDATE Users SET isActivated=true WHERE activationLink="${activationLink}"`);
      dbConnection.end();
   }

   async login(email, password) {
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      const [ user ] = await dbConnection.execute(`SELECT * FROM Users WHERE email="${email}"`);
      if (!user.length) throw ApiError.BadRequest('Пользователь не был найден');
      const isPassEquals = await bcrypt.compare(password, user[0].pass);
      if (!isPassEquals) throw ApiError.BadRequest('Некорректный пароль');
      const userDto = new UserDto(user[0]);
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, tokens.refreshToken, dbConnection);
      dbConnection.end();
      return {...tokens, userDto};
   }

   async logout(refreshToken) {
      const token = await tokenService.removeToken(refreshToken);
      return token;
   }

   async refresh(refreshToken) {
      if (!refreshToken) {
         throw ApiError.UnauthorizedError();
      }
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      const userData = tokenService.validateRefreshToken(refreshToken);
      const [ tokenDb ] = await tokenService.findToken(refreshToken);
      if(!userData || !tokenDb) throw ApiError.UnauthorizedError();
      const [ user ] = await dbConnection.execute(`SELECT * FROM Users WHERE id=${userData.id}`);
      const userDto = new UserDto(user[0]);
      const tokens = tokenService.generateTokens({...userDto});
      
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      dbConnection.end();
      return {...tokens, userDto};
   }
}

module.exports = new UserService();