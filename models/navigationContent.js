
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");

const NavigationContent = sequelize.define("NavigationContent", {
  CreatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  NavigationSetupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  OrganisationId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Type: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  IsRls: {
    type: DataTypes.STRING,
  },
  PageType: {
    type: DataTypes.STRING,
  },
  ReportType: {
    type: DataTypes.STRING,
  },
  
  ReportDatasetId: {
    type: DataTypes.STRING,
  },
  Toggler: {
    type: DataTypes.STRING,
  },

  Icon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
 Description: {
    type: DataTypes.STRING,
  },
  
  PowerBiWorkspace: {
    type: DataTypes.STRING,
  },
  //BOOLEAN
  DisplayUseDynamicBinding: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },


  ///

  DynamicDataSetid: {
    type: DataTypes.STRING,
  },
  ReportPages: {
    type: DataTypes.STRING,
  },
  ShowFilter: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },

  ShowContentPane: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  HideTitleAnddescription: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },

  HideTitleSection: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  ShowSharingButton: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  ShowExportButton: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  
//   navSecurity: [
//     {
//         "Id": { type: DataTypes.BOOLEAN,},
//         // "GroupId": 10,
//         // "CanEdit": false,
//         // "RolesValidation": ""
//     }
// ],

  
  SortOrder: {
    type: DataTypes.STRING,
  },
  //BOOLEAN
  __RequestVerificationToken: {
    type: DataTypes.STRING,
  },
  embedUrl:{
    type: DataTypes.STRING
  }
});

module.exports = NavigationContent;




