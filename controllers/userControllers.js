const User = require("../models/Users.js");
const sequelize = require("../database/db");
const createError = require("../utils/errorResponse.js");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const Tenant = require("../models/tenant.js");
const UserTenant = require("../models/userTenant.js");
const Address = require("../models/address.js");
const { where } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail.js");
const Team = require("../models/teams.js");
const UserTeam = require("../models/userTeam.js");
const { Op } = require("sequelize");

// GET ALL USER
exports.getAllUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    //   const users = await User.findAll({
    //     attributes: { exclude: ["password"] },
    //     include: [{
    //       model: Role,

    //     },
    //   {  model: Address},

    //   ],

    //   },

    // {where:{ defaultTenant: user.currentTenant}}

    // );

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        { model: Role },
        { model: Address },
        {
          model: Tenant,
          where: { id: user.currentTenant },
          through: { attributes: [] }, // to exclude attributes from the join table
        },
      ],
    });

    // const formattedUsers = users.map((user) => ({
    //   id: user.id,
    //   fullName: user.fullName,
    //   email: user.email,
    //   phoneNumber: user.phoneNumber,
    //   isSuperTenant: user.isSuperTenant,
    //   role: user.Roles.length ? user.Roles[0].name : null,
    // }));
    return res.status(200).json(users);
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
      // dateOfBirth,
      teamId,
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

    if (roleId) {
      const checkrole = await Role.findByPk(Number(roleId));

      if (checkrole === null) {
        return next(createError.createError(404, "Role not found"));
      }
    }
    const defaultRole = await Role.findOne({ where: { name: "Read Only" } });
    // const defaultRole= await Role.findAll()

    // return res.json(defaultRole)
    if (!defaultRole) {
      return next(createError.createError(404, "Default role not found"));
    }
    const user = await User.findByPk(req.user.id);

    const newUser = await User.create(
      {
        firstName,
        lastName,
        email,
        // dateOfBirth,
        password,
        phoneNumber,
        RoleId: roleId ?? defaultRole.id,
        defaultTenant: user.currentTenant,
      },
      { transaction }
    );

    /////////CREATE TEAM////////////////////////

    if (teamId) {
      const teams = await Team.findOne({ where: { id: Number(teamId) } });
      if (!teams) {
        return next(createError.createError(404, "The team not found"));
      } else {
        const userTeam = await UserTeam.create(
          {
            UserId: newUser.id,
            TeamId: teamId,
          },
          { transaction }
        );
      }
    }
    ///////////////////////////////////////////

    //check team

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

    const text = `Dear User,\n\nWelcome to Cedarstreet! Your account has been successfully created.\n\nEmail: ${newUser.email}\nPassword: ${newUser.password}\n\nThank you!`;
    await sendEmail(
      {
        email: newUser.email,
        subject: "Welcome to Cedar Platform",
        text,
        html: `<p>Dear ${newUser.firstName},</p>
         <p>Your account has been successfully created.</p>
         <p><strong>Email:</strong> ${newUser.email}</p>
         <p><strong>Password:</strong> ${password}</p>
         <p>You can log in to Cedar platform <a href="https://cedarplatform.io/">here</a>.</p>
         <p>Thank you!</p>`,
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

    if (!roleIds) {
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

    await user.update({ RoleId: roleIds });
    res.status(200).json({ message: "Role assigned to user successfully" });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

//UPDATE USER
exports.updateUser = async (req, res, next) => {
  try {
    //insert required field
    const { firstName, lastName, email, phoneNumber, roleId } = req.body;
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
    // if (dateOfBirth) {
    //   updates.dateOfBirth = dateOfBirth;
    // }
    if (lastName) {
      updates.lastName = lastName;
    }
    if (email) {
      updates.email = email;
    }
    // if (password) {
    //   updates.password = password;
    // }
    if (phoneNumber) {
      updates.phoneNumber = phoneNumber;
    }

    if (roleId) {
      updates.RoleId = roleId;
    }

    const result = await user.update(updates);

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

//UPDATE USER  PROFILE
exports.updateUserProfile = async (req, res, next) => {
  try {
    //insert required field
    const { firstName, lastName, email, phoneNumber, roleId } = req.body;
    const updates = {};
    const { id } = req.params;

    const user = await User.findOne({
      where: { id: req?.user?.id },
    });
    if (!user) {
      return next(createError.createError(404, "User not found"));
    }
    if (firstName) {
      updates.firstName = firstName;
    }
    // if (dateOfBirth) {
    //   updates.dateOfBirth = dateOfBirth;
    // }
    if (lastName) {
      updates.lastName = lastName;
    }
    if (email) {
      updates.email = email;
    }
    // if (password) {
    //   updates.password = password;
    // }
    if (phoneNumber) {
      updates.phoneNumber = phoneNumber;
    }

    if (roleId) {
      updates.RoleId = roleId;
    }

    const result = await user.update(updates);

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

//DELETE USER
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

//ACTIVATE || DEACTIVATE USER
exports.activateUser = async (req, res, next) => {
  try {
    //insert required field
    // const { firstName,lastName, email, password, phoneNumber, roleId } = req.body;
    const updates = {};

    const { id, action } = req.body;

    const validActions = ["activate", "deactivate"];

    // Check if the action is valid
    if (!validActions.includes(action)) {
      return next(createError(400, "Invalid action specified."));
    }

    if (!id || !action) {
      return next(createError.createError(400, "Provide required fields"));
    }

    const user = await User.findOne({
      where: { id: Number(id) },
    });
    if (!user) {
      return next(createError.createError(404, "User not found"));
    }
    if (action === "activate") {
      if (user.isActive) {
        return next(
          createError.createError(400, "The user account is already active")
        );
      } else {
        const result = await user.update({ isActive: true });
        res.status(200).json({
          message: "User Activated successfully",
        });
      }
    } else if (action === "deactivate") {
      if (user.isSuperTenant) {
        return next(
          createError.createError(
            404,
            "Supertenant users cannot be deactivated."
          )
        );
      }
      if (!user.isActive) {
        return next(
          createError.createError(
            400,
            "The user account is already deactiveted"
          )
        );
      } else {
        const result = await user.update({ isActive: false });
        res.status(200).json({
          message: "User deactivated successfully.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

//CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
  try {
    //insert required field
    const { previousPassword, newPassword } = req.body;
    const updates = {};

    const user = await User.findOne({
      where: { id: req.user.id },
    });

    if (!previousPassword || !newPassword) {
      return next(
        createError.createError(400, "Please enter the required fields.")
      );
    }
    if (!user) {
      return next(createError.createError(404, "User not found"));
    }

    if (!(await bcrypt.compare(previousPassword, user.password))) {
      return next(createError.createError(401, "Incorrect password"));
    }

    await user.update({ password: newPassword });

    res.status(200).json({
      message: "updated successfully",
      // data: result,
    });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

//RESET PASSWORD
exports.resetPassword = async (req, res, next) => {
  try {
    //insert required field
    const { newPassword } = req.body;
    const id = req?.params?.id;
    if (!id || !newPassword) {
      return next(
        createError.createError(400, "Please enter the required fields.")
      );
    }

    const user = await User.findOne({
      where: { id: Number(id) },
    });

    if (!user) {
      return next(createError.createError(404, "User not found"));
    }

    await user.update({ password: newPassword });

    res.status(200).json({
      message: "updated successfully",
      // data: result,
    });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

//CHANGE PROFILE PICTURE
exports.changeProfile = async (req, res, next) => {
  try {
    // const imageUrl= req?.body?.imageUrl;

    const data = req.files?.imageUrl?.[0]?.path;
    const imagePath = data ? `https://cedarplatform.io:4400/${data}` : null;

    const user = await User.findOne({ where: { id: req?.user?.id } });

    if (imagePath === null) {
      return next(createError.createError(400, "Please add image"));
    } else if (imagePath != null) {
      await user.update({ imageUrl: imagePath });

      return res.status(200).json({
        message: "Profile picture added successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};

//ASSIGN SUPER TENANT
exports.assignSuperTenant = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.body;

    const user = await User.findByPk(Number(userId));

    if (!user) {
      return next(createError.createError(404, "User not found "));
    }

    if (user.isSuperTenant) {
      return next(createError.createError(400, "User already supertenant"));
    }

    const userTenantRecords = await UserTenant.findAll({
      where: { UserId: Number(user.id) },
      attributes: ["TenantId"],
      // transaction
    });

    const userTenantIds = userTenantRecords.map((record) => record.TenantId);

    // Fetch tenants that are not associated with the user
    const newTenants = await Tenant.findAll({
      where: {
        id: {
          [Op.notIn]: userTenantIds,
        },
      },
      // transaction
    });

    ///ASSSIGN USER TO TENANT
    const newUserTenants = newTenants.map((tenant) => ({
      UserId: user.id,
      TenantId: tenant.id,
    }));

    if (newUserTenants.length > 0) {
      await UserTenant.bulkCreate(newUserTenants, { transaction });
    }

    await user.update({ isSuperTenant: true }, transaction);

    await transaction.commit();
    res.status(200).json({ message: "User assigned  successfully" });
  } catch (error) {
    // await transaction.rollback();
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

// UNASSIGN SUPER TENANT
exports.unassignSuperTenant = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.body;
    const user = await User.findByPk(Number(userId), { transaction });

    if (!user) {
      await transaction.rollback();
      return next(createError.createError(404, "User not found"));
    }

    if (!user.isSuperTenant) {
      await transaction.rollback();
      return next(createError.createError(400, "User is not a super tenant"));
    }

    if (
      user.email.toLowerCase() === "adonias@cedarstreet.io" ||
      user.email.toLowerCase() === "robert@cedarstreet.io"
    ) {
      await transaction.rollback();
      return next(
        createError.createError(400, "You cannot unassign this user")
      );
    } else {
      if (Number(userId) === req.user.id) {
        await transaction.rollback();
        return next(
          createError.createError(
            403,
            "You cannot unassign yourself as a super tenant"
          )
        );
      }

      // Find all UserTenant records for the user except the default tenant
      const userTenantRecords = await UserTenant.findAll({
        where: {
          UserId: Number(user.id),
          TenantId: { [Op.ne]: user.defaultTenant },
        },
        attributes: ["TenantId"],
        transaction,
      });

      // Remove the user from all tenants except the default tenant
      if (userTenantRecords.length > 0) {
        const tenantIdsToRemove = userTenantRecords.map(
          (record) => record.TenantId
        );
        await UserTenant.destroy({
          where: {
            UserId: Number(user.id),
            TenantId: tenantIdsToRemove,
          },
          transaction,
        });
      }

      // Update the user's isSuperTenant status
      await user.update({ isSuperTenant: false }, { transaction });

      await transaction.commit();
      res.status(200).json({ message: "User unassigned successfully" });
    }
    // Check if the user is trying to unassign themselves
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};
