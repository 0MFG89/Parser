const Sequelize = require('sequelize');
const filmPreviews = require('./FilmPreviews');
const { users } = require('./');

module.exports = function (sequelize) {
   const FilmsDetails = sequelize.define("FilmsDetails", {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
      },

      filmId: {
         type: Sequelize.INTEGER,
         field: 'FilmPreviewId',
         references: {
            model: filmPreviews,
            key: 'id'
         },
         allowNull: false 
      },

      userId: {
         type: Sequelize.INTEGER,
         field: 'UserId',
         references: {
            model: users,
            key: 'id'
         },
         allowNull: false
      },

      isLiked: {
         type: Sequelize.BOOLEAN,
         allowNull: false
      },

      willWatch: {
         type: Sequelize.BOOLEAN,
         allowNull: false
      },

      rating: {
         type: Sequelize.INTEGER
      }
   }, {
      timestamps: false,
      modelName: 'FilmsDetails',
      defaultPrimaryKey: false
   });

   return FilmsDetails;
}