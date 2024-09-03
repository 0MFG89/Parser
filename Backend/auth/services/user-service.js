const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-errors');
const { users } = require('../models');

class UserService {
   async registration(email, password) {
      const hashPassword = await bcrypt.hash(password, 3);
      const activationLink = uuid.v4();
      let candidate = await users.findOne({
         where: {
            email: email
         }
      });
      if (candidate) throw ApiError.BadRequest(`Пользователь с email ${email} уже существует`);
      const newUser = await users.build({
         email: email,
         pass: hashPassword,
         isActivated: false,
         activationLink: activationLink
      });
      await newUser.save();
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
      const user = await users.findOne({
         where: {
            email: email
         }
      });
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {
         ...tokens,
         user: userDto
      }
   }

   async activation(activationLink) {
      const user = await users.findOne({
         where: {
            activationLink: activationLink
         }
      });
      if (!user) throw new ApiError.BadRequest('Неккоректная ссылка активации');
      user.isActivated = true;
      await user.save();
   }

   async login(email, password) {
      const user = await users.findOne({
         where: {
            email: email
         }
      });
      if (!user) throw ApiError.BadRequest('Пользователь не был найден');
      const isPassEquals = await bcrypt.compare(password, user.pass);
      if (!isPassEquals) throw ApiError.BadRequest('Некорректный пароль');
      const isActivated = user.isActivated;
      if (!isActivated) throw ApiError.BadRequest('Аккаунт пользователя не активирован');
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
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
      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenDb = await tokenService.findToken(refreshToken);
      if(!userData || !tokenDb) throw ApiError.UnauthorizedError();
      const user = await users.findOne({
         where: {
            id: userData.id
         }
      });
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {...tokens, userDto};
   }
}

module.exports = new UserService();