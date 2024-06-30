const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");
const User = require("./Users.js");

const ThemeFont = sequelize.define("ThemeFont", {
    fontFamily: {
        type: DataTypes.STRING,
        defaultValue:'Times New Roman'
        // allowNull: true,
      },
      fontSize:{
        type: DataTypes.STRING,
      }


});



module.exports = ThemeFont;


ThemeFont.belongsTo(Tenant);
Tenant.hasOne(ThemeFont);