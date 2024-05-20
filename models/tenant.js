const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const bcrypt = require("bcrypt");
const Address = require("./address.js");

const Tenant = sequelize.define("Tenant", {
  tenantName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tenantStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isSuperTenant:{
    type: DataTypes.BOOLEAN,
   defaultValue: false
  },
  isActive:{
    type: DataTypes.BOOLEAN,
    defaultValue:true
  }

});




module.exports = Tenant;

Tenant.hasOne(Address);
Address.belongsTo(Tenant);