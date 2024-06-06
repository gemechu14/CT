
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");

const NavigationContent = sequelize.define("NavigationContent", {
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  navigationSetupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organisationId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isRls: {
    type: DataTypes.STRING,
  },
  pageType: {
    type: DataTypes.STRING,
  },
  reportType: {
    type: DataTypes.STRING,
  },
  
  reportDatasetId: {
    type: DataTypes.STRING,
  },
  toggler: {
    type: DataTypes.STRING,
  },

  icon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
 description: {
    type: DataTypes.STRING,
  },
  

  powerBiWorkspace: {
    type: DataTypes.STRING,
  },
  //BOOLEAN
  displayUseDynamicBinding: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },


  ///

  dynamicDataSetid: {
    type: DataTypes.STRING,
  },
  reportPages: {
    type: DataTypes.STRING,
  },
  showFilter: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },

  showContentPane: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  hideTitleAnddescription: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },

  hideTitleSection: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  showSharingButton: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  showExportButton: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  
  NavSecurity: [{
    type: DataTypes.STRING,
  }],
  SortOrder: {
    type: DataTypes.STRING,
  },
  //BOOLEAN
  __RequestVerificationToken: {
    type: DataTypes.STRING,
  },
});

module.exports = NavigationContent;




