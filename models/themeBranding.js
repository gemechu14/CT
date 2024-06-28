const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");
const User = require("./Users.js");

const ThemeBranding = sequelize.define("ThemeBranding", {
  logoImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  siteFaviconImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customLoader: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  loginLogoutBackground:{
    type: DataTypes.STRING,
  },
  showFooter:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  secondaryLogoImage:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  externalLinks:{
    type: DataTypes.STRING,
    allowNull: true,
  },


});



module.exports = ThemeBranding;


ThemeBranding.belongsTo(Tenant);
Tenant.hasOne(ThemeBranding);