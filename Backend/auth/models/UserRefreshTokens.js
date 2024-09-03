const Sequelize = require('sequelize');
const { users } = require('./');

module.exports = function (sequelize) {
   return sequelize.define('UserRefreshTokens', {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
      },

      userId: {
         type: Sequelize.INTEGER,
         field: 'UserId',
         allowNull: false,
         references: {
            model: users,
            key: 'id'
         }
      },

      refreshToken: {
         type: Sequelize.TEXT,
         allowNull: false
      }
   }, {
      timestamps: false
   });
}