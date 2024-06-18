const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const bcrypt = require("bcrypt");
const Address = require("./address.js");
const Role= require("./role.js")

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth:{
    type: DataTypes.DATE,
    allowNull: false,
  },

  isSuperTenant:{
    type:DataTypes.BOOLEAN,
    defaultValue: false
  },
  defaultTenant:{
    type: DataTypes.STRING,
  },
  currentTenant:{
    type: DataTypes.STRING,
  },
  isLoggedIn:{
    type:DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_active_at:{
    type: DataTypes.DATE,
  }
  
});

User.beforeCreate((user, options) => {
  const saltRounds = 10;
  return bcrypt
    .hash(user.password, saltRounds)
    .then((hash) => {
      user.password = hash;
    })
    .catch((err) => {
      throw new Error(err);
    });
});

User.beforeUpdate((user, options) => {
  if (user.changed("password")) {
    const saltRounds = 10;
    return bcrypt
      .hash(user.password, saltRounds)
      .then((hash) => {
        user.password = hash;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
});

module.exports = User;


User.hasOne(Address);
Address.belongsTo(User)

Role.hasMany(User);
User.belongsTo(Role);

// User.hasOne(Role);
// Role.belongsTo(User);


