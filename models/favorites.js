'use strict';
module.exports = function(sequelize, DataTypes) {
  var favorites = sequelize.define('favorites', {
    trackId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return favorites;
};