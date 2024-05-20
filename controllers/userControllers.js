const User = require("../models/Users.js");
const sequelize = require("../database/db");
const createError = require("../utils/errorResponse.js");
const Role = require("../models/role.js");
const UserRole = require("../models/userRole.js");
const Permission = require("../models/permission.js");
const Tenant = require("../models/tenant.js");
const UserTenant = require("../models/userTenant.js");

// GET ALL USER
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: {
        model: Role,
        include: { model: Permission },
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isSuperTenant: user.isSuperTenant,
      role: user.Roles.length ? user.Roles[0].name : null,
    }));
    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

// CREATE USER
exports.createUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    // return res.json(req.user)
    const { fullName, email, password, phoneNumber, roleId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(createError.createError(400, "User already exists"));
    }

    //   //CHECK FIRST ENTRY
    // const user= await User.findAll();

    // if(user.length ===0){
    //   const tenant =await Tenant.create({
    //     tenantName: "superTenant",
    //     tenantStatus:"created",
    //     isSuperTenant:true
    //   },{transaction})
    //   const defaultRole = await Role.findOne({ where: { name: "admin" } });

    //   defaultRole.update({TenantId:tenant.id},{transaction})
    //   const newUser = await User.create({
    //     fullName,
    //     email,
    //     password,
    //     phoneNumber,
    //     isSuperTenant:true,
    //     defaultTenant: tenant.id
    //   }, {transaction});

    //   await UserRole.create({
    //     UserId: newUser.id,
    //     RoleId: defaultRole.id,
    //   },{transaction});

    // await UserTenant.create({
    //   UserId: newUser.id,
    //   TenantId: tenant.id,
    // },{transaction})
    //   await transaction.commit();
    //   res.status(201).json({ message: "User1 registered successfully", user: newUser });

    // }
    // else{

    const defaultRole = await Role.findOne({ where: { name: "user" } });
    if (!defaultRole) {
      return next(createError.createError(404, "Default role not found"));
    }

    const newUser = await User.create(
      {
        fullName,
        email,
        password,
        phoneNumber,
        defaultTenant: req.user?.currentTenant,
      },
      { transaction }
    );

    await UserRole.create(
      {
        UserId: newUser.id,
        RoleId: roleId ?? defaultRole.id,
      },
      { transaction }
    );

    await UserTenant.create(
      {
        UserId: newUser.id,
        TenantId: req.user?.currentTenant,
      },
      { transaction }
    );

    await transaction.commit();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    await transaction.rollback();
    return next(createError.createError(500, "Internal server error"));
  }
};

//ASSIGN ROLE TO USER
exports.assignRoleToUser = async (req, res, next) => {
  try {
    const { userId, roleIds } = req.body;

    const user = await User.findByPk(Number(userId));

    if (!user) {
      return next(createError.createError(404, "User not found "));
    }

    roleId = roleIds.map((id) => Number(id));

    const roles = await Role.findAll({
      where: {
        id: roleId,
      },
    });
    if (roles.length !== roleIds.length) {
      return next(createError.createError(404, "One or more Role not found"));
    }

    // Find existing RolePermission entries for the role
    const existingUserRole = await UserRole.findAll({
      where: {
        UserId: userId,
        RoleId: roleId,
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

    const userRoleEntries = roles.map((role) => ({
      UserId: userId,
      RoleId: role.id,
    }));

    await UserRole.bulkCreate(userRoleEntries);
    res.status(200).json({ message: "Role assigned to user successfully" });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    //insert required field
    const { fullName, email, password, phoneNumber, roleId } = req.body;
    const updates = {};
    const { id } = req.params;

    const user = await User.findOne({
      where: { id: id },
    });
    if (!user) {
      return next(createError.createError(404, "User not found"));
    }
    if (fullName) {
      updates.fullName = fullName;
    }
    if (email) {
      updates.email = email;
    }
    if (password) {
      updates.password = password;
    }
    if (phoneNumber) {
      updates.phoneNumber = phoneNumber;
    }

    const result = await user.update(updates);

    res.status(200).json({
      message: "updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return next(createError.createError(404, "User not found"));
    }
    await user.destroy({ where: { id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};
