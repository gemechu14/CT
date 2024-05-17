const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')
const Company = require('./company.js')
const Permission=require("../models/permission.js")
const Role= require("../models/role.js")

const RolePermission = sequelize.define('RolePermission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
 
})
Permission.belongsToMany(Role, {
  through: RolePermission,
});
Role.belongsToMany(Permission, {
  through: RolePermission,
});

module.exports = RolePermission
