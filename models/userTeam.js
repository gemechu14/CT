const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')
const User=require("../models/Users.js");
const Teams= require("../models/teams.js")

const UserTeam = sequelize.define('UserTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
 
})
User.belongsToMany(Teams, {
  through: UserTeam,
});
Teams.belongsToMany(User, {
  through: UserTeam,
});

module.exports = UserTeam
  