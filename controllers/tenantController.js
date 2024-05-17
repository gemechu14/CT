const { Certificate } = require("crypto");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const RolePermission = require("../models/rolePermission.js");
const createError = require("../utils/errorResponse.js");
const { create } = require("domain");
const User = require("../models/Users.js");
const UserRole = require("../models/userRole.js");
const Tenant = require("../models/tenant.js");

// GET ALL USER
exports.getAllTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.findAll({
    });

    return res.status(200).json({
      data: tenants,
    });
  } catch (error) {
    return next(createError.createError(500, "Internal server Error"));
  }
};

// CREATE ROLE
exports.createTenant = async (req, res, next) => {
  try {
    const { tenantName, tenantStatus,isSuperTenant } = req.body;



    const tenant = await Tenant.create({
        tenantName,
        tenantStatus,
        isSuperTenant
    });

    res
      .status(201)
      .json({ message: "Tenant registered successfully", tenant: tenant });
  } catch (error) {
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

