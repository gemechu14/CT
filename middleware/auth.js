const createError= require("../utils/errorResponse.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const user=require("../models/Users.js");
const User = require("../models/Users.js");


exports.protect = async (req, res, next) => {
    try {
        
      let token;
      
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req?.cookies?.jwt) {
        token = req?.cookies?.jwt;
      }
      if (!token || token === "expiredtoken") {
        return next(createError.createError(401,  "You are not logged in, please log in to get access" ));
      
     
      }
      const decoded = await promisify(jwt.verify)(token, "secret");
      let currentUser;
  
       currentUser =  await User.findByPk(Number(decoded.id));
  
   
  
      if (!currentUser) {
        return next(createError.createError(401,  `currentUserdoes not longer exists ` ));
        
      }
 
      else {
        req.user = currentUser;
  
        next();
      }
    } catch (err) {
      console.log(err);  
      return next(createError.createError(401,  "unauthorized access" ));
     
    }
  };

  //Restricted to SUPERTENANT
exports.restrictTo = () => {
  return async (req, res, next) => {
    if (req.user.isSuperTenant) {
      next();
 
    } else {
      return next(createError.createError(401, "You do not have permission to perform this action" ));
      
    }
  };
};

//Restricted to SUPERTENANT
exports.restrictToSuperTenant = () => {
  return async (req, res, next) => {
    // return res.json("data")
    // Check if the user is a super tenant
    if (req.user && req.user.isSuperTenant) {
      next();
    } else {
      return next(createError(401, "You do not have permission to perform this action"));
    }
  };
};