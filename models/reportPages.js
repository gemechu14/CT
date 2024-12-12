const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");

const ReportPages = sequelize.define("ReportPages", {
  name: {
    type: DataTypes.STRING,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
});

module.exports = ReportPages;
