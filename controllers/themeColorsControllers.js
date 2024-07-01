const createError = require("../utils/errorResponse.js");
const ThemeBranding = require("../models/themeBranding.js");
const ThemeColor = require("../models/themeColors.js");

// GET CURRENT TENANT THEME
exports.getCurrentThemeColors = async (req, res, next) => {
    try {

      const themeColor = await ThemeColor.findAll({
        where:{TenantId:req.user.currentTenant},
        attributes: { exclude: ["createdAt", "updatedAt"] },
        
   
         });
  
      return res.status(200).json(
        themeColor)
    
    } catch (error) {
      console.log(error)
      return next(createError.createError(500, "Internal server Error"));
    }

};


//CREATE THEME COLOR
exports.createThemeColor = async (req, res, next) => {
    try {
      const {
        brandPrimaryColor,
        sideNavigationPanelItemHighlight,
        sideNavigationFontHover,
        topNavigationPanelPrimary,
        reportPaneBackground,
        navigationArrowColor,
        sideNavigationHeaderFontColor,
        sideNavigationFontPrimary,
        buttonFaceColor,
        topNavigationPanelSecondary,
        contentPaneTitles,
        sideNavigationPanelPrimary,
        sideNavigationPanelSecondary,
        topNavatigationFont,
        paneNameCurrentPage,
        navigationBorderColor,
      } = req.body;
  
   
      const themeColor= await ThemeColor.findOne({
        where: {TenantId: req.user.currentTenant}
    })
    
    if(themeColor){
        return next(createError.createError(400,"Theme Color already created update it"))
    }


      // Create ThemeColor record
      const newThemeColor = await ThemeColor.create({
        brandPrimaryColor,
        sideNavigationPanelItemHighlight,
        sideNavigationFontHover,
        topNavigationPanelPrimary,
        reportPaneBackground,
        navigationArrowColor,
        sideNavigationHeaderFontColor,
        sideNavigationFontPrimary,
        buttonFaceColor,
        topNavigationPanelSecondary,
        contentPaneTitles,
        sideNavigationPanelPrimary,
        sideNavigationPanelSecondary,
        topNavatigationFont,
        paneNameCurrentPage,
        navigationBorderColor,
        TenantId: req.user.currentTenant
      });
  
      return res.status(201).json({ message: 'ThemeColor created successfully', themeColor: newThemeColor });
    } catch (error) {
      console.error('Error creating ThemeColor:', error);
      return next(createError.createError(500, 'Internal server error'));
    }
  };



  //UPDATE THEME COLOR
  exports.updateThemeColor = async (req, res, next) => {
    try {
      const {
        brandPrimaryColor,
        sideNavigationPanelItemHighlight,
        sideNavigationFontHover,
        topNavigationPanelPrimary,
        reportPaneBackground,
        navigationArrowColor,
        sideNavigationHeaderFontColor,
        sideNavigationFontPrimary,
        buttonFaceColor,
        topNavigationPanelSecondary,
        contentPaneTitles,
        sideNavigationPanelPrimary,
        sideNavigationPanelSecondary,
        topNavatigationFont,
        paneNameCurrentPage,
        navigationBorderColor,
      } = req.body;
  
      const themeColor= await ThemeColor.findOne({
        where: {TenantId: req.user.currentTenant}
    })
     
      if (!themeColor) {
       // Create ThemeColor record
       const newThemeColor = await ThemeColor.create({
        brandPrimaryColor,
        sideNavigationPanelItemHighlight,
        sideNavigationFontHover,
        topNavigationPanelPrimary,
        reportPaneBackground,
        navigationArrowColor,
        sideNavigationHeaderFontColor,
        sideNavigationFontPrimary,
        buttonFaceColor,
        topNavigationPanelSecondary,
        contentPaneTitles,
        sideNavigationPanelPrimary,
        sideNavigationPanelSecondary,
        topNavatigationFont,
        paneNameCurrentPage,
        navigationBorderColor,
        TenantId: req.user.currentTenant
      });
  
      return res.status(201).json({ message: 'ThemeColor created successfully', themeColor: newThemeColor });
      }
  
      // Create an object to hold the updates
      const updates = {};
  
      if (brandPrimaryColor){ updates.brandPrimaryColor = brandPrimaryColor};
      if (sideNavigationPanelItemHighlight ){ updates.sideNavigationPanelItemHighlight = sideNavigationPanelItemHighlight;}
      if (sideNavigationFontHover) {updates.sideNavigationFontHover = sideNavigationFontHover}
      if (topNavigationPanelPrimary) {updates.topNavigationPanelPrimary = topNavigationPanelPrimary;}
      if (reportPaneBackground ) updates.reportPaneBackground = reportPaneBackground;
      if (navigationArrowColor ) updates.navigationArrowColor = navigationArrowColor;
      if (sideNavigationHeaderFontColor ) updates.sideNavigationHeaderFontColor = sideNavigationHeaderFontColor;
      if (sideNavigationFontPrimary ) updates.sideNavigationFontPrimary = sideNavigationFontPrimary;
      if (buttonFaceColor ) updates.buttonFaceColor = buttonFaceColor;
      if (topNavigationPanelSecondary ) updates.topNavigationPanelSecondary = topNavigationPanelSecondary;
      if (contentPaneTitles ) updates.contentPaneTitles = contentPaneTitles;
      if (sideNavigationPanelPrimary ) updates.sideNavigationPanelPrimary = sideNavigationPanelPrimary;
      if (sideNavigationPanelSecondary ) updates.sideNavigationPanelSecondary = sideNavigationPanelSecondary;
      if (topNavatigationFont ) updates.topNavatigationFont = topNavatigationFont;
      if (paneNameCurrentPage ) updates.paneNameCurrentPage = paneNameCurrentPage;
      if (navigationBorderColor ) updates.navigationBorderColor = navigationBorderColor;
  
      updates.TenantId = req.user.currentTenant;
  
      // Update the ThemeColor record
      await themeColor.update(updates);
  
      return res.status(200).json({ message: 'ThemeColor updated successfully', themeColor });
    } catch (error) {
      console.error('Error updating ThemeColor:', error);
      return next(createError(500, 'Internal server error'));
    }
  }; 

  //RESET TO DEFAULT
  exports.resetThemeColor = async (req, res, next) => {
    try {
      
      const themeColor= await ThemeColor.findOne({
        where: {TenantId: req.user.currentTenant}
    })
     
      if (!themeColor) {
       // Create ThemeColor record
       const newThemeColor = await ThemeColor.create({
        brandPrimaryColor: "#FF00FF",
        sideNavigationPanelItemHighlight :"#FF00FF",
        sideNavigationFontHover :"#FF00FF",
        topNavigationPanelPrimary :"#FF00FF",
        reportPaneBackground:"#FF00FF",
        navigationArrowColor:"#FF00FF",
        sideNavigationHeaderFontColor:"#FF00FF",
        sideNavigationFontPrimary:"#FF00FF",
        buttonFaceColor:"#FF00FF",
        topNavigationPanelSecondary:"#FF00FF",
        contentPaneTitles:"#FF00FF",
        sideNavigationPanelPrimary:"#FF00FF",
        sideNavigationPanelSecondary:"#FF00FF",
        topNavatigationFont:"#FF00FF",
        paneNameCurrentPage:"#FF00FF",
        navigationBorderColor:"#FF00FF",
        TenantId: req.user.currentTenant
      });
  
      return res.status(201).json({ message: 'ThemeColor created successfully', newThemeColor });
      }
  

      // Update the ThemeColor record
      await themeColor.update({
        brandPrimaryColor: "#FF00FF",
        sideNavigationPanelItemHighlight :"#FF00FF",
        sideNavigationFontHover :"#FF00FF",
        topNavigationPanelPrimary :"#FF00FF",
        reportPaneBackground:"#FF00FF",
        navigationArrowColor:"#FF00FF",
        sideNavigationHeaderFontColor:"#FF00FF",
        sideNavigationFontPrimary:"#FF00FF",
        buttonFaceColor:"#FF00FF",
        topNavigationPanelSecondary:"#FF00FF",
        contentPaneTitles:"#FF00FF",
        sideNavigationPanelPrimary:"#FF00FF",
        sideNavigationPanelSecondary:"#FF00FF",
        topNavatigationFont:"#FF00FF",
        paneNameCurrentPage:"#FF00FF",
        navigationBorderColor:"#FF00FF",
      });
  
      return res.status(200).json({ message: 'ThemeColor Reseted successfully', themeColor });
    } catch (error) {
      console.error('Error updating ThemeColor:', error);
      return next(createError(500, 'Internal server error'));
    }
  }; 

