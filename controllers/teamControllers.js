const { Certificate } = require("crypto");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const RolePermission = require("../models/rolePermission.js");
const createError = require("../utils/errorResponse.js");
const { create } = require("domain");
const User = require("../models/Users.js");
const UserRole = require("../models/userRole.js");
const sequelize = require("../database/db");
const Team = require("../models/teams.js");
const { use } = require("../routes/userRoutes.js");
const UserTeam = require("../models/userTeam.js");
const NavigationContent = require("../models/navigationContent.js");
const ReportTeam = require("../models/reportTeam.js");
const Address = require("../models/address.js");
const { nextTick } = require("process");
const Tenant = require("../models/tenant.js");
const { Sequelize, where } = require("sequelize");
const UserTenant = require("../models/userTenant.js");

// GET ALL TEAM
exports.getAllTeams = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const teams = await Team.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        TenantId: user.currentTenant,
      },
    });

    return res.status(200).json(teams);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

//GET ALL USER UNDER TEAMS
  exports.getAllUserUnderTeam = async (req, res, next) => {
    try {
      const { teamId } = req.params;



    if (!teamId) {
      return next(createError.createError(404, "Please enter TeamId"));
    }
    const user = await User.findByPk(req.user.id);
    const teams = await Team.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
          include:[

            {model:Role},
            {model:Address}
          ],

          through: {
            model: UserTeam,

            where: { TeamId: teamId },
          },
          required: true,
        },
      ],

      where: {
        TenantId: user.currentTenant,
      },
    });

        // Extract users from teams
        const users = teams.reduce((acc, team) => {
          const teamUsers = team.Users.map(user => {
            // const { password, ...userWithoutPassword } = user.get({ plain: true });
            return user;
          });
          return [...acc, ...teamUsers];
        }, []);
    
        return res.status(200).json(users);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

// CREATE TEAMS
exports.createTeams = async (req, res, next) => {
  try {
    const { teamName, description, status } = req.body;

    const existingTeam = await Team.findOne({ where: { teamName } });
    if (existingTeam) {
      return next(createError.createError(400, "Team already defined "));
    }
    const user = await User.findByPk(req.user.id);
    const newTeam = await Team.create({
      teamName,
      description,
      status,
      TenantId: user.currentTenant,
    });

    res
      .status(201)
      .json({ message: "Team registered successfully", team: newTeam });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

//ASSIGN TEAM TO USER
// exports.assignTeamToUser = async (req, res, next) => {
//   try {
//     const { teamId, userId } = req.body;

//     const team = await Team.findByPk(Number(teamId));
//     const user = await User.findByPk(Number(userId));

//     if (!team) {
//       return next(createError.createError(404, "Team not found "));
//     }
//     if (!user) {
//       return next(createError.createError(404, "User not found "));
//     }

//     // Find existing RolePermission entries for the role
//     const existingUserTeam = await UserTeam.findAll({
//       where: {
//         TeamId: teamId,
//         UserId: userId,
//       },
//     });

//     if (existingUserTeam.length > 0) {
//       return next(
//         createError.createError(400, "Team  already assigned to the User")
//       );
//     }

//     const userTeam = await UserTeam.create({
//       UserId: userId,
//       TeamId: teamId,
//     });
//     res.status(200).json({ message: "User assigned to Team successfully" });
//   } catch (error) {
//     console.log(error);
//     return next(createError.createError(500, "Internal server Error"));
//   }
// };


exports.assignTeamToUser = async (req, res, next) => {
  try {
    const { teamId, userIds } = req.body; // Assume userIds is an array of user IDs

    const team = await Team.findByPk(Number(teamId));

    if (!team) {
      return next(createError.createError(404, "Team not found"));
    }

    const users = await User.findAll({
      where: {
        id: userIds
      }
    });

    if (users.length !== userIds.length) {
      return next(createError.createError(404, "Some users not found"));
    }

    const alreadyAssignedUsers = [];
    const successfullyAssignedUsers = [];

    for (const userId of userIds) {
      // Check if the user is already assigned to the team
      const existingUserTeam = await UserTeam.findOne({
        where: {
          TeamId: teamId,
          UserId: userId,
        },
      });

      if (existingUserTeam) {
        alreadyAssignedUsers.push(userId);
      } else {
        // Assign the user to the team
        await UserTeam.create({
          UserId: userId,
          TeamId: teamId,
        });

        successfullyAssignedUsers.push(userId);
      }
    }

    if (alreadyAssignedUsers.length > 0) {
      return res.status(400).json({
        message: "Some users are already assigned to the team",
        // alreadyAssignedUsers
      });
    }

    res.status(200).json({
      message: "Users Assigned successfully",
      // successfullyAssignedUsers,
    });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};


//ASSIGN NAVIGATION  TO TEAM
exports.assignNavigationToTeam = async (req, res, next) => {
  try {
    const { teamId, navigationId } = req.body;

    const team = await Team.findByPk(Number(teamId));
    const navigation = await NavigationContent.findByPk(Number(navigationId));

    if (!team) {
      return next(createError.createError(404, "Team not found "));
    }
    if (!navigation) {
      return next(createError.createError(404, "navigation not found "));
    }

    // Find existing RolePermission entries for the role
    const existingNavigationTeam = await ReportTeam.findAll({
      where: {
        TeamId: teamId,
        NavigationContentId: navigationId,
      },
    });

    if (existingNavigationTeam.length > 0) {
      return next(
        createError.createError(400, "Navigation  already assigned to the team")
      );
    }

    const userTeam = await ReportTeam.create({
      NavigationContentId: navigationId,
      TeamId: teamId,
    });
    res.status(200).json({ message: "Report assigned to Team successfully" });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};
//UPDATE TEAM
exports.updateTeam = async (req, res, next) => {
  try {
    const { teamName, description, status } = req.body;
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id: id },
    });

    if (!team) {
      await transaction.rollback();
      return next(createError.createError(404, "Team not found"));
    }

    const updates = {};
    if (teamName) {
      updates.name = teamName;
    }
    if (description) {
      updates.description = description;
    }
    if (status) {
      updates.status = status;
    }

    await team.update(updates);

    res.status(200).json({
      message: "Team updated successfully",
    });
  } catch (error) {
    console.error(error);
    return next(createError.createError(500, "Internal server error"));
  }
};
//DELETE TEAM
exports.deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const team = await Team.findOne({ where: { id: id } });
    if (!team) {
      return next(createError.createError(404, "Team not found"));
    }
    await team.destroy({ where: { id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};

// GET ALL UNASSIGNED USERS
exports.getAllUnassignedUser = async (req, res, next) => {
  try {
    const { teamId } = req.body;

    // Step 1: Get all User IDs in the specified team
    const userTeams = await UserTeam.findAll({
      where: {
        TeamId: teamId,
      },
      attributes: ['UserId'],
    });

    const userIdsInTeam = userTeams.map(userTeam => userTeam.UserId);

    // Step 2: Get all users under the current tenant
    const allUsersUnderTenant = await UserTenant.findAll({
      where: {
        TenantId: req.user.currentTenant, // Filter by the current tenant
      },
      attributes: ['UserId'],
    });

    const userIdsUnderTenant = allUsersUnderTenant.map(userTenant => userTenant.UserId);

    // Step 3: Get all users under the current tenant who are not in the selected team
    const unassignedUsers = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        { model: Role },
        { model: Address },
        {
          model: Tenant,
          where: { id: req.user.currentTenant },
          through: { attributes: [] }, // Filter users by the current tenant
        },
      ],
      where: {
        id: {
          [Sequelize.Op.in]: userIdsUnderTenant, // Ensure users belong to the current tenant
          [Sequelize.Op.notIn]: userIdsInTeam.length > 0 ? userIdsInTeam : [0], // Exclude users in the selected team
        },
      },
    });

    res.status(200).json(
      unassignedUsers
    );
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};


// GET ALL UNASSIGNED USERS
// exports.getAllUnassignedUser = async (req, res, next) => {
//   try {
//     const { teamId } = req.body;

//     const checkTeam= Team.findOne({where:{TenantId: req.user.currentTenant, id: teamId}});

//     if(!checkTeam){
//       return next(createError.createError(404,"Team not found in the tenant"))
//     }
// console.log(req.user.currentTenant);

// const getAllUserInTeAM= await UserTeam.findAll({
//   where:{
//     TeamId:teamId,
//   }
// })
// return res.json(getAllUserInTeAM)
//     const unassignedUsers = await User.findAll({
//       attributes: { exclude: ["password"] },
//       include: [
//         { model: Role },
//         { model: Address },
//         {
//           model: Tenant,
//           where: { id: req.user.currentTenant },
//           through: { attributes: [] }, // to exclude attributes from the join table
//         },
//       ],
//       where: {
//         '$Teams.UserTeam.TeamId$': null, // Filter out users who have a TeamId associated in the UserTeam join table
//       },
//       include: [
//         {
//           model: Team,
//           required: false, // Include users even if they are not in a team
//           through: {
//             model: UserTeam,
//             where: { TeamId: teamId },
//           },
//         },
//       ],
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         users: unassignedUsers,
//       },
//     });
//   } catch (error) {
//     console.log(error)
//     return next(createError.createError(500, "Internal server error"));
//   }
// };


// // GET ALL UNASSIGNED USERS
// exports.getAllUnassignedUser = async (req, res, next) => {
//   try {
//     const { teamId } = req.body;

//     const unassignedUsers = await User.findAll({
//       attributes: { exclude: ["password"] },
//       include: [
//         { model: Role },
//         { model: Address },
//         {
//           model: Tenant,
//           where: { id: req.user.currentTenant },
//           through: { attributes: [] }, // Filter users by the current tenant
//         },
//         {
//           model: Team,
//           required: false, // Include users even if they are not in a team
//           through: {
//             model: UserTeam,
//             where: { TeamId: teamId },
//           },
//         },
//       ],
//       where: Sequelize.literal(`
//         "User"."id" NOT IN (
//           SELECT "UserTeam"."UserId"
//           FROM "UserTeams" AS "UserTeam"
//           WHERE "UserTeam"."TeamId" = ${teamId}
//         )
//       `),
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         users: unassignedUsers,
//       },
//     });
//   } catch (error) {
//     console.log(error)
//     return next(createError.createError(500, "Internal server error"));
//   }
// };