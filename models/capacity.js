const sequelize = require("../database/db.js");
const { Sequelize, DataTypes } = require("sequelize");
const Capacity = sequelize.define("Capacity", {
 
  selectedCapacity: {
    type: DataTypes.STRING,
  },
  embeddedTimeout: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

});


module.exports = Capacity;
