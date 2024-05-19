const { Certificate } = require("crypto");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const RolePermission = require("../models/rolePermission.js");
const createError = require("../utils/errorResponse.js");
const { create } = require("domain");
const User = require("../models/Users.js");
const UserRole = require("../models/userRole.js");

// GET ALL USER
exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return res.status(200).json({
      data: roles,
    });
  } catch (error) {
    return next(createError.createError(500, "Internal server Error"));
  }
};

// CREATE ROLE
exports.createRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;

  
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return next(createError.createError(500, "Role already defined "));
    }

    const newURole = await Role.create({
      name,
      description,
      TenantId: req.user.currentTenant
    });

    res
      .status(201)
      .json({ message: "Role registered successfully", role: newURole });
  } catch (error) {
    console.log(error)
    return next(createError.createError(500, "Internal server Error"));
  }
};

//ASSIGN PERMISSION TO ROLE
exports.assignPermissionToRole = async (req, res, next) => {
  try {
    const { roleId, permissionIds } = req.body;

    const role = await Role.findByPk(Number(roleId));

    if (!role) {
      return next(createError.createError(404, "Role not found "));
    }
    permissionId = permissionIds.map((id) => Number(id));

    const permissions = await Permission.findAll({
      where: {
        id: permissionId,
      },
    });
    if (permissions.length !== permissionIds.length) {
      return next(
        createError.createError(404, "One or more Permission not found")
      );
    }

    // Find existing RolePermission entries for the role
    const existingUserRole = await UserRole.findAll({
      where: {
        RoleId: roleId,
        UserId: roleId,
      },
    });

    if (existingUserRole.length > 0) {
      return next(
        createError.createError(
          400,
          "One or more Role are already assigned to the User"
        )
      );
    }

    const userRoleEntries = permissions.map((permission) => ({
      RoleId: roleId,
      PermissionId: permission.id,
    }));

    await RolePermission.bulkCreate(userRoleEntries);
    res
      .status(200)
      .json({ message: "Permissions assigned to role successfully" });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    //insert required field
    const { name, description } = req.body;
    const updates = {};
    const { id } = req.params;

    const role = await Role.findOne({
      where: { id: id },
    });
    if (!role) {
      return next(createError.createError(404, "Role not found"));
    }
    if (name) {
      updates.name = name;
    }
    if (description) {
      updates.description = description;
    }
   

    const result = await role.update(updates);

    res.status(200).json({
      message: "updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await Role.findOne({ where: { id: id } });
    if (!role) {
      return next(createError.createError(404, "Role not found"));
    }
    await role.destroy({ where: { id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};


