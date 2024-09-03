const Sequelize = require('sequelize');

const sequelize = new Sequelize(
   process.env.DB, 
   process.env.USER, 
   process.env.PASSWORD, {
      dialect: 'mysql',
      host: process.env.HOST,
      logging: false
});

// Models

const FilmsDetails = require('./FilmsDetails')(sequelize);
const FilmPreviews = require('./FilmPreviews')(sequelize);
const Users = require('./Users')(sequelize);
const FilmDescribtions = require('./FilmDescribtions')(sequelize);

// Associations

FilmPreviews.hasMany(FilmsDetails, {as: 'details'});
FilmsDetails.belongsTo(FilmPreviews);
Users.hasMany(FilmsDetails);
FilmsDetails.belongsTo(Users);

FilmPreviews.hasOne(FilmDescribtions, {as: 'describtion'});
FilmDescribtions.belongsTo(FilmPreviews);


module.exports = {
   sequelize,
   users: Users,
   filmsDetails: FilmsDetails,
   filmPreviews: FilmPreviews,
   filmDescribtions: FilmDescribtions,
}