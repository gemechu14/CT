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

// GET ALL USER
exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include:{model: Permission,

        through:{attributes:[]}
      }
    });

    return res.status(200).json(
       roles)
  
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
      return next(createError.createError(400, "Role already defined "));
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



exports.createRole1 = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, permissionIds } = req.body;
    const existingRole = await Role.findOne({ where: { name ,TenantId: req.user.currentTenant} });
    if (existingRole) {
      return next(createError.createError(400, "Role already defined "));
    }


    const role = await Role.create({ name, description,TenantId:req.user.currentTenant }, { transaction });

    if (permissionIds && permissionIds.length > 0) {
      const newPermissionIds = permissionIds.map(Number);

      const permissions = await Permission.findAll({
        where: { id: newPermissionIds }
      });

      if (permissions.length !== newPermissionIds.length) {
        await transaction.rollback();
        return next(createError.createError(404, "One or more Permission not found"));
      }

      const rolePermissions = permissions.map(permission => ({
        RoleId: role.id,
        PermissionId: permission.id
      }));

      await RolePermission.bulkCreate(rolePermissions, { transaction });
    }

    await transaction.commit();

    const createdRole = await Role.findOne({
      where: { id: role.id },
      include: {
        model: Permission,
        through: { attributes: [] }
      }
    });

    res.status(201).json({
      message: "Role created successfully",
      data: createdRole
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return next(createError.createError(500, "Internal server error"));
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

// exports.updateRole = async (req, res, next) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { name, description, permissionIds } = req.body;
//     const { id } = req.params;

//     const role = await Role.findOne({
//       where: { id: id },
//       include: {
//         model: Permission,
//         through: { attributes: [] }
//       }
//     });

//     if (!role) {
//       await transaction.rollback();
//       return next(createError(404, "Role not found"));
//     }

//     const updates = {};
//     if (name) {
//       updates.name = name;
//     }
//     if (description) {
//       updates.description = description;
//     }

//     await role.update(updates, { transaction });

//     if (permissionIds) {
//       const newPermissionIds = permissionIds.map(Number);

//       const permissions = await Permission.findAll({
//         where: { id: newPermissionIds }
//       });

//       if (permissions.length !== newPermissionIds.length) {
//         await transaction.rollback();
//         return next(createError.createError(404, "One or more Permission not found"));
//       }

//       const currentPermissionIds = role.Permissions.map(p => p.id);

//       const permissionsToAdd = newPermissionIds.filter(id => !currentPermissionIds.includes(id));
//       const permissionsToRemove = currentPermissionIds.filter(id => !newPermissionIds.includes(id));

//       if (permissionsToRemove.length > 0) {
//         await RolePermission.destroy({
//           where: {
//             RoleId: id,
//             PermissionId: permissionsToRemove
//           },
//           transaction
//         });
//       }

//       if (permissionsToAdd.length > 0) {
//         const newRolePermissions = permissionsToAdd.map(permissionId => ({
//           RoleId: id,
//           PermissionId: permissionId
//         }));

//         await RolePermission.bulkCreate(newRolePermissions, { transaction });
//       }
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Role updated successfully",
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error(error);
//     return next(createError.createError(500, "Internal server error"));
//   }
// };


exports.updateRole = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, permissionIds } = req.body;
    const { id } = req.params;

    const role = await Role.findOne({
      where: { id: id },
      include: {
        model: Permission,
        through: { attributes: [] }
      }
    });

    if (!role) {
      await transaction.rollback();
      return next(createError(404, "Role not found"));
    }

    const updates = {};
    if (name) {
      updates.name = name;
    }
    if (description) {
      updates.description = description;
    }

    await role.update(updates, { transaction });

    if (permissionIds) {
      const newPermissionIds = permissionIds.map(Number);

      const permissions = await Permission.findAll({
        where: { id: newPermissionIds }
      });

      if (permissions.length !== newPermissionIds.length) {
        await transaction.rollback();
        return next(createError(404, "One or more Permission not found"));
      }

      const currentPermissionIds = role.Permissions.map(p => p.id);

      const permissionsToAdd = newPermissionIds.filter(id => !currentPermissionIds.includes(id));
      const permissionsToRemove = currentPermissionIds.filter(id => !newPermissionIds.includes(id));

      if (permissionsToRemove.length > 0) {
        await RolePermission.destroy({
          where: {
            RoleId: id,
            PermissionId: permissionsToRemove
          },
          transaction
        });
      }

      if (permissionsToAdd.length > 0) {
        const newRolePermissions = permissionsToAdd.map(permissionId => ({
          RoleId: id,
          PermissionId: permissionId
        }));

        await RolePermission.bulkCreate(newRolePermissions, { transaction });
      }
    }

    await transaction.commit();

    const updatedRole = await Role.findOne({
      where: { id: id },
      include: {
        model: Permission,
        through: { attributes: [] }
      }
    });

    res.status(200).json({
      message: "Role updated successfully",
      data: updatedRole
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return next(createError(500, "Internal server error"));
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


