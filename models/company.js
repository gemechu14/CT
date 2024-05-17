const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");

const Company = sequelize.define("Company", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfEmployees: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["pending", "active", "blocked", "denied"],
    defaultValue: "pending",
  },
  organizationName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Organization name cannot be null.',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "#FFF",
  },
  companyLogo: {
    type: DataTypes.STRING,
  },

  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },

 
   companyCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: "Ethiopia",
  },
  header: {
    type: DataTypes.STRING,
  },
  footer: {
    type: DataTypes.STRING,
  },
  //NEW CHANGE
  companyBanner: {
    type: DataTypes.STRING,
  },
  primary_Color: {
    type: DataTypes.STRING,
    defaultValue:'#1234'
  },
  primary_Font_Color: {
    type: DataTypes.STRING,
    defaultValue:'123456'
  },
  primary_Gradient_Color: {
    type: DataTypes.STRING,
    defaultValue:'#fff'
  },
  secondary_Color: {
    type: DataTypes.STRING,
    defaultValue:'#fff'
  },
  secondary_Font_Color: {
    type: DataTypes.STRING,
    defaultValue:'#fff'
  },
  secondary_Gradient_Color: {
    type: DataTypes.STRING,
    defaultValue:'#fff'
  },
  social_Media_Images: {
    type: DataTypes.BOOLEAN,

    defaultValue: false,
  },
  region_or_City: {
    type: DataTypes.STRING,
  },
  fax: {
    type: DataTypes.STRING,
  },
  address_Street: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.STRING,
  },


  
});



// Company.sync({ force: true }).then(() => console.log('Company model is ready'));
module.exports = Company;
