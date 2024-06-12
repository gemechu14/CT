const { Certificate } = require("crypto");
const NavigationContent = require("../models/navigationContent.js");
const { create } = require("domain");
const sequelize = require("../database/db");
const createError = require("../utils/errorResponse.js");
const User = require("../models/Users.js");
const Tenant = require("../models/tenant.js");



// GET ALL NAVIGATION
exports.getAllNavigation = async (req, res, next) => {
  try {

    const user= await User.findByPk(req.user.id)

    
    const navigationContent = await NavigationContent.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where:{
        TenantId: user.currentTenant
      }
    },
);



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

    const navigationContent = await NavigationContent.findOne({where:{id:id}});


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
      PagePath,
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
      NavSecurity,
      type,

    } = req.body;

    const user= await User.findByPk(req.user.id)

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
      PagePath,
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
      NavSecurity,
      type,
      TenantId: user.currentTenant
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


//BULK UPDATE


//BULK UPDATE
exports.bulkUpdateNavigation = async (req, res, next) => {
  try {
    const sortOrderUpdates = req.body; // Assumes array of objects in request body
    // Validate input
    if (!sortOrderUpdates || !Array.isArray(sortOrderUpdates)) {
      return next(createError.createError(400, "Invalid input format"));
    }

    // Extract category IDs
    const categoryIds = sortOrderUpdates.map(update => update.id);

    // Fetch categories
    const categories = await NavigationContent.findAll({ where: { id: categoryIds } });

    // Validate categories
    if (!categories || categories.length === 0) {
      return next(createError.createError(404, "Navigation not found"));
    }

    // Perform bulk update
    const updatePromises = sortOrderUpdates.map(async update => {
      const category = categories.find(cat => cat.id === update.id);
      if (category) {
        return category.update({ SortOrder: update.sortOrder });
      }
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: "Bulk update successful" });
  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal server error"));
  }
};