const Sequelize = require('sequelize');

module.exports = function (sequelize) {
   return sequelize.define("Users", {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
      }, 

      email: {
         type: Sequelize.STRING,
         allowNull: false
      },

      pass: {
         type: Sequelize.STRING,
         allowNull: false
      },

      isActivated: {
         type: Sequelize.BOOLEAN,
         allowNull: false
      },

      activationLink: {
         type: Sequelize.TEXT,
         allowNull: false
      }
   }, {
      timestamps: false
   })
}