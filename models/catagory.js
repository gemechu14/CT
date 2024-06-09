const sequelize = require("../database/db.js");
const { Sequelize, DataTypes } = require("sequelize");
const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SortOrder: {
    type: DataTypes.STRING,
  },

});


module.exports = Category;
