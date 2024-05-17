const { DataTypes } = require('sequelize')
const sequelize = require('../database/db');
const User = require('./Users.js');
const Tenant=require("./tenant.js");

const UserTenant = sequelize.define('UserTenant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
 
})
User.belongsToMany(Tenant, {
  through: UserTenant,
});
Tenant.belongsToMany(User, {
  through: UserTenant,
});

module.exports = UserTenant
