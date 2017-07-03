"use strict";
module.exports = function(sequelize, DataTypes) {
  var favorites = sequelize.define(
    "favorites",
    {
      trackId: {
        allowNull: false,
        unique: true,
        type: DataTypes.INTEGER
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  return favorites;
};
