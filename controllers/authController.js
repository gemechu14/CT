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
const msal = require('@azure/msal-node');




//MICROSOFT AUTHENTICATION
const config = {
  auth: {
      clientId: 'e7a57613-cc2f-496c-8cd6-1d2950a04a12', // Replace with your ID
      authority: `https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a`, // Replace with your tenant ID
      redirectUri: 'localhost:4400/auth/microsoft/callback' // Replace if needed
  },
  cache: {
      cacheLocation: 'sessionStorage' // Adjust if needed (e.g., for persisted logins)
  }
};
const pca = new msal.PublicClientApplication(config);


exports.microsoftAuthentication= async(req,res,next)=>{

  try {
    console.log("here")
    console.log(pca)

    const loginRequest = {
      scopes: ['user.read'] // Replace with desired scopes
  };

  // Redirect the user to the Microsoft login page
  const authResult = await pca.acquireTokenRedirect(loginRequest);
  console.log(authResult);
    
  } catch (error) {
console.log(error.message);

return next(createError.createError(500,error.message))
  }
}



async function login() {
  try {
      const loginRequest = {
          scopes: ['user.read'] // Replace with desired scopes
      };

      // Redirect the user to the Microsoft login page
      const authResult = await pca.acquireAuthCodeFlow(loginRequest);
      console.log(authResult); // For debugging purposes

      // Handle redirect and extract access token
      // (Covered in step 6)
  } catch (error) {
      console.error(error);
  }
}








//END OF MICROSOFT AUTHENTICATION

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

const createSendToken = async (user, statusCode, res) => {
  try {
    // return res.json(user)
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
    return res.status(500).json({ message: error.name });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Please provide both email and password"));
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

    // return res.json(user)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(
        createError.createError(
          401,
          "Unauthorized access - Invalid email, password"
        )
      );
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

    createSendToken(userData, 200, res);
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
      // streetNumber,
      // streetName,
      // streetType,
      // city,
      // state,
      // country,
      // postalCode,
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



exports.logout = async (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    secure: 'production' ? true : false,
    httpOnly: true,
  };
    return res.json(req.user)
  
   await User.update(
    {       isLoggedIn:false,
    },
    { where: { id: req.user.id } }
  );

  res.cookie('jwt', 'expiredtoken', cookieOptions);
  res.status(200).json({
    status: 'success',
    message: 'logged out successfully',
  });
};


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

    if (user && user.imageUrl) {
      user.imageUrl = `https://ct-x8hh.onrender.com/${user.imageUrl.replace(/\\/g, '/')}`;
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error)
    return next(createError.createError(500,"Internal server error"))
    
  }
}

// GOOGLE AUTHENTICATION

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:4400/auth/google/callback',
  passReqToCallback: true
},
async function (request, accessToken, refreshToken, profile, done) {
  try {
    const email = profile.emails[0].value;
    const user = await User.findOne({
      where: { email },
      include: {
        model: Tenant,
        through: { attributes: [] },
      },
    });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    // Store user in request for the next middleware
    request.user = user;
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
//MICROSOFT

// tenant:'f8cdef31-a31e-4b4a-93e4-5f571e91255a',

passport.use(new MicrosoftStrategy({
  clientID: 'e7a57613-cc2f-496c-8cd6-1d2950a04a12',
  clientSecret: 'TnY8Q~47CWV43~GeFBMUA7Ac1CtN_aY-xCj-0aoA', 
  callbackURL: 'localhost:4400/auth/microsoft/callback',
  tenant: 'f8cdef31-a31e-4b4a-93e4-5f571e91255a',
  passReqToCallback: true,
  scope: ['user.read.all']
},
async function (request, accessToken, refreshToken, profile, done) {
  try {
    const email = profile.emails[0].value;
    const user = await User.findOne({
      where: { email },
      include: {
        model: Tenant,
        through: { attributes: [] },
      },
    });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    request.user = user;
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  if (user) {
    done(null, user);
  } else {
    done(new Error('User not found'));
  }
});



exports.handleGoogleCallback = async (req, res) => {
  await createSendToken(req.user, 200, res);
};



exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.send('Logged out successfully');
    });
  });
};