const sequelize = require("../database/db.js");
const { Sequelize, DataTypes } = require("sequelize");

const ScheduleCapacity = sequelize.define("ScheduleCapacity", {
  startHour: {
    type: DataTypes.STRING,
  },
  startMinute: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  period: { 
    type: DataTypes.ENUM('AM', 'PM'), 
    allowNull: false,
    defaultValue: 'AM',
  },
  durationHours: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0, 
  },
  durationMinutes: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0, // set default to 0
  },
  isEnabled: { // renamed from enabled
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = ScheduleCapacity;
