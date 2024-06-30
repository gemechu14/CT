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
  CanEdit:{
    type: DataTypes.BOOLEAN,
    defaultValue:true
  },
  RolesValidation:{
    type: DataTypes.STRING,
  }
  
})
NavigationContent.belongsToMany(Teams, {
  through: ReportTeam,
});
Teams.belongsToMany(NavigationContent, {
  through: ReportTeam,
});

module.exports = ReportTeam;
  