const Sequelize = require('sequelize');

module.exports = function (sequelize) {
   const FilmPreviews = sequelize.define("FilmPreviews", {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
      },

      img: {
         type: Sequelize.STRING,
         allowNull: false
      },

      name: {
         type: Sequelize.STRING,
         allowNull: false
      },

      genre: {
         type: Sequelize.STRING,
         allowNull: false
      },

      year: {
         type: Sequelize.STRING,
         allowNull: false
      }
   }, {
      timestamps: false,
      modelName: 'FilmPreviews'
   });

   return FilmPreviews;
}