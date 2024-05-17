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
  }

});




module.exports = Tenant;
