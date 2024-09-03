const Sequelize = require('sequelize');

const sequelize = new Sequelize(
   process.env.DB, 
   process.env.USER, 
   process.env.PASSWORD, {
      dialect: 'mysql',
      host: process.env.HOST,
      logging: false
   }
)

// Models
const Users = require('./Users')(sequelize);
const UserRefreshTokens = require('./UserRefreshTokens')(sequelize);

module.exports = {
   sequelize,
   users: Users,
   refreshTokens: UserRefreshTokens
}