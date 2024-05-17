const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");

const Permission = sequelize.define("Permission", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isSuperTenantPermission:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  }

});

Permission.belongsTo(Tenant);
Tenant.hasMany(Permission);


module.exports = Permission;
