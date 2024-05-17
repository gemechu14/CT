const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const bcrypt = require("bcrypt");

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
