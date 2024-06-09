const { Certificate } = require("crypto");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const RolePermission = require("../models/rolePermission.js");
const createError = require("../utils/errorResponse.js");
const { create } = require("domain");
const User = require("../models/Users.js");
const UserRole = require("../models/userRole.js");
const sequelize = require('../database/db');
const { use } = require("../routes/userRoutes.js");

const Category= require("../models/catagory.js")

// GET ALL Category
exports.getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      
    });

    return res.status(200).json(
        category)
  
  } catch (error) {
    return next(createError.createError(500, "Internal server Error"));
  }
};

// CREATE CATEGORY
exports.createCategory = async (req, res, next) => {
  try {
    const { name, icon } = req.body;

  
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return next(createError.createError(400, "Category already defined "));
    }

    const newCategory = await Category.create({
      name,
      icon,
    });

    res
      .status(201)
      .json({ message: "Category registered successfully", category: newCategory });
  } catch (error) {
    console.log(error)
    return next(createError.createError(500, "Internal server Error"));
  }
};






//DETETE CATEGORY

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const catagory = await Category.findOne({ where: { id: id } });
    if (!catagory) {
      return next(createError.createError(404, "Category not found"));
    }
    await catagory.destroy({ where: { id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};

//BULK UPDATE

exports.bulkUpdateCategory = async (req, res, next) => {
  try {
    const sortOrderUpdates = req.body; // Assumes array of objects in request body
    // Validate input
    if (!sortOrderUpdates || !Array.isArray(sortOrderUpdates)) {
      return next(createError.createError(400, "Invalid input format"));
    }

    // Extract category IDs
    const categoryIds = sortOrderUpdates.map(update => update.id);

    // Fetch categories
    const categories = await Category.findAll({ where: { id: categoryIds } });

    // Validate categories
    if (!categories || categories.length === 0) {
      return next(createError.createError(404, "Categories not found"));
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
