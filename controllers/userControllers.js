const User = require("../models/Users.js");
const sequelize = require("../database/db");
const createError = require("../utils/errorResponse.js");
const Role = require("../models/role.js");
const UserRole = require("../models/userRole.js");
const Permission = require("../models/permission.js");
const Tenant = require("../models/tenant.js");
const UserTenant = require("../models/userTenant.js");
const Address=require("../models/address.js");

// GET ALL USER
exports.getAllUser = async (req, res, next) => {
  try {
    const user= await User.findByPk(req.user.id)

    // const getAlluser= await UserTenant.findAll({
    //   include:{model:User},

    //  where:{TenantId: user.currentTenant}
    // })
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      
      include: [{
        model: Role,
        // include: { model: Permission,          
        //  },
       
      },
    {  model: Address},
    
    ],
    
    }
  
  
  );

    // const formattedUsers = users.map((user) => ({
    //   id: user.id,
    //   fullName: user.fullName,
    //   email: user.email,
    //   phoneNumber: user.phoneNumber,
    //   isSuperTenant: user.isSuperTenant,
    //   role: user.Roles.length ? user.Roles[0].name : null,
    // }));
    return res.status(200).json(getAlluser);
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
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      password,
      phoneNumber,
      roleId,
      // streetNumber,
      // streetName,
      // streetType,
      // city,
      // state,
      // country,
      // postalCode,
    } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(createError.createError(400, "User already exists"));
    }
  
    const checkrole= await Role.findByPk(Number(roleId))

    if(!checkrole){

      return createError.createError(404,"Role not found")
    }
     const defaultRole = await Role.findOne({ where: { name: "Read Only" } });
    // const defaultRole= await Role.findAll()

    // return res.json(defaultRole)
    if (!defaultRole) {
      return next(createError.createError(404, "Default role not found"));
    }
    const user= await User.findByPk(req.user.id)


    const newUser = await User.create(
      {
        firstName,
        lastName,
        email,
        dateOfBirth,
        password,
        phoneNumber,
        RoleId:roleId ?? defaultRole.id,     
        defaultTenant: user.currentTenant,
      },
      { transaction }
    );
 
    // await UserRole.create(
    //   {
    //     UserId: newUser.id,
    //     RoleId: roleId ?? defaultRole.id,
    //   },
    //   { transaction }
    // );

    await UserTenant.create(
      {
        UserId: newUser.id,
        TenantId: user.currentTenant,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(newUser);
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

    if(!roleIds){
      return next(createError.createError(404, "Role not found "));
    }

    // roleId = roleIds.map((id) => Number(id));

    const roles = await Role.findOne({
      where: {
        id: Number(roleIds),
      },
    });
    if (!roles) {
      return next(createError.createError(404, "Role not found"));
    }

    // // Find existing RolePermission entries for the role
    // const existingUserRole = await UserRole.findAll({
    //   where: {
    //     UserId: userId,
    //     RoleId: roleId,
    //   },
    // });

    // if (existingUserRole.length > 0) {
    //   return next(
    //     createError.createError(
    //       400,
    //       "One or more Role are already assigned to the User"
    //     )
    //   );
    // }

    // const userRoleEntries = roles.map((role) => ({
    //   UserId: userId,
    //   RoleId: role.id,
    // }));

    // await UserRole.bulkCreate(userRoleEntries);


    await user.update({RoleId: roleIds})
    res.status(200).json({ message: "Role assigned to user successfully" });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    //insert required field
    const { firstName,lastName, email, password, phoneNumber, roleId } = req.body;
    const updates = {};
    const { id } = req.params;

    const user = await User.findOne({
      where: { id: id },
    });
    if (!user) {
      return next(createError.createError(404, "User not found"));
    }
    if (firstName) {
      updates.firstName = firstName;
    }
    if (lastName) {
      updates.lastName = lastName;
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

    if (roleId) {
      updates.RoleId = roleId;
    }

    const result = await user.update(updates,
      
    );

    delete result?.dataValues?.password;

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
    if (user.isSuperTenant) {
      return next(createError.createError(403, "Cannot delete a super tenant"));
    }

    await user.destroy({ where: { id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};
