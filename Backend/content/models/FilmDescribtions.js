const Sequelize = require('sequelize');
const { filmPreviews } = require('.');

module.exports = function (sequelize) {
   const FilmDescribtions = sequelize.define("FilmDescribtions", {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         field: 'describtionId',
         references: {
            model: filmPreviews,
            key: 'id'
         }
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

      about: {
         type: Sequelize.TEXT,
         allowNull: false
      },

      duration: {
         type: Sequelize.STRING,
         allowNull: false
      },

      year: {
         type: Sequelize.STRING,
         allowNull: false
      },

      age: {
         type: Sequelize.STRING,
         allowNull: false
      },

      FilmPreviewId: {
         type: Sequelize.INTEGER,
         allowNull: false
      }
   }, {
      timestamps: false,
      modelName: 'FilmPreviews'
   });

   return FilmDescribtions;
}