const { Certificate } = require("crypto");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const RolePermission = require("../models/rolePermission.js");
const createError = require("../utils/errorResponse.js");
const { create } = require("domain");
const User = require("../models/Users.js");
const UserRole = require("../models/userRole.js");
const Tenant = require("../models/tenant.js");
const { isCancel } = require("axios");
const e = require("cors");
const UserTenant = require("../models/userTenant.js");
const sequelize = require("../database/db");
const { where } = require("sequelize");

// GET ALL USER
exports.getAllTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.findAll({
      where:{ isActive:true}

    });

    return res.status(200).json(tenants);
  } catch (error) {
    console.log(error)
    return next(createError.createError(500, "Internal server Error"));
  }
};

// CREATE ROLE
exports.createTenant = async (req, res, next) => {
  try {
    const {
      tenantName,
      tenantStatus,
      isSuperTenant,
      language,
      numberOfTeams,
      numberOfUsers,
      powerBIWorkspace,
    } = req.body;
    const existingTenant = await Tenant.findOne({ where: { tenantName } });
    if (existingTenant) {
      return next(createError.createError(400, "Tenant already defined "));
    }

    const tenant = await Tenant.create({
      tenantName,
      tenantStatus,
      isSuperTenant,
      language,
      numberOfTeams,
      numberOfUsers,
      powerBIWorkspace,
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

//UPDATE TENANT INFO
exports.updateTenant = async (req, res, next) => {
  try {
    //insert required field
    const {      tenantName,
      tenantStatus,
      isSuperTenant,
      language,
      numberOfTeams,
      numberOfUsers,
      powerBIWorkspace, } = req.body;
    const updates = {};
    const { id } = req.params;

    const tenants = await Tenant.findOne({
      where: { id: id },
    });
    if (!tenants) {
      return next(createError.createError(404, "Tenant not found"));
    }
    if (tenantName) {
      updates.tenantName = tenantName;
    }
    if (tenantStatus) {
      updates.tenantStatus = tenantStatus;
    }

    if (isSuperTenant) {
      updates.isSuperTenant = isSuperTenant;
    }
    if (language) {
      updates.language = language;
    }
    if (numberOfTeams) {
      updates.numberOfTeams = numberOfTeams;
    }
    if (numberOfUsers) {
      updates.numberOfUsers = numberOfUsers;
    }
    if (powerBIWorkspace) {
      updates.powerBIWorkspace = powerBIWorkspace;
    }


    const result = await tenants.update(updates);

    res.status(200).json({
      message: "updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};
//DELETE TENANT
exports.deleteTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenants = await Tenant.findOne({ where: { id: id } });
    if (!tenants) {
      return next(createError.createError(404, "Tenant not found"));
    }
    await tenants.update({ isActive: false, where: { id } });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};

//UNASSIGN USER FROM TENANT

exports.unassingUserFromTenant = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, tenantId } = req.body;

    if (!userId || !tenantId) {
      return next(
        createError.createError(
          400,
          "Missing required fields: Please ensure all mandatory fields are provided"
        )
      );
    }

    const existingUserTenant = await UserTenant.findOne({
      where: { UserId: Number(userId), TenantId: Number(tenantId) },
    });

    if (!existingUserTenant) {
      return next(
        createError.createError(
          404,
          "User is not assigned to the specified tenant"
        )
      );
    }

    await existingUserTenant.destroy(
      { UserId: userId, TenantId: tenantId },
      { transaction }
    );
    await User.update(
      { defaulTenant: null, currentTenant: null, where: { id: userId } },
      { transaction }
    );

    await transaction.commit();
    return res.status(200).json({
      message: "Unassigned successfully",
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return next(createError.createError(500, "Internal server Error"));
  }
};

//ASSIGN USER TO TENANT
exports.assingToTenant = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, tenantId } = req.body;

    if (!userId || !tenantId) {
      return next(
        createError.createError(
          400,
          "Missing required fields: Please ensure all mandatory fields are provided"
        )
      );
    }

    const existingUserTenant = await UserTenant.findOne({
      where: { UserId: Number(userId), TenantId: Number(tenantId) },
    });
    if (existingUserTenant) {
      return next(
        createError.createError(
          404,
          "User is already assigned to the specified tenant"
        )
      );
    }

    await UserTenant.create(
      { UserId: userId, TenantId: tenantId },
      { transaction }
    );

    await User.update(
      { defaulTenant: tenantId },
      { where: { id: userId }, transaction }
    );

    await transaction.commit();
    return res.status(200).json({
      message: "User assigned successfully",
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return next(createError.createError(500, "Internal server Error"));
  }
};


//Switch TENANT
exports.switchTenant = async (req, res, next) => {
  // const transaction = await sequelize.transaction();
  try {
    const { tenantId } = req.body;
  const tenantIds= Number(tenantId)
    if (!tenantIds) {
      return next(
        createError.createError(
          400,
          "Please ensure all mandatory fields are provided"
        )
      );
    }
    userTenant= await UserTenant.findOne({
      where:{
        UserId: req.user.id,
        TenantId: tenantIds
      }
    })
    if(userTenant === null){
      return next(createError.createError(404,"User is not Assigned to tenant"))
    }

    const data= await User.update(
      { currentTenant: tenantIds },
      { where: { id: req.user.id } }
    );
  
  
    return res.status(200).json({
      message: "Switched successfully",
    });
  } catch (error) {
    console.log(error);
    // await transaction.rollback();
    return next(createError.createError(500, "Internal server Error"));
  }
};
