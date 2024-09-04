const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");
const createError = require("../utils/errorResponse.js");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const Tenant = require("../models/tenant.js");
const sequelize = require("../database/db");
const UserRole = require("../models/userRole.js");
const UserTenant = require("../models/userTenant.js");
const Address =require("../models/address.js")
const axios= require("axios");
const passport= require("passport");
const GoogleStrategy= require("passport-google-oauth2").Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
// const MicrosoftStrategy = require('passport-microsoft-auth').Strategy;
const msal = require('@azure/msal-node');
const Capacity = require("../models/capacity.js");
const { Op, Sequelize } = require("sequelize");
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const middleware= require("../middleware/auth.js")
// const activateCapacityIfNeeded = require('../utils/activateCapacity.js');
const activateCapacity = require('../utils/activateCapacity.js');
const ThemeBranding = require("../models/themeBranding.js");
const ThemeLayout = require("../models/themeLayout.js");
const ThemeColor = require("../models/themeColors.js");
const sendEmail= require("../utils/sendEmail.js");

const crypto = require('crypto');

require("dotenv").config();



const tokenBlacklist = new Set(); // Example using a Set for simplicity

const checkTokenBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
  next();
};

const signToken = (
  id,
  email,
  roleId,
  tenant,
  defaultTenant,
  currentTenant,
  isSuperTenant
) => {
  try {
    const expiresInSec = 5000
    const token = jwt.sign(
      { id, email, roleId, tenant, defaultTenant, currentTenant,isSuperTenant },
      "secret",
      {
        expiresIn: "7d",
      }
    );

    const refreshToken = jwt.sign(
      { id, email, roleId, tenant, defaultTenant, currentTenant ,isSuperTenant},
      "refreshSecret",
      {
        expiresIn: "90d",
      }
    );
    return { token, refreshToken };
  } catch (err) {
    return err;
  }
};

const createSendToken = async (user, statusCode, res,next) => {
  try {

    const { token, refreshToken } = signToken(
      user.id,
      user.email,
      user.roleId,
      // user.permissions,
      user.tenant,
      user.defaultTenant,
      user.defaultTenant,
      user.isSuperTenant
    );

    await User.update(
      { currentTenant: user.defaultTenant ,
        isLoggedIn:true,
      },
      { where: { id: user.id } }
    );
    // await user.update({currentTenant:user.defaultTenant})


  
    const cookieOptions = {
      expires: new Date(Date.now() +  1000),
      secure: "production" ? true : false,
      httpOnly: true,
    };

    user.password = undefined;
    res.cookie("jwt", token, cookieOptions);
    
    res.status(statusCode).json({
      token,
      refreshToken,
    });
  
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.name });
  }
};


//LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Please provide both email and password"));
    }
    const lowerCaseEmail = email.toLowerCase();

    const user = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('email')),
        lowerCaseEmail
      ),
      include: [
        {
          model: Tenant,

          through: { attributes: [] },
        },
        {
          model: Role,
          // through: { attributes: [] }, // To exclude the UserRole pivot table data
          // include: {
          //   model: Permission,
          //   through: { attributes: [] }, // To exclude the RolePermission pivot table data
          // },
        },
      ],
    });

      

   
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(
        createError.createError(
          401,
          "Unauthorized access - Invalid email, password"
        )
      );
    }
       //CHECK TENANT

       const tenantStatus= await Tenant.findOne({where:{id: Number(user.defaultTenant)}})

       if(!tenantStatus.isActive){
        return next(createError.createError(400,"Your tenant is currently suspended, and you cannot log in"))
 
       }
 

    if (user?.isActive === false) {
      return next(createError.createError(400, "Your account is currently inactive. Please contact support for assistance."));
    }
    // const permissions = user.Roles.reduce((acc, role) => {
    //   role.Permissions.forEach((permission) => {
    //     if (!acc.includes(permission.name)) {
    //       acc.push(permission.name);
    //     }
    //   });
    //   return acc;
    // }, []);
    // Extract all tenantIds from user.Tenants
    const tenantIds = user.Tenants.map((tenant) => tenant.id);
    // Construct the desired output object
    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isSuperTenant: user.isSuperTenant,
      defaultTenant: user.defaultTenant,
      currentTenant: user.defaultTenant,
      isSuperTenant:user.isSuperTenant,
      roleId:user?.Role?.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
  
      // permissions: permissions,
      tenant: tenantIds,
    };

    createSendToken(userData, 200, res,next);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};

exports.signup = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      password,
      phoneNumber,

      roleId,
    } = req.body;

    



   // Check if there is at least one user in the system
   const userCount = await User.count();

   if (userCount > 0) {
     return next(createError.createError(500, "You are already signed up by this package"));
   }


   
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(createError.createError(500, "User already exists"));
    }


//CREATE TENANT
    const tenant = await Tenant.create(
      {
        tenantName: "superTenant",
        tenantStatus: "created",
        isSuperTenant: true,
      },
      { transaction }
    );
    const defaultRole = await Role.findOne({ where: { name: "Admin" } });

    defaultRole.update({ TenantId: tenant.id }, { transaction });
    const newUser = await User.create(
      {
        firstName,
        lastName,
        dateOfBirth,
        email,
        password,
        phoneNumber,
        isSuperTenant: true,
        defaultTenant: tenant.id,
        RoleId: defaultRole.id  ?? null
      },
      { transaction }
    );

 
    await UserTenant.create(
      {
        UserId: newUser.id,
        TenantId: tenant.id,
      },
      { transaction }
    );




//ASSIGN THEME COLOR
const newThemeColor = await ThemeColor.create({
  brandPrimaryColor: "#081C2E",
  sideNavigationPanelItemHighlight :"#F0F0F0",
  sideNavigationFontHover :"#C7C7C7",
  topNavigationPanelPrimary :"#ffffff",
  reportPaneBackground:"#FFFFFF",
  navigationArrowColor:"#D95558", 
  sideNavigationHeaderFontColor:"#FFFFFF",
  sideNavigationFontPrimary:"#FFFFFF",
  buttonFaceColor:"#595959",
  topNavigationPanelSecondary:"#081C2E",
  contentPaneTitles:"#D95558",
  sideNavigationPanelPrimary:"#081C2E",
  sideNavigationPanelSecondary:"#D95558",
  topNavatigationFont:"#403A3A",
  paneNameCurrentPage:"#F3F4F6",
  navigationBorderColor:"#D95558",
  TenantId: tenant.id
},{transaction});

//ASSIGN LAYOUT
const newThemeLayout = await ThemeLayout.create({
  layout: 'Modern',
  TenantId: tenant.id
},{transaction});

//ASSIGN THEME BRAND
const newThemeBranding = await ThemeBranding.create({
  logoImage :"https://cedarplatform.io:4400/uploads/imageUrl-1718787785930-313132666.jpg",
  siteFaviconImage :"https://cedarplatform.io:4400/uploads/imageUrl-1718787785930-313132666.jpg",
  customLoader:"https://cedarplatform.io:4400/uploads/customLoader-1720701314174-483869383.gif",
  loginLogoutBackground: "#ffffff",
  showFooter :"true",
  secondaryLogoImage:"https://cedarplatform.io:4400/uploads/imageUrl-1718787785930-313132666.jpg",
  externalLinks :"https://cedarplatform.io",
  TenantId: tenant.id
},{transaction});








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


//GOOGLE AND MICROSOFT AUTHENTICATION

exports.googleAuthentication = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email ) {
      return next(createError(400, "Please provide both email"));
    }
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Tenant,

          through: { attributes: [] },
        },
        {
          model: Role,
          // through: { attributes: [] }, // To exclude the UserRole pivot table data
          // include: {
          //   model: Permission,
          //   through: { attributes: [] }, // To exclude the RolePermission pivot table data
          // },
        },
      ],
    });

        if(!user){

          return next(createError.createError(400," User not found"))
        }

 

    if (user?.isActive === false) {
      return next(createError.createError(400, "Your account is currently inactive. Please contact support for assistance."));
    }
 
    const tenantIds = user.Tenants.map((tenant) => tenant.id);
    // Construct the desired output object
    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isSuperTenant: user.isSuperTenant,
      defaultTenant: user.defaultTenant,
      currentTenant: user.defaultTenant,
      isSuperTenant:user.isSuperTenant,
      roleId:user?.Role?.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
  
      // permissions: permissions,
      tenant: tenantIds,
    };

    createSendToken(userData, 200, res);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};

exports.logout = async (req, res) => {
  
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    secure: 'production' ? true : false,
    httpOnly: true,
  };
    // return res.json(req.user)
  
   await User.update(
    {       isLoggedIn:false,
    },
    { where: { id: req.user.id } }
  );


  res.cookie("jwt", "expiredtoken", cookieOptions);
  // res.cookie('jwt', 'expiredtoken', cookieOptions);

  res.status(200).json({
    status: 'success',
    message: 'logged out successfully',
  });
};

//GET USER PROFILE
exports.getProfile= async( req,res,next)=>{
  try {
    const userId= req?.user?.id;

    
    const user = await User.findOne(
      {where: { id: userId},
      attributes:{exclude:"password"},
    include:[
      {model:Role  },
      {model:Address},
      // {model:Tenant},
    
    ]}
    )

    // if (user && user.imageUrl) {
    //   user.imageUrl = `https://ct-x8hh.onrender.com/${user.imageUrl.replace(/\\/g, '/')}`;
    // }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error)
    return next(createError.createError(500,"Internal server error"))
    
  }
}

//CHECK SUPERTENANT
exports.checkSuperTenant= async( req,res,next)=>{
  try {
    
    const user = await User.findOne(
      {where: { isSuperTenant: true},
      attributes:{exclude:"password"},
      }
    )

 if(user){
  return res.status(200).json(
    {isExist :true}
  )
 }else{
  return res.status(404).json(
    {isExist :false}
  )
 }

    return res.json(user.length)
    // if (user && user.imageUrl) {
    //   user.imageUrl = `https://ct-x8hh.onrender.com/${user.imageUrl.replace(/\\/g, '/')}`;
    // }

  } catch (error) {
    console.log(error)
    return next(createError.createError(500,"Internal server error"))
    
  }
}


/// FORGET PASSWORD
exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(createError.createError(400, "Please provide an email address"));
    }

    // 1. Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(createError.createError(404, "No user found with that email"));
    }

    // 2. Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Hash the token and set expiration
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    // 4. Update the user's reset token and expiration in the database
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();

    // 5. Send the reset link via email
    const resetURL = `https://cedarplatform.io/auth/createPassword/${resetToken}`;
    //const message = `Forgot your password? Submit a request with your new password to: ${resetURL}\nIf you didn't request this, please ignore this email.`;


    const message = `
Hello,

We received a request to reset your password. You can reset your password by clicking the link below:

${resetURL}

This link will expire in 10 minutes, so please use it as soon as possible.

If you did not request a password reset, you can safely ignore this email.

Best regards,
Cedarplatform Team
`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        text: message,
      });

      
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      return next(createError.createError(500, 'There was an error sending the email. Try again later.'));
    }

  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};


///RESET Password
exports.resetPassword = async (req, res, next) => {
  try {
   
    const resetToken = req?.params?.token;

   
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');


    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: Date.now() }, 
      },
    });

    if (!user) {
      return next(createError.createError(400, 'Token is invalid or has expired'));
    }

  
    const { newPassword } = req.body;
    if (!newPassword) {
      return next(createError.createError(400, 'Please provide a new password'));
    }

  
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

   
    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully',
    });

 
    
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, 'Internal server error'));
  }
};