"use strict";
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define(
    "users",
    {
      userName: {
        allowNull: false,
        type: DataTypes.STRING
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
  return users;
};
