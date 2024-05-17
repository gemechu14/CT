const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')
const Company = require('./company.js')
const User=require("../models/Users.js");
const Role= require("../models/role.js")

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
 
})
User.belongsToMany(Role, {
  through: UserRole,
});
Role.belongsToMany(User, {
  through: UserRole,
});

module.exports = UserRole
