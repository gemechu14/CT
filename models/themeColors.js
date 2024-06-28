const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const Tenant = require("./tenant.js");
const User = require("./Users.js");

const ThemeColor = sequelize.define("ThemeColor", {
  
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
      }, 
      paneNameCurrentPage:{
      type: DataTypes.STRING,
    },
    navigationBorderColor:{
      type: DataTypes.STRING,
    },
    


});



module.exports = ThemeColor;


ThemeColor.belongsTo(Tenant);
Tenant.hasOne(ThemeColor);