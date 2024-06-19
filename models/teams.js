const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");
const User = require("./Users.js");

const Team = sequelize.define("Team", {
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    // allowNull: false,
  },

});

Team.belongsTo(Tenant);
Tenant.hasMany(Team);


module.exports = Team;
