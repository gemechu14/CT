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
const ThemeColor = require("../models/themeColors.js");
const ThemeLayout = require("../models/themeLayout.js");
const ThemeBranding = require("../models/themeBranding.js");

// GET ALL USER
exports.getAllTenants = async (req, res, next) => {
  try {

    const isSuperTenant= req.user.isSuperTenant;

    if(isSuperTenant){
    const tenants = await Tenant.findAll({
      // where:{ isActive:true}

    });

    return res.status(200).json(tenants);
  }

  else{

    const tenants = await Tenant.findAll({
      include: [
        {
          model: User,
          where: { id: req.user.id }, // Ensure that only the specified user is included
          through: {
            model: UserTenant,
            attributes: [], // Exclude UserTenant attributes if not needed
          },
          attributes: [], // Exclude User attributes if not needed
          required: true, // Ensure the join is not optional
        },
      ],
    });

    return res.status(200).json(tenants);


  }
    
  } catch (error) {
    console.log(error)
    return next(createError.createError(500, "Internal server Error"));
  }
};

// // CREATE ROLE
// exports.createTenant = async (req, res, next) => {
//   const transaction = await sequelize.transaction();
//   try {
 

//     const {
//       tenantName,
//       tenantStatus,
//       isSuperTenant,
//       language,
//       numberOfTeams,
//       numberOfUsers,
//       powerBIWorkspace,
//     } = req.body;
//     const existingTenant = await Tenant.findOne({ where: { tenantName } });
//     if (existingTenant) {
//       return next(createError.createError(400, "Tenant already defined "));
//     }

  
//     const tenant = await Tenant.create({
//       tenantName,
//       tenantStatus,
//       isSuperTenant,
//       language,
//       numberOfTeams,
//       numberOfUsers,
//       powerBIWorkspace,
//     },{transaction});

//   //Assign SUPER ADMIN TO CREATED TENANT

//   const superTenant= await User.findOne({where:{ isSuperTenant: true}})
    

//   const assignTenant= await UserTenant.create({
//     UserId: superTenant.id,
//     TenantId: tenant.id
//   }, {transaction})

// //ASSIGN THEME COLOR
// const newThemeColor = await ThemeColor.create({
//   brandPrimaryColor: "#081C2E",
//   sideNavigationPanelItemHighlight :"#F0F0F0",
//   sideNavigationFontHover :"#C7C7C7",
//   topNavigationPanelPrimary :"#ffffff",
//   reportPaneBackground:"#FFFFFF",
//   navigationArrowColor:"#D95558", 
//   sideNavigationHeaderFontColor:"#FFFFFF",
//   sideNavigationFontPrimary:"#FFFFFF",
//   buttonFaceColor:"#595959",
//   topNavigationPanelSecondary:"#081C2E",
//   contentPaneTitles:"#D95558",
//   sideNavigationPanelPrimary:"#081C2E",
//   sideNavigationPanelSecondary:"#D95558",
//   topNavatigationFont:"#403A3A",
//   paneNameCurrentPage:"#F3F4F6",
//   navigationBorderColor:"#D95558",
//   TenantId: tenant.id
// },{transaction});

// //ASSIGN LAYOUT
// const newThemeLayout = await ThemeLayout.create({
//   layout: 'Modern',
//   TenantId: tenant.id
// },{transaction});

// //ASSIGN THEME BRAND
// const newThemeBranding = await ThemeBranding.create({
//   logoImage :"http://35.84.123.119:4400/uploads/imageUrl-1718787785930-313132666.jpg",
//   siteFaviconImage :"http://35.84.123.119:4400/uploads/imageUrl-1718787785930-313132666.jpg",
//   customLoader:"http://35.84.123.119:4400/uploads/customLoader-1720701314174-483869383.gif",
//   loginLogoutBackground: "#ffffff",
//   showFooter :"true",
//   secondaryLogoImage:"http://35.84.123.119:4400/uploads/imageUrl-1718787785930-313132666.jpg",
//   externalLinks :"http://35.84.123.119",
//   TenantId: tenant.id
// },{transaction});



//   await transaction.commit();

//     res
//       .status(201)
//       .json({ message: "Tenant registered successfully", tenant: tenant });
//   } catch (error) {
//     console.log(error)
//     await transaction.rollback();
//     return next(createError.createError(500, "Internal server Error"));
//   }
// };


// CREATE ROLE
exports.createTenant = async (req, res, next) => {
  const transaction = await sequelize.transaction();
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
      return next(createError.createError(400, "Tenant already defined"));
    }

    // Create the new tenant
    const tenant = await Tenant.create(
      {
        tenantName,
        tenantStatus,
        isSuperTenant,
        language,
        numberOfTeams,
        numberOfUsers,
        powerBIWorkspace,
      },
      { transaction }
    );

    // Fetch ALL super tenants
    const superTenants = await User.findAll({ where: { isSuperTenant: true } });

    // Prepare the data for bulk insert
    const userTenantData = superTenants.map(superTenant => ({
      UserId: superTenant.id,
      TenantId: tenant.id
    }));

    // Perform bulk insert of super tenants to the tenant
    await UserTenant.bulkCreate(userTenantData, { transaction });

    // Assign THEME COLOR
    const newThemeColor = await ThemeColor.create(
      {
        brandPrimaryColor: "#081C2E",
        sideNavigationPanelItemHighlight: "#F0F0F0",
        sideNavigationFontHover: "#C7C7C7",
        topNavigationPanelPrimary: "#ffffff",
        reportPaneBackground: "#FFFFFF",
        navigationArrowColor: "#D95558",
        sideNavigationHeaderFontColor: "#FFFFFF",
        sideNavigationFontPrimary: "#FFFFFF",
        buttonFaceColor: "#595959",
        topNavigationPanelSecondary: "#081C2E",
        contentPaneTitles: "#D95558",
        sideNavigationPanelPrimary: "#081C2E",
        sideNavigationPanelSecondary: "#D95558",
        topNavatigationFont: "#403A3A",
        paneNameCurrentPage: "#F3F4F6",
        navigationBorderColor: "#D95558",
        TenantId: tenant.id,
      },
      { transaction }
    );

    // Assign LAYOUT
    const newThemeLayout = await ThemeLayout.create(
      {
        layout: "Modern",
        TenantId: tenant.id,
      },
      { transaction }
    );

    // Assign THEME BRANDING
    const newThemeBranding = await ThemeBranding.create(
      {
        logoImage: "http://35.84.123.119:4400/uploads/imageUrl-1718787785930-313132666.jpg",
        siteFaviconImage: "http://35.84.123.119:4400/uploads/imageUrl-1718787785930-313132666.jpg",
        customLoader: "http://35.84.123.119:4400/uploads/customLoader-1720701314174-483869383.gif",
        loginLogoutBackground: "#ffffff",
        showFooter: "true",
        secondaryLogoImage: "http://35.84.123.119:4400/uploads/imageUrl-1718787785930-313132666.jpg",
        externalLinks: "http://35.84.123.119",
        TenantId: tenant.id,
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    res.status(201).json({ message: "Tenant registered successfully", tenant: tenant });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
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
// //DELETE TENANT
// exports.deleteTenant = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const tenants = await Tenant.findOne({ where: { id: id } });
//     if (!tenants) {
//       return next(createError.createError(404, "Tenant not found"));
//     }
//     await tenants.update({ isActive: false, where: { id } });

//     res.status(200).json({ message: "Deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     return next(createError.createError(500, "Internal server error"));
//   }
// };

// DELETE TENANT
exports.deleteTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findOne({ where: { id: id } });
    if (!tenant) {
      return next(createError.createError(404, "Tenant not found"));
    }
    
    await tenant.destroy(); // Use destroy method to delete the tenant

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
  const currentTenant= await Tenant.findOne({where:{id: tenantId}})

  if(!currentTenant.isActive){
return next(createError.createError(400,"Your tenant is currently suspended, and you cannot log in"))
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


exports.suspendTenant= async(req,res,next)=>{
  try {
    const {tenantId}=req.body;
    const tenants= await Tenant.findOne({where:{id: Number(tenantId)}})
    if(!tenants){
      return next(createError.createError(404,"Tenant not found"))
    }
    // return res.json(tenants.isActive)
    if(!tenants?.isActive){
      return next(createError.createError(400,"Tenant already suspended"))

    }

    const result = await tenants.update({isActive:"false"});

    res.status(200).json({
      message: "suspended successfully",
      // data: result,
    });
    
  } catch (error) {
    console.log(error);
    // await transaction.rollback();
    return next(createError.createError(500, "Internal server Error"));
  }
}



//ACTIVATE TENANT

exports.ActivateTenant= async(req,res,next)=>{
  try {
    const {tenantId}=req.body;
    const tenants= await Tenant.findOne({where:{id: Number(tenantId)}})
    if(!tenants){
      return next(createError.createError(404,"Tenant not found"))
    }
    // return res.json(tenants.isActive)
    if(tenants?.isActive){
      return next(createError.createError(400,"Tenant already Active"))

    }

    const result = await tenants.update({isActive:"true"});

    res.status(200).json({
      message: "Tenant Activated successfully",
      // data: result,
    });
    
  } catch (error) {
    console.log(error);
    // await transaction.rollback();
    return next(createError.createError(500, "Internal server Error"));
  }
}

// CHANGE DEFAULT TENANT
exports.changeDefaultTenant = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { tenantId } = req.body;

    // Find the user
    const user = await User.findByPk(req.user.id, { transaction });

    // Check if the provided tenant ID is already the default tenant
    if (tenantId === user.defaultTenant) {
      await transaction.rollback();
      return next(createError.createError(400, "The specified tenant is already your default tenant"));
    }

    // Check if the user is assigned to the provided tenant
    const tenant = await UserTenant.findOne({
      where: { UserId: Number(req.user.id), TenantId: tenantId },
      transaction
    });

    if (!tenant) {
      await transaction.rollback();
      return next(createError.createError(404, "User not assigned to the specified tenant"));
    }

    // Update the user's default tenant
    await user.update(
      { defaultTenant: tenantId },
      { transaction }
    );

    await transaction.commit();
    return res.status(200).json({
      message: "Default tenant changed successfully"
    });

  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};

