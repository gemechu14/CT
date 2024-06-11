const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')
const NavigationContent=require("../models/navigationContent.js");
const Teams= require("../models/teams.js")

const ReportTeam = sequelize.define('ReportTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
 
})
NavigationContent.belongsToMany(Teams, {
  through: ReportTeam,
});
Teams.belongsToMany(NavigationContent, {
  through: ReportTeam,
});

module.exports = ReportTeam;
  