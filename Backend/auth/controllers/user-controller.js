const userService = require('../services/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-errors');

class UserController {
   async registration (req, res, next) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
         }
         const { email, password, repeatPassword } = req.body;
         if (password !== repeatPassword) {
            return next(ApiError.BadRequest('Пароли не совпадают'))
         }
         const userData = await userService.registration(email, password);
         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
         return res.json(userData);
      } catch (e) {
         next(e);
      }
   }

   async login (req, res, next) {
      try {
         const { email, password } = req.body;
         const userData = await userService.login(email, password);
         res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
         return res.json(userData);
      } catch (e) {
         next(e);
      }
   }

   async logout (req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         const token = await userService.logout(refreshToken);
         res.clearCookie('refreshToken');
         return res.json(token);
      } catch (e) {
         next(e);
      }
   }

   async activation (req, res, next) {
      try {
         const activationLink = req.params.link;
         userService.activate(activationLink);
         return res.redirect(process.env.CLIENT_URL);
      } catch (e) {
         next(e);
      }
   }

   async refresh (req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         const userData = await userService.refresh(refreshToken);
         res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
         return res.json(userData);
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new UserController();