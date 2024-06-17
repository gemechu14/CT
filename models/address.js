const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const User = require("./Users.js");

const Address = sequelize.define("Address", {
  streetNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streetType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  postalCode: {
    type: DataTypes.STRING,
  },
});

module.exports = Address;

// User.hasOne(Address)
// Address.belongsTo(User)
// User.hasOne(Address);
// Address.belongsTo(User);