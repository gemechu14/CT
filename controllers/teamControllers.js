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
    const teamId = req?.body?.teamId;

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
exports.assignTeamToUser = async (req, res, next) => {
  try {
    const { teamId, userId } = req.body;

    const team = await Team.findByPk(Number(teamId));
    const user = await User.findByPk(Number(userId));

    if (!team) {
      return next(createError.createError(404, "Team not found "));
    }
    if (!user) {
      return next(createError.createError(404, "User not found "));
    }

    // Find existing RolePermission entries for the role
    const existingUserTeam = await UserTeam.findAll({
      where: {
        TeamId: teamId,
        UserId: userId,
      },
    });

    if (existingUserTeam.length > 0) {
      return next(
        createError.createError(400, "Team  already assigned to the User")
      );
    }

    const userTeam = await UserTeam.create({
      UserId: userId,
      TeamId: teamId,
    });
    res.status(200).json({ message: "User assigned to Team successfully" });
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
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
