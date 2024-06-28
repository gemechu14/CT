const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");
const User = require("./Users.js");

const Themes = sequelize.define("Themes", {
  logoImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  siteFaviconImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customLoader: {
    type: DataTypes.STRING,
    // allowNull: true,
  },

  layout: {
    type: DataTypes.ENUM("Classic", "Modern"),
    // allowNull: true,
  },

  showFooter:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  secondaryLogoImage:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  externalLinks:{
    type: DataTypes.STRING,
    allowNull: true,
  },

  //COLORS

  brandPrimaryColor:{
    type: DataTypes.STRING,
  },
  sideNavigationPanelItemHighlight:{
    type: DataTypes.STRING,
  },
  sideNavigationFontHover:{
    type: DataTypes.STRING,
  },
  topNavigationPanelPrimary:{
    type: DataTypes.STRING,
  },
  reportPaneBackground:{
    type: DataTypes.STRING,
  },


  navigationArrowColor:{
    type: DataTypes.STRING
  },
///


  sideNavigationHeaderFontColor:{
    type: DataTypes.STRING,
  },
  sideNavigationFontPrimary:{
    type: DataTypes.STRING,
  },
  
  
  buttonFaceColor:{
    type: DataTypes.STRING,
  },


  topNavigationPanelSecondary:{
    type: DataTypes.STRING,
  },
  contentPaneTitles:{
    type: DataTypes.STRING,
  },

////


  sideNavigationPanelPrimary:{
    type: DataTypes.STRING,
  },
  sideNavigationPanelSecondary:{
    type: DataTypes.STRING,
  },
  topNavatigationFont:{
    type: DataTypes.STRING,
  }, paneNameCurrentPage:{
  type: DataTypes.STRING,
},
navigationBorderColor:{
  type: DataTypes.STRING,
},





});



module.exports = Themes;


Themes.belongsTo(Themes);
Tenant.hasOne(Themes);