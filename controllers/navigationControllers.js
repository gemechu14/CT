const { Certificate } = require("crypto");
const NavigationContent = require("../models/navigationContent.js");
const { create } = require("domain");
const sequelize = require("../database/db");
const createError = require("../utils/errorResponse.js");
const User = require("../models/Users.js");
const Tenant = require("../models/tenant.js");
const Team = require("../models/teams.js");
const ReportTeam = require("../models/reportTeam.js");
const { Op } = require("sequelize");

// GET ALL NAVIGATION
exports.getAllNavigation = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    const navigationContent = await NavigationContent.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        TenantId: user.currentTenant,
      },
      include: [
        {
          model: Team,

          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json(navigationContent);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

//GET ALL NAVIGATION
exports.getAllNavigation2 = async (req, res, next) => {
  try {
 
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Team,
        through: { attributes: [] },
      },
    });

    const teamIds = user.Teams.map((team) => team.id);

    const navigationContent = await NavigationContent.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        TenantId: user.currentTenant,
        [Op.or]: [
          { CreatedBy: user.id.toString() },
          {
            "$Teams.id$": { [Op.in]: teamIds },
          },
        ],
      },
      include: [
        {
          model: Team,
          // where: {
          //   id: { [Op.in]: teamIds },
          },

        //   through: {
        //     attributes: [],
        //   },
        //   required: false,
        // },
      ],
    });

    return res.status(200).json(navigationContent);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

// GET NAVIGATION BY ID
exports.getNavigationById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const id = req?.params?.id;
    if (!id) {
      return next(createError.createError(404, "Id not found"));
    }

    const navigationContent = await NavigationContent.findOne({
      where: { id: id, TenantId: user.currentTenant },

      include: [
        {
          model: Team,

          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json(navigationContent);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server Error"));
  }
};

// exports.getNavigationById2 = async (req, res, next) => {
//   try {
//     // const user = await User.findByPk(req.user.id, {
//     //   include: {
//     //     model: Team,
//     //     through: { attributes: [] }, // Exclude the UserTeam attributes
//     //   },
//     // });

//     return res.json(req.user)
//     const id = req?.params?.id;
//     if (!id) {
//       return next(createError.createError(404, "Id not found"));
//     }
//     const teamIds = user.Teams.map(team => team.id);

//     const navigationContent = await NavigationContent.findAll({
//       attributes: { exclude: ["createdAt", "updatedAt"] },
//       where: {
//         TenantId: user.currentTenant, // Ensure the TenantId matches the data type in your DB
//         // [Op.or]: [
//         //   { CreatedBy: '1' },
//         // ],
//       },
//       include: [
//         {
//           model: Team,
//           // where: {
//           //   id: { [Op.in]: teamIds },
//           // },
//           through: {
//             attributes: [], // Exclude the ReportTeam attributes
//           },
//           required: true, // Ensure the include is not optional
//         },
//       ],
//     });
//     return res.status(200).json(navigationContent);
//   } catch (error) {
//     console.log(error);
//     return next(createError.createError(500, "Internal server Error"));
//   }
// };
// CREATE NAVIGATION
exports.createNavigation = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      // CreatedBy,
      NavigationSetupId,
      OrganisationId,
      Type,
      IsRls,
      Title,
      PagePath,
      Parent,
      PageType,
      ReportType,
      ReportDatasetId,
      Toggler,
      Icon,
      Description,
      PowerBiWorkspace,
      DisplayUseDynamicBinding,
      DynamicDataSetid,
      ReportPages,
      ShowFilter,
      ShowContentPane,
      HideTitleAnddescription,
      HideTitleSection,
      ShowSharingButton,
      ShowExportButton,
      SortOrder,
      __RequestVerificationToken,
      EmbedUrl,
      NavSecurity,
      type,
    } = req.body;

    const user = await User.findByPk(req.user.id);

    const existingTitle = await NavigationContent.findOne({ where: { Title } });
    if (existingTitle) {
      return next(
        createError.createError(400, "Navigation Title already defined")
      );
    }

    const newNavigation = await NavigationContent.create(
      {
        CreatedBy: req.user.id,
        NavigationSetupId,
        OrganisationId,
        Title,
        Parent,
        PagePath,
        Type,
        IsRls,
        PageType,
        ReportType,
        ReportDatasetId,
        Toggler,
        Icon,
        Description,
        PowerBiWorkspace,
        DisplayUseDynamicBinding,
        DynamicDataSetid,
        ReportPages,
        ShowFilter,
        ShowContentPane,
        HideTitleAnddescription,
        HideTitleSection,
        ShowSharingButton,
        ShowExportButton,
        SortOrder,
        __RequestVerificationToken,
        EmbedUrl,
        // NavSecurity,
        type,
        TenantId: user.currentTenant,
      },
      { transaction }
    );

    // if(NavSecurity.)
    // HANDLE REPORT TEAM
    // Extract GroupIds from NavSecurity

    if (NavSecurity?.length > 0) {
      const groupIds = NavSecurity.map(
        (navSecurityItem) => navSecurityItem.GroupId
      );

      // Fetch all relevant teams in one query
      const teams = await Team.findAll({
        where: {
          id: groupIds,
        },
      });

      // Create a map of team IDs to team objects
      const teamMap = {};
      teams.forEach((team) => {
        teamMap[team.id] = team;
      });

      // Create ReportTeam records for found teams
      const reportTeamPromises = NavSecurity.map((navSecurityItem) => {
        const { GroupId, CanEdit, RolesValidation } = navSecurityItem;

        // Check if the team exists in the map
        if (teamMap[GroupId]) {
          return ReportTeam.create(
            {
              NavigationContentId: newNavigation.id,
              TeamId: teamMap[GroupId].id,
              canEdit: CanEdit,
              rolesValidation: RolesValidation,
            },
            { transaction }
          );
        }
      });

      await Promise.all(reportTeamPromises);
    }
    await transaction.commit();

    res.status(201).json({
      message: "Navigation registered successfully",
      navigation: newNavigation,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return next(createError.createError(500, "Internal server Error"));
  }
};

//BULK UPDATE

//BULK UPDATE
exports.bulkUpdateNavigation = async (req, res, next) => {
  try {
    const sortOrderUpdates = req.body; // Assumes array of objects in request body
    // Validate input
    if (!sortOrderUpdates || !Array.isArray(sortOrderUpdates)) {
      return next(createError.createError(400, "Invalid input format"));
    }

    // Extract category IDs
    const categoryIds = sortOrderUpdates.map((update) => update.id);

    // Fetch categories
    const categories = await NavigationContent.findAll({
      where: { id: categoryIds },
    });

    // Validate categories
    if (!categories || categories.length === 0) {
      return next(createError.createError(404, "Navigation not found"));
    }

    // Perform bulk update
    const updatePromises = sortOrderUpdates.map(async (update) => {
      const category = categories.find((cat) => cat.id === update.id);
      if (category) {
        return category.update({ SortOrder: update.sortOrder });
      }
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: "Bulk update successful" });
  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal server error"));
  }
};

//UPDATE NAVIGATION

exports.updateNavigation = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const navigationId = req.params.id;
    // Assuming navigationId is passed in the route params
    const {
      NavigationSetupId,
      OrganisationId,
      Type,
      IsRls,
      Title,
      PagePath,
      Parent,
      PageType,
      ReportType,
      ReportDatasetId,
      Toggler,
      Icon,
      Description,
      PowerBiWorkspace,
      DisplayUseDynamicBinding,
      DynamicDataSetid,
      ReportPages,
      ShowFilter,
      ShowContentPane,
      HideTitleAnddescription,
      HideTitleSection,
      ShowSharingButton,
      ShowExportButton,
      SortOrder,
      __RequestVerificationToken,
      EmbedUrl,
      NavSecurity,
      type,
    } = req.body;

    const user = await User.findByPk(req.user.id);

    // Fetch the current NavigationContent record
    const navigation = await NavigationContent.findByPk(navigationId);

    if (!navigation) {
      return next(createError.createError(404, "Navigation not found"));
    }

    // Check if Title is being updated and if it's unique
    if (Title !== navigation.Title) {
      const existingNavigationContent = await NavigationContent.findOne({
        where: {
          Title,
          id: { [Op.not]: navigation.id }, // Exclude current NavigationContent
        },
      });

      if (existingNavigationContent) {
        return res
          .status(400)
          .json({ message: "NavigationContent Title must be unique" });
      }
    }

    const currentTeams = await ReportTeam.findAll({
      where: { NavigationContentId: navigationId },
    });

    // Extract TeamIds from current ReportTeam records
    const currentTeamIds = currentTeams?.map((reportTeam) => reportTeam.TeamId);

    // Extract updated TeamIds from NavSecurity

    if (NavSecurity) {
      const updatedTeamIds = NavSecurity?.map((item) => item.GroupId);

      // Find TeamIds to delete (present in currentTeamIds but not in updatedTeamIds)
      const teamsToDelete = currentTeamIds.filter(
        (teamId) => !updatedTeamIds.includes(teamId)
      );

      if (teamsToDelete != null) {
        // Delete ReportTeam records where TeamId is in teamsToDelete
        await ReportTeam.destroy({
          where: {
            NavigationContentId: navigationId,
            TeamId: teamsToDelete,
          },
          transaction,
        });
      }

      // Create new ReportTeam records for new TeamIds in updated NavSecurity
      const createReportTeamPromises = NavSecurity?.map(async (item) => {
        const { GroupId, CanEdit, RolesValidation } = item;

        // Check if TeamId already exists in currentTeamIds
        if (!currentTeamIds.includes(GroupId)) {
          const team = await Team.findByPk(GroupId, { transaction });

          if (!team) {
            throw createError.createError(
              404,
              `Team with ID ${GroupId} not found`
            );
          }

          const data = await ReportTeam.create(
            {
              NavigationContentId: navigationId,
              TeamId: GroupId,
              CanEdit,
              RolesValidation,
            },
            { transaction }
          );
        }
      });

      await Promise.all(createReportTeamPromises);
    }

    // Update existing ReportTeam records if CanEdit or RolesValidation has changed
    const updateReportTeamPromises = currentTeams.map(async (reportTeam) => {
      const { TeamId } = reportTeam;

      // Find the corresponding NavSecurity item for the current TeamId
      const updatedTeam = NavSecurity.find((item) => item.GroupId === TeamId);

      if (updatedTeam) {
        // Update the reportTeam if CanEdit or RolesValidation has changed
        if (
          reportTeam.CanEdit !== updatedTeam.CanEdit ||
          reportTeam.RolesValidation !== updatedTeam.RolesValidation
        ) {
          await reportTeam.update(
            {
              CanEdit: updatedTeam.CanEdit,
              RolesValidation: updatedTeam.RolesValidation,
            },
            { transaction }
          );
        }
      }
    });

    await Promise.all(updateReportTeamPromises);

    // Update the NavigationContent with other attributes
    await navigation.update(
      {
        NavigationSetupId,
        OrganisationId,
        Type,
        IsRls,
        Title,
        PagePath,
        Parent,
        PageType,
        ReportType,
        ReportDatasetId,
        Toggler,
        Icon,
        Description,
        PowerBiWorkspace,
        DisplayUseDynamicBinding,
        DynamicDataSetid,
        ReportPages,
        ShowFilter,
        ShowContentPane,
        HideTitleAnddescription,
        HideTitleSection,
        ShowSharingButton,
        ShowExportButton,
        SortOrder,
        __RequestVerificationToken,
        EmbedUrl,
        type,
        NavSecurity,
        TenantId: user.currentTenant,
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    // Respond with success message and updated navigation
    res
      .status(200)
      .json({ message: "Navigation updated successfully", navigation });
  } catch (error) {
    console.error("Error updating navigation:", error);
    await transaction.rollback();
    return next(createError.createError(500, "Internal Server Error"));
  }
};

// DELETE NAVIGATION

exports.deleteNavigation = async (req, res, next) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const navigationContent = await NavigationContent.findByPk(id);

    if (!navigationContent) {
      return next(createError.createError(404, "NavigationContent not found"));
    }

    await ReportTeam.destroy(
      { where: { NavigationContentId: id } },
      { transaction }
    );

    await navigationContent.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      message:
        "NavigationContent and associated ReportTeams deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting NavigationContent:", error);
    await transaction.rollback();

    return next(createError.createError(500, "Internal server error"));
  }
};
