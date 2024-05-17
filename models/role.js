const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");

const Role = sequelize.define("Role", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});

Role.belongsTo(Tenant);
Tenant.hasMany(Role);
module.exports = Role;
