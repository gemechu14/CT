const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");
const User = require("./Users.js");

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

// Role.belongsTo(Tenant);
// Tenant.hasMany(Role);



Role.hasMany(User);
User.belongsTo(Role);




module.exports = Role;
