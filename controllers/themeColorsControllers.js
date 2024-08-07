const createError = require("../utils/errorResponse.js");
const ThemeBranding = require("../models/themeBranding.js");
const ThemeColor = require("../models/themeColors.js");
const User = require("../models/Users.js");

// GET CURRENT TENANT THEME
exports.getCurrentThemeColors = async (req, res, next) => {
  try {
    const themeColor = await ThemeColor.findAll({
      where: { TenantId: req.user.currentTenant },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return res.status(200).json(themeColor);
  } catch (error) {
    console.log(error);
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

    const themeColor = await ThemeColor.findOne({
      where: { TenantId: req.user.currentTenant },
    });

    if (themeColor) {
      return next(
        createError.createError(400, "Theme Color already created update it")
      );
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
      TenantId: req.user.currentTenant,
    });

    return res
      .status(201)
      .json({
        message: "ThemeColor created successfully",
        themeColor: newThemeColor,
      });
  } catch (error) {
    console.error("Error creating ThemeColor:", error);
    return next(createError.createError(500, "Internal server error"));
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

    const user = await User.findByPk(Number(req.user.id));

    const themeColor = await ThemeColor.findOne({
      where: { TenantId: Number(user.currentTenant) },
    });

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
        TenantId: user.currentTenant,
      });

      return res
        .status(201)
        .json({
          message: "ThemeColor created successfully",
          themeColor: newThemeColor,
        });
    }

    // Create an object to hold the updates
    const updates = {};

    if (brandPrimaryColor) {
      updates.brandPrimaryColor = brandPrimaryColor;
    }
    if (sideNavigationPanelItemHighlight) {
      updates.sideNavigationPanelItemHighlight =
        sideNavigationPanelItemHighlight;
    }
    if (sideNavigationFontHover) {
      updates.sideNavigationFontHover = sideNavigationFontHover;
    }
    if (topNavigationPanelPrimary) {
      updates.topNavigationPanelPrimary = topNavigationPanelPrimary;
    }
    if (reportPaneBackground)
      updates.reportPaneBackground = reportPaneBackground;
    if (navigationArrowColor)
      updates.navigationArrowColor = navigationArrowColor;
    if (sideNavigationHeaderFontColor)
      updates.sideNavigationHeaderFontColor = sideNavigationHeaderFontColor;
    if (sideNavigationFontPrimary)
      updates.sideNavigationFontPrimary = sideNavigationFontPrimary;
    if (buttonFaceColor) updates.buttonFaceColor = buttonFaceColor;
    if (topNavigationPanelSecondary)
      updates.topNavigationPanelSecondary = topNavigationPanelSecondary;
    if (contentPaneTitles) updates.contentPaneTitles = contentPaneTitles;
    if (sideNavigationPanelPrimary)
      updates.sideNavigationPanelPrimary = sideNavigationPanelPrimary;
    if (sideNavigationPanelSecondary)
      updates.sideNavigationPanelSecondary = sideNavigationPanelSecondary;
    if (topNavatigationFont) updates.topNavatigationFont = topNavatigationFont;
    if (paneNameCurrentPage) updates.paneNameCurrentPage = paneNameCurrentPage;
    if (navigationBorderColor)
      updates.navigationBorderColor = navigationBorderColor;

    updates.TenantId = user.currentTenant;

    // Update the ThemeColor record
    await themeColor.update(updates);

    return res
      .status(200)
      .json({ message: "ThemeColor updated successfully", themeColor });
  } catch (error) {
    console.error("Error updating ThemeColor:", error);
    return next(createError(500, "Internal server error"));
  }
};

//RESET TO DEFAULT
exports.resetThemeColor = async (req, res, next) => {
  try {
    const user = await User.findByPk(Number(req.user.id));
    const themeColor = await ThemeColor.findOne({
      where: { TenantId: Number(user.currentTenant) },
    });

    if (!themeColor) {
      // Create ThemeColor record
      const newThemeColor = await ThemeColor.create({
        brandPrimaryColor: "#081C2E",
        sideNavigationPanelItemHighlight: "#F0F0F0",
        sideNavigationFontHover: "#C7C7C7",
        topNavigationPanelPrimary: "#ffffff",
        reportPaneBackground: "#FFFFFF",
        navigationArrowColor: "#D95558",
        sideNavigationHeaderFontColor: "#FFFFFF",
        sideNavigationFontPrimary: "#FFFFFF",
        buttonFaceColor: "#595959",
        topNavigationPanelSecondary: "#081C2E",
        contentPaneTitles: "#D95558",
        sideNavigationPanelPrimary: "#081C2E",
        sideNavigationPanelSecondary: "#D95558",
        topNavatigationFont: "#403A3A",
        paneNameCurrentPage: "#F3F4F6",
        navigationBorderColor: "#D95558",
        TenantId: user.currentTenant,
      });

      return res
        .status(201)
        .json({ message: "ThemeColor created successfully", newThemeColor });
    }

    // Update the ThemeColor record
    await themeColor.update({
      brandPrimaryColor: "#081C2E",
      sideNavigationPanelItemHighlight: "#F0F0F0",
      sideNavigationFontHover: "#C7C7C7",
      topNavigationPanelPrimary: "#ffffff",
      reportPaneBackground: "#FFFFFF",
      navigationArrowColor: "#D95558",
      sideNavigationHeaderFontColor: "#FFFFFF",
      sideNavigationFontPrimary: "#FFFFFF",
      buttonFaceColor: "#595959",
      topNavigationPanelSecondary: "#081C2E",
      contentPaneTitles: "#D95558",
      sideNavigationPanelPrimary: "#081C2E",
      sideNavigationPanelSecondary: "#D95558",
      topNavatigationFont: "#403A3A",
      paneNameCurrentPage: "#F3F4F6",
      navigationBorderColor: "#D95558",
      TenantId: user.currentTenant,
    });

    return res
      .status(200)
      .json({ message: "ThemeColor Reseted successfully", themeColor });
  } catch (error) {
    console.error("Error updating ThemeColor:", error);
    return next(createError(500, "Internal server error"));
  }
};
