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
  },
  language: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  numberOfTeams: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  numberOfUsers: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  powerBIWorkspace: {
    type: DataTypes.JSON, // Use JSON or JSONB
    // allowNull: false,
    defaultValue: [],
    get() {
      const rawValue = this.getDataValue('powerBIWorkspace');
      return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
    }
  }
  // powerBIWorkspace: {
  //   type: DataTypes.JSONB,
  //   // allowNull: true // or false, depending on your requirements
  // },
  // powerBIWorkspace: {
  //   type: DataTypes.JSON, // Use JSON or JSONB
  //   // allowNull: false,
  //   defaultValue: [],
  //   get() {
  //     const rawValue = this.getDataValue('powerBIWorkspace');
  //     return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
  //   }
  // }

});




module.exports = Tenant;

Tenant.hasOne(Address);
Address.belongsTo(Tenant);