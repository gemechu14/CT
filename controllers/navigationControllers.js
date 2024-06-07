const { Certificate } = require("crypto");
const NavigationContent = require("../models/navigationContent.js");
const { create } = require("domain");
const sequelize = require("../database/db");
const createError = require("../utils/errorResponse.js");



// GET ALL NAVIGATION
exports.getAllNavigation = async (req, res, next) => {
  try {
    const navigationContent = await NavigationContent.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });



    return res.status(200).json(navigationContent);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};


// GET NAVIGATION BY ID
exports.getNavigationById = async (req, res, next) => {
  try {

    const id = req?.params?.id;
   if(!id){
    return next(createError.createError(404,"Id not found"))
   }
    const navigationContent = await NavigationContent.findByPk(1);


    return res.status(200).json(navigationContent);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

// CREATE NAVIGATION
exports.createNavigation = async (req, res, next) => {
  try {
     const {
      // CreatedBy,
      NavigationSetupId,
      OrganisationId,
      Type,
      IsRls,
      Title,
      Parent,
      PageType,
      ReportType,
      ReportDatasetId,
      Toggler,
      Icon,
      Description,
      PowerBiWorkspace,
      DisplayUseDynamicBinding,
      DynamicDataSetid,
      ReportPages,
      ShowFilter,
      ShowContentPane,
      HideTitleAnddescription,
      HideTitleSection,
      ShowSharingButton,
      ShowExportButton,
      SortOrder,
      __RequestVerificationToken,
      EmbedUrl,
      NavSecurity
    } = req.body;



    const existingTitle = await NavigationContent.findOne({ where: { Title } });
    if (existingTitle) {
      return next(createError.createError(400, "Navigation Title already defined"));
    }


 
    const newNavigation = await NavigationContent.create({
      CreatedBy:req.user.id,
      NavigationSetupId,
      OrganisationId,
      Title,
      Parent,
      Type,
      IsRls,
      PageType,
      ReportType,
      ReportDatasetId,
      Toggler,
      Icon,
      Description,
      PowerBiWorkspace,
      DisplayUseDynamicBinding,
      DynamicDataSetid,
      ReportPages,
      ShowFilter,
      ShowContentPane,
      HideTitleAnddescription,
      HideTitleSection,
      ShowSharingButton,
      ShowExportButton,
      SortOrder,
      __RequestVerificationToken,
      EmbedUrl,
      NavSecurity
    });

    res
      .status(201)
      .json({ message: "Navigation registered successfully", navigation: newNavigation });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};


exports.deleteNavigation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const navigation = await NavigationContent.findOne({ where: { id: id } });
    if (!navigation) {
      return next(createError.createError(404, "Category not found"));
    }
    await navigation.destroy({ where: { id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};
