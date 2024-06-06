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


