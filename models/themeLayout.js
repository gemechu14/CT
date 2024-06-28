const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");
const User = require("./Users.js");

const ThemeLayout = sequelize.define("ThemeLayout", {
    layout: {
        type: DataTypes.ENUM("Classic", "Modern","Minimal"),
        defaultValue:'Classic'
        // allowNull: true,
      },


});



module.exports = ThemeLayout;


ThemeLayout.belongsTo(Tenant);
Tenant.hasOne(ThemeLayout);